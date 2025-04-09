"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cart, toggleCart } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const categories = ["Todas", "Aire", "Agua", "Descanso", "Repuestos"];

  return (
    <header className="bg-white text-black font-semibold tracking-wide shadow-sm border-b border-gray-300">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">

        {/* Left Section: Logo */}
        <div className="flex items-center space-x-4">
          {/*
          <Link href="/" className="flex items-center">
            {isClient ? (
              <Image src="/images/logo4.png" alt="Rebeca Zaballa Logo" width={150} height={50} priority />
            ) : (
              <span className="text-2xl font-bold">Rebeca Zaballa</span>
            )}
          </Link>
          */}
          {/* Text Logo */}
          <Link href="/" className="text-3xl no-underline font-bold tracking-widest uppercase text-gray-800 hover:text-gray-600 transition">
            VITTORIOCOVA
          </Link>

        </div>
        {/* 
        {/* Navigation 
        <nav className="hidden md:flex items-center space-x-8">
          <div
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="flex items-center space-x-1">
              <Link href="/store" className="text-black no-underline hover:underline transition">Tienda</Link>
              <svg
                className={`w-4 h-4 text-black font-bold transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full bg-white border border-gray-300 rounded shadow-md w-40 z-50">
                <ul className="py-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/store?category=${category.toLowerCase()}`}
                        className="block px-4 py-2 text-black hover:bg-gray-100 transition"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link href="/join" className="text-black no-underline hover:underline transition">Únete</Link>
          <Link href="/blog" className="text-black no-underline hover:underline transition">Blog</Link>
          <Link href="/testimonials" className="text-black no-underline hover:underline transition">Testimonios</Link>
        </nav>
        */}
        {/* Right Section: Cart */}
        {/*
        <div className="flex items-center space-x-4">
          <button
            className="relative flex items-center p-2 hover:text-gray-600"
            onClick={toggleCart}
          >
            <ShoppingCartIcon className="w-6 h-6 text-black" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
        */}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 text-black flex flex-col items-center justify-center z-[100]">
          <button
            className="absolute top-4 right-6 text-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            ✖
          </button>
          <ul className="text-lg space-y-6">
            <li><Link href="/" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Menu principal</Link></li>
            <li><Link href="/store" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Tienda</Link></li>
            <li><Link href="/join" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Únete</Link></li>
            <li><Link href="/blog" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
            <li><Link href="/testimonials" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Testimonios</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
