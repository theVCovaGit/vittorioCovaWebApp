"use client";

import { useState, useEffect, useRef } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      video: "/images/test1.mp4",
      name: "Persona 1",
      quote: "Relevante 1",
    },
    {
      id: 2,
      video: "/images/testu2.mp4",
      name: "Persona 1",
      quote: "Relevante 2",
    },
    {
      id: 3,
      video: "/images/testi3.mp4",
      name: "Persona 3",
      quote: "Relevante 3",
    },
  ];
  

  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const currentVideo = videoRefs.current[current];
    if (currentVideo) {
      currentVideo.currentTime = 0; // Reset to start
      currentVideo.play().catch((err) => {
        console.warn("Autoplay failed:", err);
      });
    }
  }, [current]);

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
              controls
              muted
              className="w-full rounded-xl shadow-lg"
            />
            <div className="mt-4 text-center">
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
              <p className="text-sm italic text-gray-600 mt-1">"{testimonial.quote}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}
