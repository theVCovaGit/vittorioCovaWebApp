"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  { id: 1, text: "whatevr", image: "/images/philosophy.jpg" },
  { id: 2, text: "whatever 1", image: "/images/wellness.jpg" },
  { id: 3, text: "whatever 2", image: "/images/community.jpg" },
];

export default function Home() {
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("chrome") && !userAgent.includes("edge")) {
      setIsChrome(true);
    }
  }, []);

  return (
    <div className="text-center">
      <div
        className={`relative mx-auto w-full sm:w-[90%] md:w-[80%] lg:w-[70%] ${
          isChrome ? "chrome-specific-class" : ""
        }`}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="swiper-container"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative">
                <img
                  src={slide.image}
                  alt={slide.text}
                  className="w-full h-full object-cover"
                  loading="lazy" /* Lazy loading for performance */
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                    {slide.text}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
