"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  originalPrice: number;
  discount: string;
  price: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null); // ✅ Explicit type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!data.error) {
          setProduct({
            ...data,
            price: Math.max(
              data.originalPrice - 
              (data.discount.endsWith('%') 
                ? (data.originalPrice * parseFloat(data.discount) / 100) 
                : parseFloat(data.discount)
              ), 
              0
            ),
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando producto...</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Producto no encontrado</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <img src={product.image} alt={product.name} className="w-96 h-96 object-contain" />
        <div>
          <h1 className="text-4xl font-bold text-black">{product.name}</h1>
          <p className="text-gray-700 mt-4">{product.description}</p>
          <p className="text-2xl font-semibold text-primary mt-4">${product.price.toFixed(2)}</p>

          <button className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
