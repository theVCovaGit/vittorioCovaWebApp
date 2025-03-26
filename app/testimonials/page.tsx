"use client";

import { useState, useEffect, useRef } from "react";

export default function Testimonials() {
  const testimonials = [
    { id: 1, video: "/images/test1.mp4" },
    { id: 2, video: "/images/testu2.mp4" },
    { id: 3, video: "/images/testi3.mp4" },
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
    <div className="container mx-auto py-20 text-center">
      <div className="relative max-w-4xl mx-auto">
        <div className="flex overflow-hidden rounded-xl shadow-lg">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`w-full flex-shrink-0 transition-opacity duration-700 ${
                index === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={testimonial.video}
                controls
                muted
                className="w-full h-auto rounded-xl"
                onEnded={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
              />
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="mt-8 flex justify-center space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === current ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
