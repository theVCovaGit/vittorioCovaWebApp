"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Store() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");

  const searchParams = useSearchParams();

  const products = [
    { id: 0, name: "PiMag Hydrogen", price: "$30.00", image: "/images/product3.jpg", category: "agua" },
    { id: 1, name: "Pi Water", price: "$6451.00", image: "/images/piWater.jpeg", category: "agua" },
    { id: 2, name: "Optimizer", price: "$20.00", image: "/images/product2.jpg", category: "agua" },
    { id: 3, name: "Waterfall", price: "$30.00", image: "/images/product3.jpg", category: "agua" },
    { id: 4, name: "Kenko Air Purifier", price: "$30.00", image: "/images/product3.jpg", category: "aire" },
    { id: 5, name: "Kenko Sleep", price: "$30.00", image: "/images/product3.jpg", category: "descanso" },
    { id: 6, name: "Kenko Sleep Comforter", price: "$30.00", image: "/images/product3.jpg", category: "descanso" },
    { id: 7, name: "Repuesto Optimizer", price: "$30.00", image: "/images/product3.jpg", category: "repuestos" },
    { id: 8, name: "Repuesto Kenko Air", price: "$30.00", image: "/images/product3.jpg", category: "repuestos" },
    { id: 9, name: "Repuesto PiMag Aqua Pour", price: "$30.00", image: "/images/product3.jpg", category: "repuestos"},
    { id: 10, name: "Repuesto PiMag Waterfall", price: "$30.00", image: "/images/product3.jpg", category: "repuestos"},
    { id: 11, name: "Repuesto PiMag Piwater", price: "$30.00", image: "/images/product3.jpg", category: "repuestos"},
    { id: 12, name: "Repuesto PiMag", price: "$30.00", image: "/images/product3.jpg", category: "repuestos"},

  ];

  const categories = ["todas", "aire", "descanso", "agua", "repuestos"];

  useEffect(() => {
    const category = searchParams.get("category") || "todas";
    setSelectedCategory(category);
  }, [searchParams]);

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "todas" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4">
          <h2 className="text-xl font-bold mb-4">Categorías</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg border ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-primary hover:text-white"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-gray-700">{product.price}</p>
                    <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-accent transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
