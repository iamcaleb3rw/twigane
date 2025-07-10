"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import MTNLogo from "@/public/mtn-logo.svg";
import Image from "next/image";

export default function CreditCardStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const cards = [0, 1, 2, 3]; // 4 cards (index 0 = front)
  const totalCards = cards.length;

  return (
    <div ref={ref} className="relative w-[400px] h-[300px] mx-auto z-30">
      {cards.map((card, index) => {
        const depth = index; // 0 = front, 3 = back

        const initial = {
          opacity: 0,
          y: 50 + depth * 8,
          scale: 1 - depth * 0.05,
          rotateX: 5 + depth * 2,
        };

        const animate = {
          opacity: 1,
          y: depth * 8,
          scale: 1 - depth * 0.05,
          rotateX: 0,
        };

        return (
          <motion.div
            key={card}
            initial={initial}
            animate={isInView ? animate : {}}
            transition={{ duration: 0.5 + depth * 0.15, ease: "easeOut" }}
            style={{ zIndex: totalCards - depth }} // highest zIndex = top card
            className="absolute top-0 left-0 w-[400px] h-[220px] perspective-1000"
          >
            <div className="relative w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-2xl shadow-2xl overflow-hidden transform-gpu">
              {/* Glare Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-glare"></div>

              {/* Card Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-yellow-600 rounded-full"></div>
                <div className="absolute top-8 right-8 w-8 h-8 border border-yellow-600 rounded-full"></div>
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="text-black font-bold text-xl tracking-wide">
                    <Image src={MTNLogo} alt="MTN Logo Image" width={50} />
                    <span className="block text-sm font-normal text-center">
                      MoMo
                    </span>
                  </div>
                  <div className="w-8 h-6 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-sm shadow-inner"></div>
                </div>

                <div className="absolute top-20 left-6">
                  <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-md shadow-inner border border-yellow-600/30 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-transparent to-yellow-600/20 rounded-md"></div>
                    <div className="absolute inset-0">
                      <div className="absolute left-2 top-0 bottom-0 w-px bg-yellow-600/40"></div>
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-yellow-600/40"></div>
                      <div className="absolute left-6 top-0 bottom-0 w-px bg-yellow-600/40"></div>
                      <div className="absolute left-8 top-0 bottom-0 w-px bg-yellow-600/40"></div>
                      <div className="absolute top-1 left-0 right-0 h-px bg-yellow-600/40"></div>
                      <div className="absolute top-3 left-0 right-0 h-px bg-yellow-600/40"></div>
                      <div className="absolute top-5 left-0 right-0 h-px bg-yellow-600/40"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="text-black text-lg font-mono tracking-[0.2em] font-semibold drop-shadow-sm">
                    •••• •••• •••• 123{card}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-black text-xs font-medium opacity-80 mb-1">
                      VALID THRU
                    </div>
                    <div className="text-black text-sm font-mono font-semibold">
                      12/2{9 - card}
                    </div>
                  </div>
                  <div className="text-black text-xs font-medium opacity-80">
                    CARDHOLDER
                  </div>
                </div>
              </div>

              {/* Stripe + Effect */}
              <div className="absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-60"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
            </div>
          </motion.div>
        );
      })}

      <style jsx>{`
        @keyframes glare {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(400%) skewX(-12deg);
          }
        }

        .animate-glare {
          animation: glare 3s ease-in-out infinite;
          animation-delay: 2s;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
