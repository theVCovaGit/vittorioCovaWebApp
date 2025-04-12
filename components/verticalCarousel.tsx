// components/VerticalCarousel.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

type VerticalCarouselProps = {
  images: string[];
};

export default function VerticalCarousel({ images }: VerticalCarouselProps) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Up arrow */}
      <button onClick={prev} className="z-10">
        <ChevronUpIcon className="w-6 h-6 text-[#fef4dc] hover:opacity-70 transition" />
      </button>

      {/* Current image */}
      <div className="w-full h-[80%] relative my-2">
        <Image
          src={images[index]}
          alt={`Carousel image ${index + 1}`}
          fill
          className="object-contain"
        />
      </div>

      {/* Down arrow */}
      <button onClick={next} className="z-10">
        <ChevronDownIcon className="w-6 h-6 text-[#fef4dc] hover:opacity-70 transition" />
      </button>
    </div>
  );
}
