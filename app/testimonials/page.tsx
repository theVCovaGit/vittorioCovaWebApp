"use client";

import { useState, useEffect } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: `Este producto cambió completamente mi vida. ¡Nunca me he sentido mejor!`,
      author: "Testigo 1",
    },
    {
      id: 2,
      quote: `Las soluciones de Nikken son un cambio total para el bienestar. Altamente recomendado.`,
      author: "Testigo 2",
    },
    {
      id: 3,
      quote: `La mejor inversión que he hecho para mi salud. ¡Calidad excepcional!`,
      author: "Testigo 3",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Automatically transition slides every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="container mx-auto py-20 text-center"> {/* Added py-20 for extra spacing */}
      {/* Header Section */}
      <div className="bg-purple-100 rounded-lg p-16 mb-20"> {/* Increased padding and margin */}
        <blockquote className="text-lg md:text-xl font-medium italic text-gray-800">
          &quot;{testimonials[current].quote}&quot;
        </blockquote>
        <p className="mt-6 text-gray-600 font-semibold">
          {testimonials[current].author}
        </p>
      </div>

      {/* Carousel Section */}
      <div className="relative max-w-4xl mx-auto">
        <div className="flex overflow-hidden rounded-lg shadow-lg">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`w-full flex-shrink-0 p-6 transition-opacity duration-500 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="mt-8 flex justify-center space-x-3"> {/* Adjusted spacing for dots */}
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === current ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
