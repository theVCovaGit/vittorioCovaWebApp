"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-start justify-center relative">
      <div className="w-[80%] max-w-4xl h-[50vh] border-2 border-black absolute top-[5%]">
        <div className="flex justify-between items-stretch h-full">
          {/* Columns */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex-1 flex items-center justify-center text-black text-2xl font-bold"
            >
              Column {index + 1}
            </div>
          ))}
        </div>

        {/* Vertical Lines */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="absolute top-0 bottom-0 border-l-2 border-black"
            style={{ left: `${((index + 1) * 100) / 4}%` }}
          />
        ))}
      </div>
    </div>
  );
}
