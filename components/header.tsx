"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext"; // Import Cart Context
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cart, toggleCart } = useCart();

  useEffect(() => {
    setIsClient(true); // Ensures the component re-renders only on the client
  }, []);

  const categories = ["Todas", "Aire", "Agua", "Descanso", "Repuestos"];

  return (
    <header className="bg-[#2c72a6] text-black font-semibold tracking-wide h-28 flex items-center">
      <div className="container flex items-center justify-between py-4 relative">
        
        {/* Left Section: Logo + Navigation */}
        <div className="flex items-center space-x-8">  
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {isClient ? (
              <Image src="/images/logo4.png" alt="Rebeca Zaballa Logo" width={150} height={50} priority />
            ) : (
              <span className="text-2xl font-bold">Rebeca Zaballa</span>
            )}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="relative group flex items-center space-x-1">
                <Link href="/store" className="text-white hover:text-[#84AAAF] transition no-underline">Tienda</Link>
                <svg
                className={`w-4 h-4 text-[white] font-bold transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
              </div>

              {isDropdownOpen && (
                <div className="absolute left-0 top-full bg-[#19333F] rounded shadow-md w-40 z-50">
                  <ul className="py-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <Link
                          href={`/store?category=${category.toLowerCase()}`}
                          className="block px-4 py-2 text-[white] hover:text-[#84AAAF] transition no-underline"
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Link href="/join" className="text-white hover:text-[#84AAAF] transition no-underline">Únete</Link>
            <Link href="/blog" className="text-white hover:text-[#84AAAF] transition no-underline">Blog</Link>
            <Link href="/testimonials" className="text-white hover:text-[#84AAAF] transition no-underline">Testimonios</Link>
          </nav>
        </div>

        {/* Right Section (Cart & Hamburger Menu) */}
        <div className="flex items-center space-x-4 md:space-x-6 ml-auto">
          
          {/* Cart Icon */}
          <button className="relative flex items-center bg-[#19333F] p-2 rounded-full hover:bg-[#4B6B70]" onClick={toggleCart}>
            <ShoppingCartIcon className="w-6 h-6 text-white hover:text-[#84AAAF]" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            className="md:hidden text-white bg-[#19333F] p-2 rounded-md z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#2c72a6] bg-opacity-95 text-white flex flex-col items-center justify-center z-[100]">
          <button className="absolute top-4 right-6 text-2xl" onClick={() => setIsMenuOpen(false)}>✖</button>
          <ul className="text-lg space-y-6">
            <li><Link href="/" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Menu principal</Link></li>
            <li><Link href="/store" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Tienda</Link></li>
            <li><Link href="/join" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Únete</Link></li>
            <li><Link href="/blog" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
            <li><Link href="/testimonials" className="text-[#4B6B70] hover:text-[#84AAAF] transition no-underline" onClick={() => setIsMenuOpen(false)}>Testimonios</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
