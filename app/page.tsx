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
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const popupDismissed = sessionStorage.getItem("popupDismissed");
    if (!popupDismissed) {
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsPopupVisible(false);
    sessionStorage.setItem("popupDismissed", "true");
  };

  return (
    <div className="text-center">
      {/* Swiper Section */}
      <div className="relative mx-auto w-full sm:w-[90%] md:w-[80%] lg:w-[70%]">
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
                  loading="lazy"
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

      {/* Popup Section */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white p-10 sm:p-12 rounded-lg shadow-lg w-11/12 sm:w-[500px] md:w-[650px]">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-400 text-2xl"
              onClick={closePopup}
            >
              &times;
            </button>

            {/* Form Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
              Suscríbete
            </h2>
            <p className="text-sm mb-8 text-center text-gray-400">
              * Indica requerido
            </p>

            {/* Mailchimp Form */}
            <form
              action="https://gmail.us3.list-manage.com/subscribe/post?u=32b94a5dac9927710c0fdd16e&amp;id=6d8cd7eb00&amp;f_id=000f35e2f0"
              method="post"
              target="_blank"
            >
              <div className="flex flex-col items-center justify-center space-y-6">
  <div className="w-full">
    <label
      htmlFor="mce-EMAIL"
      className="block mb-2 text-sm text-gray-300 text-center"
    >
      Correo Electrónico <span className="text-red-500">*</span>
    </label>
    <input
      type="email"
      name="EMAIL"
      id="mce-EMAIL"
      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      placeholder="Correo Electrónico"
      required
    />
  </div>
  <div className="w-full">
    <label
      htmlFor="mce-FNAME"
      className="block mb-2 text-sm text-gray-300 text-center"
    >
      Nombre
    </label>
    <input
      type="text"
      name="FNAME"
      id="mce-FNAME"
      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      placeholder="Nombre"
    />
  </div>
</div>


              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full py-4 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-500 transition text-lg shadow-lg"
                >
                  Suscribirse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
