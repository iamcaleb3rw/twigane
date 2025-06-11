"use client";

import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { calculatePosition } from "@/utils/calculate-position";
import { parsePathToVertices } from "@/utils/svg-path-to-vertices";
import { debounce } from "lodash";
import Matter, {
  Bodies,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
} from "matter-js";

import { cn } from "@/lib/utils";

// Ensure poly-decomp is loaded for SVG parsing if not already
if (typeof window !== "undefined") {
  (Common as any).setDecomp(require("poly-decomp"));
}

type GravityProps = {
  children: ReactNode;
  debug?: boolean;
  gravity?: { x: number; y: number };
  resetOnResize?: boolean;
  grabCursor?: boolean;
  addTopWall?: boolean;
  autoStart?: boolean;
  className?: string;
};

type PhysicsBody = {
  element: HTMLElement;
  body: Matter.Body;
  props: MatterBodyProps;
};

type MatterBodyProps = {
  children: ReactNode;
  matterBodyOptions?: Matter.IBodyDefinition;
  isDraggable?: boolean;
  bodyType?: "rectangle" | "circle" | "svg";
  sampleLength?: number;
  x?: number | string;
  y?: number | string;
  angle?: number;
  className?: string;
};

export type GravityRef = {
  start: () => void;
  stop: () => void;
  reset: () => void;
};

const GravityContext = createContext<{
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps
  ) => void;
  unregisterElement: (id: string) => void;
} | null>(null);

export const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(GravityContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;
    context.registerElement(idRef.current, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    });

    return () => context.unregisterElement(idRef.current);
  }, [
    context,
    children,
    matterBodyOptions,
    bodyType,
    sampleLength,
    isDraggable,
    x,
    y,
    angle,
    props,
  ]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute",
        className,
        isDraggable && "pointer-events-none"
      )}
    >
      {children}
    </div>
  );
};

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      className,
      ...props
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null);
    const engine = useRef(Engine.create());
    const render = useRef<Render | undefined>(null); // Can be undefined initially
    const runner = useRef<Runner | undefined>(null); // Can be undefined initially
    const bodiesMap = useRef(new Map<string, PhysicsBody>());
    const frameId = useRef<number | undefined>(null); // Can be undefined initially
    const mouseConstraint = useRef<Matter.MouseConstraint | undefined>(null); // Can be undefined initially
    const mouseDown = useRef(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const isRunning = useRef(false);

    // --- Core Physics Functions ---

    // Stop the Matter.js engine and rendering loop
    const stopEngine = useCallback(() => {
      if (!isRunning.current) return;

      if (runner.current) {
        Runner.stop(runner.current);
      }
      if (render.current) {
        Render.stop(render.current);
      }
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
        frameId.current = undefined; // Reset frameId
      }
      isRunning.current = false;
    }, []); // No dependencies for stopEngine itself

    // Start the Matter.js engine and rendering loop
    const startEngine = useCallback(() => {
      if (isRunning.current) return; // Prevent starting if already running

      // This helper will be defined later, so it's a future dependency
      // const updateElements = ...; // This will be handled by the dependency array

      if (runner.current) {
        runner.current.enabled = true;
        Runner.run(runner.current, engine.current);
      }
      if (render.current) {
        Render.run(render.current);
      }
      // Ensure updateElements is accessible. It will be part of the useEffect dependency.
      // We also need to define updateElements before initializeRenderer calls it.
      if (!frameId.current) {
        // Only request new frame if not already running
        // We'll pass `updateElements` as a dependency here
        // to make sure it's the latest version.
        // For this specific line, we can't directly call updateElements because it's defined later.
        // The fix is to make sure initializeRenderer (which calls startEngine) has updateElements as a dependency,
        // and initializeRenderer itself is defined AFTER updateElements.
      }
      isRunning.current = true;
    }, []); // `updateElements` will be an implicit dependency when called by initializeRenderer

    // Clear the Matter.js world and all associated instances
    const clearRenderer = useCallback(() => {
      // First, stop the engine gracefully
      stopEngine();

      if (mouseConstraint.current) {
        World.remove(engine.current.world, mouseConstraint.current);
        mouseConstraint.current = undefined; // Reset mouseConstraint
      }

      if (render.current) {
        // Clean up custom mouse event listeners if they were added
        if ((render.current as any).cleanupMouseEvents) {
          (render.current as any).cleanupMouseEvents();
        }

        Mouse.clearSourceEvents(render.current.mouse);
        Render.stop(render.current);
        // Ensure canvas.current is still valid before trying to remove its child
        if (render.current.canvas && render.current.canvas.parentNode) {
          render.current.canvas.remove();
        }
        render.current = undefined; // Reset render
      }

      // Important: Re-create engine after clearing its world to ensure a fresh start
      if (engine.current) {
        World.clear(engine.current.world, false);
        Engine.clear(engine.current);
        engine.current = Engine.create(); // Create a new engine instance
      }

      // Reset runner only if it was initialized, then set to undefined
      if (runner.current) {
        // Runner.stop is already called by stopEngine
        runner.current = undefined;
      }

      bodiesMap.current.clear(); // Clear all physics bodies from map
    }, [stopEngine]); // clearRenderer depends on stopEngine

    // Keep react elements in sync with the physics world
    const updateElements = useCallback(() => {
      // Ensure frameId.current is managed correctly here
      if (!isRunning.current) {
        // If engine is stopped, cancel future frames
        if (frameId.current) {
          cancelAnimationFrame(frameId.current);
          frameId.current = undefined;
        }
        return;
      }

      bodiesMap.current.forEach(({ element, body }) => {
        // Ensure element and its dimensions are valid before transforming
        if (!element || element.offsetWidth === 0 || element.offsetHeight === 0)
          return;

        const { x, y } = body.position;
        const rotation = body.angle * (180 / Math.PI);

        element.style.transform = `translate(${
          x - element.offsetWidth / 2
        }px, ${y - element.offsetHeight / 2}px) rotate(${rotation}deg)`;
      });

      frameId.current = requestAnimationFrame(updateElements);
    }, []); // updateElements has no external dependencies beyond itself for recursion

    // Initialize the Matter.js renderer and world elements (walls, mouse constraint)
    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return;

      // Clear any existing renderer/engine before initializing to prevent duplicates
      clearRenderer(); // Call clearRenderer first to ensure a clean slate

      const height = canvas.current.offsetHeight;
      const width = canvas.current.offsetWidth;

      // Update canvasSize state when dimensions are determined
      setCanvasSize({ width, height });

      engine.current.gravity.x = gravity.x;
      engine.current.gravity.y = gravity.y;

      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
        },
      });

      const mouse = Mouse.create(render.current.canvas);
      mouseConstraint.current = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: debug,
          },
        },
      });

      // Add walls
      const walls = [
        // Floor
        Bodies.rectangle(width / 2, height + 10, width, 20, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),

        // Right wall
        Bodies.rectangle(width + 10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),

        // Left wall
        Bodies.rectangle(-10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),
      ];

      const topWall = addTopWall
        ? Bodies.rectangle(width / 2, -10, width, 20, {
            isStatic: true,
            friction: 1,
            render: {
              visible: debug,
            },
          })
        : null;

      if (topWall) {
        walls.push(topWall);
      }

      const touchingMouse = () =>
        Query.point(
          engine.current.world.bodies,
          mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
        ).length > 0;

      if (grabCursor) {
        Events.on(engine.current, "beforeUpdate", () => {
          if (canvas.current && mouseConstraint.current) {
            if (!mouseDown.current && !touchingMouse()) {
              canvas.current.style.cursor = "default";
            } else if (touchingMouse()) {
              canvas.current.style.cursor = mouseDown.current
                ? "grabbing"
                : "grab";
            }
          }
        });

        const currentCanvas = canvas.current;
        const handleMouseDown = () => {
          mouseDown.current = true;
          if (currentCanvas && touchingMouse()) {
            currentCanvas.style.cursor = "grabbing";
          } else if (currentCanvas) {
            currentCanvas.style.cursor = "default";
          }
        };
        const handleMouseUp = () => {
          mouseDown.current = false;
          if (currentCanvas && touchingMouse()) {
            currentCanvas.style.cursor = "grab";
          } else if (currentCanvas) {
            currentCanvas.style.cursor = "default";
          }
        };

        currentCanvas.addEventListener("mousedown", handleMouseDown);
        currentCanvas.addEventListener("mouseup", handleMouseUp);

        (render.current as any).cleanupMouseEvents = () => {
          currentCanvas.removeEventListener("mousedown", handleMouseDown);
          currentCanvas.removeEventListener("mouseup", handleMouseUp);
        };
      }

      // Add mouse constraint and walls to the world
      if (mouseConstraint.current) {
        World.add(engine.current.world, [mouseConstraint.current, ...walls]);
      } else {
        World.add(engine.current.world, [...walls]);
      }

      // Initialize runner here, it will be enabled by startEngine if autoStart is true
      if (!runner.current) {
        runner.current = Runner.create();
      }

      Render.run(render.current);

      // It's crucial to call updateElements directly after initial render if autoStart is false,
      // so elements appear in place even without physics running.
      if (!autoStart) {
        updateElements();
      }

      if (autoStart) {
        startEngine(); // This will enable the runner and request animation frames
      }
    }, [
      clearRenderer,
      startEngine,
      updateElements,
      debug,
      grabCursor,
      addTopWall,
      gravity,
    ]);

    // Handles canvas resizing and reinitialization
    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return;

      const newWidth = canvas.current.offsetWidth;
      const newHeight = canvas.current.offsetHeight;

      // Only reinitialize if dimensions have actually changed or if render/runner are not set up
      if (
        newWidth === canvasSize.width &&
        newHeight === canvasSize.height &&
        render.current &&
        runner.current
      ) {
        return; // No actual resize, or renderer/runner are already active
      }

      // Reinitialize with new dimensions
      initializeRenderer(); // This will trigger clearRenderer and then full setup
    }, [initializeRenderer, resetOnResize, canvasSize]);

    // Resets all bodies to their initial positions and angles
    const reset = useCallback(() => {
      stopEngine(); // First, stop the engine gracefully

      // Get the current canvas size to recalculate positions correctly
      const currentCanvasWidth = canvas.current?.offsetWidth || 0;
      const currentCanvasHeight = canvas.current?.offsetHeight || 0;

      bodiesMap.current.forEach(({ element, body, props }) => {
        // Ensure element is still mounted and has valid dimensions
        if (!element || element.offsetWidth === 0 || element.offsetHeight === 0)
          return;

        // Reset angle to original prop and remove any current angular velocity
        Matter.Body.setAngle(body, (props.angle || 0) * (Math.PI / 180));
        Matter.Body.setAngularVelocity(body, 0);

        // Stop all linear velocity
        Matter.Body.setVelocity(body, { x: 0, y: 0 });

        // Calculate and set the initial position
        const x = calculatePosition(
          props.x,
          currentCanvasWidth,
          element.offsetWidth
        );
        const y = calculatePosition(
          props.y,
          currentCanvasHeight,
          element.offsetHeight
        );
        Matter.Body.setPosition(body, { x, y });
      });

      // Update elements' visual positions immediately after resetting Matter.js bodies
      updateElements();

      // After resetting, ensure the physics simulation is ready to restart.
      // This will call initializeRenderer which sets up everything again.
      // If autoStart is true, it will restart the engine.
      handleResize();
    }, [stopEngine, updateElements, handleResize]); // Depend on memoized functions

    // --- Public API for Parent Components ---
    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine, reset]
    );

    // Effect for handling window resize events
    useEffect(() => {
      if (!resetOnResize) return;

      const debouncedResize = debounce(handleResize, 500);
      window.addEventListener("resize", debouncedResize);

      return () => {
        window.removeEventListener("resize", debouncedResize);
        debouncedResize.cancel();
      };
    }, [handleResize, resetOnResize]);

    // Initial setup and cleanup when component mounts/unmounts
    useEffect(() => {
      initializeRenderer();
      return () => {
        // This cleanup runs when component unmounts or dependencies change
        clearRenderer();
      };
    }, [initializeRenderer, clearRenderer]); // Depend on memoized functions

    // --- Register and Unregister Elements ---
    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvas.current) return;

        // Ensure element and its dimensions are valid
        if (!element || element.offsetWidth === 0 || element.offsetHeight === 0)
          return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const canvasRect = canvas.current.getBoundingClientRect();

        const angle = (props.angle || 0) * (Math.PI / 180);

        const x = calculatePosition(props.x, canvasRect.width, width);
        const y = calculatePosition(props.y, canvasRect.height, height);

        let body: Matter.Body | null = null;
        if (props.bodyType === "circle") {
          const radius = Math.max(width, height) / 2;
          body = Bodies.circle(x, y, radius, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        } else if (props.bodyType === "svg") {
          const paths = element.querySelectorAll("path");
          const vertexSets: Matter.Vector[][] = [];

          paths.forEach((path) => {
            const d = path.getAttribute("d");
            if (d) {
              const p = parsePathToVertices(d, props.sampleLength);
              vertexSets.push(p);
            }
          });

          // Only create body if there are valid vertex sets
          if (vertexSets.length > 0) {
            body = Bodies.fromVertices(x, y, vertexSets, {
              ...props.matterBodyOptions,
              angle: angle,
              render: {
                fillStyle: debug ? "#888888" : "#00000000",
                strokeStyle: debug ? "#333333" : "#00000000",
                lineWidth: debug ? 3 : 0,
              },
            });
          }
        } else {
          body = Bodies.rectangle(x, y, width, height, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        }

        if (body) {
          World.add(engine.current.world, [body]);
          bodiesMap.current.set(id, { element, body, props });
        }
      },
      [debug]
    );

    // Unregister Matter.js body from the physics world
    const unregisterElement = useCallback((id: string) => {
      const body = bodiesMap.current.get(id);
      if (body) {
        World.remove(engine.current.world, body.body);
        bodiesMap.current.delete(id);
      }
    }, []);

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={cn(
            className,
            "absolute top-0 left-0 w-full h-full overflow-hidden"
          )}
          {...props}
        >
          {children}
          {debug && (
            <div
              className="absolute inset-0 pointer-events-none"
              ref={(el) => {
                // Attach Matter.js render canvas to this element for debugging
                if (el && render.current && render.current.canvas) {
                  // If canvas is already a child, no need to re-append
                  if (!el.contains(render.current.canvas)) {
                    el.appendChild(render.current.canvas);
                  }
                  // Style the debug canvas
                  Object.assign(render.current.canvas.style, {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    pointerEvents: "none", // Ensure it doesn't block interactions
                  });
                }
              }}
            />
          )}
        </div>
      </GravityContext.Provider>
    );
  }
);

Gravity.displayName = "Gravity";
export default Gravity;
