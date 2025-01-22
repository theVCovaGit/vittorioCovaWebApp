"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Store() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const searchParams = useSearchParams();

  const products = [
    { id: 1, name: "Kenko Air", price: "$10.00", image: "/images/product1.jpg", category: "air" },
    { id: 2, name: "Repuesto Nikken", price: "$20.00", image: "/images/product2.jpg", category: "repuestos" },
    { id: 3, name: "Filtro de Agua", price: "$30.00", image: "/images/product3.jpg", category: "water" },
  ];

  const categories = ["all", "air", "water", "repuestos"];

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setSelectedCategory(category);
  }, [searchParams]);

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "all" || product.category === selectedCategory) &&
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
