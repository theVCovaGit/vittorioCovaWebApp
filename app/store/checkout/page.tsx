"use client";

import { useState } from "react";
import Image from "next/image";

import PayPalButton from "@/components/paypalButton"; // Import PayPal Smart Button

export default function Checkout() {
  const [deliveryMethod, setDeliveryMethod] = useState("home");

  return (
    <div className="bg-[#D4CDBB] text-white min-h-screen py-12">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-12">
        
        {/* LEFT COLUMN: Scrollable Checkout Form */}
        <div className="h-[80vh] overflow-y-auto p-4 bg-gray-800 rounded-md flex flex-col">
          
          {/* 📦 Delivery Details */}
          <h2 className="text-2xl font-bold mb-4">Datos de entrega</h2>
          <p className="mb-4 text-gray-300">¿Cómo te gustaría recibir tu pedido?</p>

          {/* 🚚 Delivery Options */}
          <div className="space-y-4">
            <button
              onClick={() => setDeliveryMethod("home")}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-md border ${
                deliveryMethod === "home" ? "border-[#84AAAF] bg-[#4B6B70]" : "border-gray-500"
              }`}
            >
              <span className="flex items-center gap-2">📦 Entrega en domicilio</span>
              {deliveryMethod === "home" && <span className="text-green-400">✔</span>}
            </button>

            <button
              onClick={() => setDeliveryMethod("pickup")}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-md border ${
                deliveryMethod === "pickup" ? "border-[#84AAAF] bg-[#4B6B70]" : "border-gray-500"
              }`}
            >
              <span className="flex items-center gap-2">📍 Recoger en puntos de recolección</span>
              {deliveryMethod === "pickup" && <span className="text-green-400">✔</span>}
            </button>
          </div>

          {/* 🔑 Sign-in or Join */}
          <div className="mt-6 space-y-4">
            <button className="w-full bg-white text-[#19333F] font-medium py-3 rounded-md">
              Hazte miembro
            </button>
            <button className="w-full bg-transparent border border-white text-white py-3 rounded-md">
              Iniciar sesión
            </button>
          </div>

          {/* 📋 Name & Address */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Ingresa tu nombre y dirección:</h2>
            <input type="text" placeholder="Nombre" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
            <input type="text" placeholder="Apellido" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
            <input type="text" placeholder="Dirección" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
          </div>

          {/* 📧 Contact Info */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Información de contacto</h2>
            <input type="email" placeholder="Correo electrónico" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
            <p className="text-sm text-gray-500">Se enviará una confirmación al finalizar la compra</p>
            <input type="tel" placeholder="Número de teléfono" className="w-full border rounded p-2 mt-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#84AAAF]" />
          </div>

          {/* 📜 Billing Info */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Datos de facturación</h2>
            <label className="flex items-center mt-2">
              <input type="checkbox" className="mr-2" /> La dirección de facturación coincide con la dirección de envío
            </label>
          </div>

          {/* 💳 Payment Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Pago</h2>

            {/* 🏷️ Promo Code */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">¿Tienes un código promocional?</label>
              <input
                type="text"
                placeholder="Promoción"
                className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#84AAAF]"
              />
            </div>

            {/* 🛒 PayPal Smart Checkout */}
            <h2 className="text-xl font-bold mt-6">Pago con PayPal</h2>
            <PayPalButton /> {/* 🔥 PayPal Smart Button Here 🔥 */}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary (Fixed) */}
        <div className="bg-gray-800 p-6 rounded-md self-start sticky top-12">
          <h2 className="text-2xl font-bold mb-4">Resumen del pedido</h2>

          <div className="flex justify-between text-gray-300 mb-2">
            <span>Subtotal</span>
            <span>$2,599.00</span>
          </div>
          <div className="flex justify-between text-gray-300 mb-2">
            <span>Entrega/Envío</span>
            <span className="text-green-400">Gratis</span>
          </div>
          <div className="w-full bg-green-400 h-1 mb-2"></div>
          <p className="text-green-400 mb-4">¡Calificas para envío gratuito!</p>

          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>$2,599.00</span>
          </div>

          {/* 📅 Estimated Delivery */}
          <div className="mt-4 bg-gray-900 p-4 rounded-md">
            <p className="text-gray-300">Llega el <strong className="text-white">mié 12 de feb</strong></p>
            <div className="flex items-center gap-4 mt-4">
              <Image
                src="/images/product3.jpg"
                width={80}
                height={80}
                alt="Product"
                className="rounded-md"
              />
              <div>
                <p className="text-white">Calzado para hombre Nike Air Force 07</p>
                <p className="text-gray-400 text-sm">Cant. 1 - Talla CM 30</p>
                <p className="text-white font-bold">$2,599</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
