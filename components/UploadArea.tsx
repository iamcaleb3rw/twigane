"use client";
import {
  AlertCircleIcon,
  Minus,
  PaperclipIcon,
  Plus,
  UploadIcon,
  XIcon,
} from "lucide-react";
import type React from "react"; // Import React for types
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { formatBytes } from "@/lib/format-bytes";
import axios from "axios";
import { useRouter } from "next/navigation";
// Import dynamic for client-side loading
import dynamic from "next/dynamic";
// Dynamically import Document and Page with SSR disabled
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  {
    ssr: false,
  }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});
// Removed dynamic import for html2canvas here
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import html2canvas from "html2canvas";

interface Problem {
  id: string;
  pageNumber: number;
  rect: { x: number; y: number; width: number; height: number };
}

interface ChatMessage {
  type: "text" | "image" | "user-text";
  content: string;
}

// Define a placeholder PDF URL
export default function UploadArea() {
  const router = useRouter();
  // Initialize url with placeholder PDF
  const [url, setUrl] = useState<string>("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const maxSize = 10 * 1024 * 1024; // 10MB default
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // State for PDF viewer
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfWidth, setPdfWidth] = useState<number | null>(null);

  // States for problem drawing and selection
  const [drawingMode, setDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentRect, setCurrentRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null
  );

  // States for chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: "text", content: "Hi, how can I help?" },
    { type: "user-text", content: "What’s in this PDF?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Set up PDF worker only on client side by dynamically importing pdfjs
  useEffect(() => {
    const initializePdfjsWorker = async () => {
      try {
        // Dynamically import pdfjs from react-pdf
        const { pdfjs } = await import("react-pdf");
        // Attempt to use the user's preferred method first
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.mjs",
          import.meta.url
        ).toString();
      } catch (urlError) {
        console.warn(
          "Failed to construct worker URL with import.meta.url, falling back to CDN:",
          urlError
        );
        // Fallback to a CDN if the URL construction fails
        // Re-import pdfjs in case the first import failed or was partial due to the URL error
        const { pdfjs } = await import("react-pdf");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        setPdfError("Failed to initialize PDF viewer. Using fallback worker.");
      }
    };
    initializePdfjsWorker();
  }, []);

  // Handle container resize for PDF width
  useEffect(() => {
    const updateWidth = () => {
      if (pdfContainerRef.current) {
        // Subtracting padding (p-4 = 16px on each side, so 32px total)
        setPdfWidth(pdfContainerRef.current.clientWidth - 32);
      }
    };
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (pdfContainerRef.current) {
      resizeObserver.observe(pdfContainerRef.current);
    }
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
      resizeObserver.disconnect();
    };
  }, []);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
    accept: "application/pdf", // Restrict to PDF files
  });

  // Use a dummy file object for the placeholder PDF
  const selectedFileWithPreview = files[0];
  const selectedFile = selectedFileWithPreview?.file;

  const uploadFile = async () => {
    try {
      if (!selectedFile) {
        alert("No file selected");
        return;
      }
      setUploading(true);
      setPdfError(null);
      const data = new FormData();
      data.set("file", selectedFile);
      const uploadRequest = await axios.post("/api/upload", data);
      const signedUrl = uploadRequest.data.url;
      const receivedCid = uploadRequest.data.cid;
      setCid(receivedCid);
      setUrl(signedUrl);
      setUploading(false);
      // Reset PDF viewer state for new document
      setNumPages(null);
      setPageNumber(1);
      setScale(1.0);
      setProblems([]); // Clear problems for new PDF
      setSelectedProblemId(null); // Clear selected problem
    } catch (e) {
      console.error(e);
      setUploading(false);
      setPdfError("Failed to upload or display PDF");
      alert("Trouble uploading file");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setPdfError("Failed to load PDF document. Please try another file.");
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) =>
      Math.min(prevPageNumber + 1, numPages || 1)
    );
  };

  const goToPreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  // Event handlers for drawing problems
  const handlePdfMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!drawingMode || !pdfContainerRef.current) return;
      setIsDrawing(true);
      const rect = pdfContainerRef.current.getBoundingClientRect();
      setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setCurrentRect(null); // Reset current rect
      setSelectedProblemId(null); // Close any open tooltips
    },
    [drawingMode]
  );

  const handlePdfMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDrawing || !startPoint || !pdfContainerRef.current) return;
      const rect = pdfContainerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const x = Math.min(startPoint.x, currentX);
      const y = Math.min(startPoint.y, currentY);
      const width = Math.abs(startPoint.x - currentX);
      const height = Math.abs(startPoint.y - currentY);

      setCurrentRect({ x, y, width, height });
    },
    [isDrawing, startPoint]
  );

  const sendChatToAI = useCallback(async (messagesToSend: ChatMessage[]) => {
    setIsAiResponding(true);
    // Add a placeholder for AI response in the chat
    setChatMessages((prev) => [
      ...prev,
      { type: "text", content: "AI is thinking..." } as ChatMessage,
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messagesToSend }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        // Update the last message (which is the AI placeholder or the one being streamed)
        setChatMessages((prev) => {
          const updatedPrev = [...prev];
          const lastAiMessageIndex = updatedPrev.findLastIndex(
            (msg) => msg.type === "text" && msg.content.startsWith("AI")
          );
          if (lastAiMessageIndex !== -1) {
            updatedPrev[lastAiMessageIndex] = {
              type: "text",
              content: `AI: ${fullResponse}`,
            } as ChatMessage;
          } else {
            // Fallback: if for some reason the placeholder wasn't there, add it
            updatedPrev.push({
              type: "text",
              content: `AI: ${fullResponse}`,
            } as ChatMessage);
          }
          return updatedPrev;
        });
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setChatMessages((prev) => {
        const updatedPrev = [...prev];
        const lastAiMessageIndex = updatedPrev.findLastIndex(
          (msg) => msg.type === "text" && msg.content.startsWith("AI")
        );
        if (lastAiMessageIndex !== -1) {
          updatedPrev[lastAiMessageIndex] = {
            type: "text",
            content: "AI: Sorry, I encountered an error.",
          } as ChatMessage;
        } else {
          updatedPrev.push({
            type: "text",
            content: "AI: Sorry, I encountered an error.",
          } as ChatMessage);
        }
        return updatedPrev;
      });
    } finally {
      setIsAiResponding(false);
    }
  }, []);

  const handleSolveClick = useCallback(
    async (problemId: string) => {
      const problem = problems.find((p) => p.id === problemId);
      if (!problem || !pdfContainerRef.current) return;

      const html2canvasModule = html2canvas;
      if (!html2canvasModule) {
        console.error("html2canvas module not loaded.");
        setPdfError("Failed to capture screenshot: html2canvas not ready.");
        return;
      }

      if (problem.pageNumber !== pageNumber) {
        alert("Please navigate to the correct page to solve this problem.");
        return;
      }

      try {
        const fullCanvas = await html2canvasModule(pdfContainerRef.current, {
          useCORS: true,
          allowTaint: true,
        });

        const croppedCanvas = document.createElement("canvas");
        const ctx = croppedCanvas.getContext("2d");
        if (!ctx) {
          console.error("Could not get 2D context for cropped canvas.");
          return;
        }

        const relativeX = problem.rect.x;
        const relativeY = problem.rect.y;
        const relativeWidth = problem.rect.width;
        const relativeHeight = problem.rect.height;

        croppedCanvas.width = relativeWidth;
        croppedCanvas.height = relativeHeight;

        ctx.drawImage(
          fullCanvas,
          relativeX,
          relativeY,
          relativeWidth,
          relativeHeight,
          0,
          0,
          relativeWidth,
          relativeHeight
        );

        const imageDataUrl = croppedCanvas.toDataURL("image/png");

        // Add the image to chat messages first
        const updatedChatMessagesWithImage = [
          ...chatMessages,
          { type: "image", content: imageDataUrl } as ChatMessage,
        ];
        setChatMessages(updatedChatMessagesWithImage);

        // Then send the updated chat messages (including the image) to the AI
        await sendChatToAI(updatedChatMessagesWithImage);

        setSelectedProblemId(null); // Close tooltip after solving
        setDrawingMode(false); // Exit drawing mode after solving
      } catch (error) {
        console.error("Error taking screenshot or sending to AI:", error);
        setPdfError("Failed to capture screenshot or get AI response.");
      }
    },
    [problems, pageNumber, chatMessages, sendChatToAI]
  );

  const handlePdfMouseUp = useCallback(async () => {
    // Make it async
    if (
      isDrawing &&
      currentRect &&
      currentRect.width > 5 &&
      currentRect.height > 5
    ) {
      const newProblem: Problem = {
        id: Math.random().toString(36).substring(2, 9),
        pageNumber: pageNumber,
        rect: currentRect,
      };
      setProblems((prev) => [...prev, newProblem]);
      // Automatically trigger solve for the newly drawn problem
      await handleSolveClick(newProblem.id);
    }
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentRect(null);
  }, [isDrawing, currentRect, pageNumber, handleSolveClick]); // Added handleSolveClick to dependencies

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    setDrawingMode((prev) => !prev);
    setIsDrawing(false); // Reset drawing state
    setStartPoint(null);
    setCurrentRect(null);
    setSelectedProblemId(null); // Close any open tooltips
  };

  // Handle problem click (to show solve tooltip)
  const handleProblemClick = (problemId: string) => {
    setSelectedProblemId((prev) => (prev === problemId ? null : problemId)); // Toggle tooltip
  };

  // Handle sending text message in chat
  const handleChatSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (chatInput.trim()) {
        const newUserMessage: ChatMessage = {
          type: "user-text",
          content: chatInput.trim(),
        };
        const updatedChatMessages = [...chatMessages, newUserMessage];
        setChatInput(""); // Clear input immediately
        setChatMessages(updatedChatMessages); // Update UI with user message

        await sendChatToAI(updatedChatMessages); // Send to AI
      }
    },
    [chatInput, chatMessages, sendChatToAI]
  );

  return (
    <main className="w-full h-[calc(100vh-86px)] flex items-center justify-center">
      {/* Conditional rendering: if no URL (e.g., after removing a file), show upload area */}
      {!url && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Drop area */}
          <div
            role="button"
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
          >
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload file"
              disabled={Boolean(selectedFile)}
            />
            <div className="flex flex-col items-center justify-center text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <UploadIcon className="size-4 opacity-60" />
              </div>
              <p className="text-muted-foreground text-sm">
                Drag & drop your file here, or{" "}
                <span className="font-medium text-primary">
                  click to browse
                </span>
              </p>
              <p className="text-muted-foreground text-xs">
                (max. {formatBytes(maxSize)})
              </p>
            </div>
          </div>
          {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )}
          {/* File list */}
          {selectedFileWithPreview && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <PaperclipIcon
                    className="size-4 shrink-0 opacity-60"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">
                      {selectedFileWithPreview.file.name}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                  onClick={() => removeFile(selectedFileWithPreview.id)}
                  aria-label="Remove file"
                >
                  <XIcon className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
          {/* Upload Button */}
          <Button
            type="button"
            disabled={uploading || !selectedFile}
            onClick={uploadFile}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      )}
      {url &&
        selectedFile && ( // Render PDF viewer if URL and selectedFile (even dummy) exist
          <div className="grid grid-rows-[auto_1fr] h-full w-full">
            {/* Row 1: Filename Header */}
            <div className="text-sm text-center font-medium border-y py-2 bg-gray-100 dark:bg-gray-800">
              {selectedFile.name}
            </div>
            {/* Row 2: Main Content Area */}
            <div className="grid grid-cols-2 h-full">
              {/* Left Column: PDF Controls + Viewer */}
              <div className="flex flex-col border-r bg-background relative">
                {/* Controls */}
                <div className="sticky top-0 z-10 border-b bg-background">
                  <div className="flex p-1 items-center gap-2">
                    <Button
                      variant={"ghost"}
                      className="h-8 w-8"
                      onClick={zoomIn}
                      aria-label="Zoom In"
                    >
                      <Plus className="size-4" />
                    </Button>
                    <Button
                      variant={"ghost"}
                      className="h-8 w-8"
                      onClick={zoomOut}
                      aria-label="Zoom Out"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="text-sm font-medium px-2">{`${(scale * 100).toFixed(0)}%`}</span>
                    <Button
                      variant={"ghost"}
                      className="h-8 w-8"
                      onClick={goToPreviousPage}
                      disabled={pageNumber <= 1}
                      aria-label="Previous Page"
                    >
                      {"<"}
                    </Button>
                    <span className="text-sm font-medium px-2">{`${pageNumber} / ${numPages || "-"}`}</span>
                    <Button
                      variant={"ghost"}
                      className="h-8 w-8"
                      onClick={goToNextPage}
                      disabled={pageNumber >= (numPages || 1)}
                      aria-label="Next Page"
                    >
                      {">"}
                    </Button>
                    <Button
                      variant={drawingMode ? "default" : "outline"}
                      onClick={toggleDrawingMode}
                      className="ml-auto"
                    >
                      {drawingMode ? "Exit Draw Mode" : "Draw Problem"}
                    </Button>
                  </div>
                </div>
                {/* PDF Viewer */}
                <div
                  className="flex-1 overflow-auto p-4 flex justify-center items-start pdf-container relative"
                  ref={pdfContainerRef}
                  onMouseDown={drawingMode ? handlePdfMouseDown : undefined}
                  onMouseMove={drawingMode ? handlePdfMouseMove : undefined}
                  onMouseUp={drawingMode ? handlePdfMouseUp : undefined}
                >
                  {pdfError ? (
                    <div className="text-destructive p-4 text-center">
                      {pdfError}
                    </div>
                  ) : (
                    <div className="w-full max-w-full h-full">
                      <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                          <div className="text-center p-4">Loading PDF...</div>
                        }
                        error={
                          <div className="text-destructive p-4">
                            Failed to load PDF
                          </div>
                        }
                        className="flex justify-center"
                      >
                        <Page
                          pageNumber={pageNumber}
                          scale={scale}
                          width={pdfWidth || undefined}
                          renderAnnotationLayer={true}
                          renderTextLayer={true}
                          loading={
                            <div className="text-center p-4">
                              Loading page...
                            </div>
                          }
                          className="shadow-lg"
                        />
                      </Document>
                    </div>
                  )}
                  {/* Drawing overlay for current rectangle */}
                  {drawingMode && currentRect && (
                    <div
                      className="absolute border-2 border-blue-500 border-dashed pointer-events-none z-10"
                      style={{
                        left: currentRect.x,
                        top: currentRect.y,
                        width: currentRect.width,
                        height: currentRect.height,
                      }}
                    />
                  )}
                  {/* Render existing problems */}
                  {problems
                    .filter((p) => p.pageNumber === pageNumber)
                    .map((problem) => (
                      <div
                        key={problem.id}
                        data-problem-id={problem.id} // For finding the element for screenshot
                        className={`absolute border-2 border-transparent hover:border-blue-500 hover:border-dashed cursor-pointer z-10 ${
                          selectedProblemId === problem.id
                            ? "border-blue-500 border-dashed"
                            : ""
                        }`}
                        style={{
                          left: problem.rect.x,
                          top: problem.rect.y,
                          width: problem.rect.width,
                          height: problem.rect.height,
                        }}
                        onClick={() => handleProblemClick(problem.id)}
                      >
                        {selectedProblemId === problem.id && (
                          <div
                            className="absolute bg-white border rounded shadow-md p-2 text-sm whitespace-nowrap z-20 problem-tooltip"
                            style={{ top: problem.rect.height + 5, left: 0 }}
                            onClick={(e) => e.stopPropagation()} // Prevent click from propagating to problem div
                          >
                            <Button
                              size="sm"
                              onClick={() => handleSolveClick(problem.id)}
                            >
                              Solve
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              {/* Right Column: Chat Interface */}
              <div className="relative flex flex-col bg-muted/10">
                {/* Chat Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-3 flex flex-col">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded shadow text-sm ${
                        msg.type === "user-text"
                          ? "bg-blue-100 self-end"
                          : "bg-background self-start"
                      }`}
                      style={{ maxWidth: "80%" }}
                    >
                      {msg.type === "image" ? (
                        <img
                          src={msg.content || "/placeholder.svg"}
                          alt="Screenshot"
                          className="max-w-full h-auto rounded"
                        />
                      ) : (
                        msg.content
                      )}
                    </div>
                  ))}
                </div>
                {/* Chat Input Bar */}
                <div className="p-4 border-t bg-background sticky bottom-0">
                  <form className="flex gap-2" onSubmit={handleChatSubmit}>
                    <input
                      type="text"
                      placeholder="Ask something..."
                      className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isAiResponding} // Disable when AI is thinking
                    />
                    <Button
                      type="submit"
                      className="px-4"
                      disabled={isAiResponding}
                    >
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}
