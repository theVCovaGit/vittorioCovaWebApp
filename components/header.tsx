"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures the component re-renders only on the client
  }, []);

  const categories = ["Todas", "Aire", "Agua", "Descanso", "Repuestos"];

  return (
    <header className="bg-#4B6B70 text-#19333F font-semibold tracking-wide">
      <div className="container flex flex-wrap items-center justify-between py-4 relative">
        {/* Logo (Fixing Hydration Issue) */}
        <Link href="/" className="flex items-center">
          {isClient ? (
            <Image
              src="/images/logo.png" /* Replace with actual path */
              alt="Rebeca Zaballa Logo"
              width={150} /* Adjust width */
              height={50} /* Adjust height */
              priority
            />
          ) : (
            <span className="text-2xl font-bold">Rebeca Zaballa</span> // Placeholder to match SSR
          )}
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-secondary focus:outline-none fixed top-4 right-4 z-50"
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
            ></path>
          </svg>
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isMenuOpen
              ? "fixed inset-0 bg-primary text-white flex flex-col items-center justify-center z-40"
              : "hidden"
          } md:block w-full md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
            <li>
              <Link
                href="/"
                className="text-[#19333F] font-medium hover:text-accent transition no-underline"

                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {/* Store Dropdown */}
            <li
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="text-secondary font-medium hover:text-accent transition cursor-pointer">
                <Link
                  href="/store"
                  className="text-[#19333F] font-medium hover:text-accent transition no-underline"

                  onClick={() => setIsMenuOpen(false)}
                >
                  Store
                </Link>
              </div>
              {isDropdownOpen && (
                <div className="absolute left-0 top-full bg-[#19333F] text-black rounded shadow-md w-40 z-10">
                  <ul className="py-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <Link
                          href={`/store?category=${category.toLowerCase()}`}
                          className="block px-4 py-2 hover:bg-[#19333F] hover:text-white transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            <li>
              <Link
                href="/join"
                className="text-[#19333F] font-medium hover:text-accent transition no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Join
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-[#19333F] font-medium hover:text-accent transition no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/testimonials"
                className="text-[#19333F] font-medium hover:text-accent transition no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
