"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ["Todas", "Aire", "Agua", "Descanso", "Repuestos"];

  return (
    <header className="bg-primary text-text-light shadow-md fixed top-0 w-full z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-accent">Rebeca Zaballa</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-secondary hover:text-accent transition font-medium">
            Home
          </Link>

          {/* Store Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link
              href="/store"
              className="text-secondary font-medium hover:text-accent transition"
            >
              Store
            </Link>
            {isDropdownOpen && (
              <div className="absolute left-0 top-full bg-white text-black rounded shadow-lg w-48 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ul className="py-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/store?category=${category.toLowerCase()}`}
                        className="block px-4 py-2 hover:bg-primary hover:text-white transition"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link href="/join" className="text-secondary hover:text-accent transition font-medium">
            Join
          </Link>
          <Link href="/blog" className="text-secondary hover:text-accent transition font-medium">
            Blog
          </Link>
          <Link href="/testimonials" className="text-secondary hover:text-accent transition font-medium">
            Testimonials
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-secondary focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-primary text-white transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 md:hidden`}
      >
        <button
          className="absolute top-4 right-6 text-secondary"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>
        <nav className="flex flex-col items-center justify-center h-full space-y-6">
          <Link href="/" className="text-secondary hover:text-accent text-xl" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>

          {/* Store Dropdown (Mobile) */}
          <div className="relative">
            <button
              className="text-secondary hover:text-accent text-xl"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Store ▾
            </button>
            {isDropdownOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-white text-black rounded shadow-lg w-48 mt-2">
                <ul className="py-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/store?category=${category.toLowerCase()}`}
                        className="block px-4 py-2 hover:bg-primary hover:text-white transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link href="/join" className="text-secondary hover:text-accent text-xl" onClick={() => setIsMenuOpen(false)}>
            Join
          </Link>
          <Link href="/blog" className="text-secondary hover:text-accent text-xl" onClick={() => setIsMenuOpen(false)}>
            Blog
          </Link>
          <Link
            href="/testimonials"
            className="text-secondary hover:text-accent text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            Testimonials
          </Link>
        </nav>
      </div>
    </header>
  );
}
