"use client";

import { useRef } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      video: "/images/test1.mp4",
      name: "persona 1",
      quote: "Relevante 1",
    },
    {
      id: 2,
      video: "/images/testu2.mp4",
      name: "Persona 2",
      quote: "Relevante 2",
    },
    {
      id: 3,
      video: "/images/testi3.mp4",
      name: "Persona 3 ",
      quote: "esdfs",
    },
  ];

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className="flex flex-col items-center">
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={testimonial.video}
              poster={`/images/thumb${testimonial.id}.jpg`} // ✅ Poster image added
              controls
              muted
              playsInline
              preload="metadata"
              className="w-full rounded-xl shadow-lg bg-black"
            />
            <div className="mt-4 text-center">
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
              <p className="text-sm italic text-gray-600 mt-1">
                &quot;{testimonial.quote}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
