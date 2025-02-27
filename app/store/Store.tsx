"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products } from "./products"; 
import { useCart } from "@/context/CartContext"; // Import Cart Context

export default function Store() {
  const { addToCart } = useCart(); // Get addToCart function from context
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const [productPrices, setProductPrices] = useState<{ id: number; price: number }[]>([]);
  const router = useRouter(); // Inside the component

  // Fetch Prices from Redis
  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
  
        if (data.products && Array.isArray(data.products)) {
          setProductPrices(
            data.products.map((p: { id: number; originalPrice: number; discount: string }) => ({
              id: p.id,
              price: Math.max(
                p.originalPrice - 
                (p.discount.endsWith('%') ? (p.originalPrice * parseFloat(p.discount) / 100) : parseFloat(p.discount)), 
                0
              )
            }))
          );
        } else {
          setProductPrices([]);
        }
      } catch (error) {
        console.error("Failed to fetch product prices", error);
        setProductPrices([]);
      }
    }
  
    fetchPrices();
  
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const categories = ["todas", "aire", "descanso", "agua", "repuestos"];

  useEffect(() => {
    const category = searchParams.get("category") || "todas";
    setSelectedCategory(category);
  }, [searchParams]);

  const productsWithPrices = products.map((product) => ({
    ...product,
    price: productPrices.find((p) => p.id === product.id)?.price || product.price, 
  }));

  const filteredProducts = useMemo(
    () =>
      productsWithPrices.filter(
        (product) =>
          (selectedCategory === "todas" || product.category === selectedCategory) &&
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, selectedCategory, productsWithPrices]
  );

  return (
    <div className="container mx-auto py-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4">
          <h2 className="text-xl font-bold mb-4 text-black">Categorías</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg border ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-black hover:bg-primary hover:text-white"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product List */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer ${
                    selectedProduct === product.id ? "p-6 bg-gray-100" : ""
                  }`}
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest("button")) {
                      router.push(`/store/${product.id}`); // ✅ Navigate to the product page
                    }
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-36 object-contain"
                  />
                  <div className="p-4">
                  <h2
  className="text-xl font-bold text-black group-hover:text-primary transition cursor-pointer"
  onClick={(e) => {
    e.stopPropagation(); // Prevent parent click from toggling expansion
    router.push(`/store/${product.id}`); // Client-side navigation
  }}
>
  {product.name}
</h2>
                    <p className="text-gray-700">${product.price.toFixed(2)}</p>
                    {/* Expand Details If Selected */}
                    {selectedProduct === product.id && (
                      <div className="mt-4 text-black">
                        <p>{product.description ? product.description : "Descripción no disponible"}</p>
                      </div>
                    )}

                    {/* ✅ Add to Cart Button */}
                    <button
                      className="mt-4 w-full bg-primary text-white py-2 px-4 rounded hover:bg-accent transition"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent click from triggering
                        addToCart({ ...product, price: Number(product.price), quantity: 1 });
                      }}
                    >
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
