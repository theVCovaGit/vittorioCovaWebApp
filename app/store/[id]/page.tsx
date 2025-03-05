"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface Product {
  category: string;
  id: number;
  name: string;
  description: string;
  image?: string;
  originalPrice: number;
  discount: string;
  price: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (!data.error) {
          setProduct({
            ...data,
            category: data.category || "uncategorized", // ✅ Ensure category is always set
            image: data.image ?? "/images/placeholder.png", // ✅ Ensure image is always a string
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

  const handleAddToCart = () => {
    if (!product) return;
  
    addToCart({
      ...product,
      image: product.image ?? "/images/placeholder.png", // ✅ Ensure image is always a string
      quantity, // ✅ Ensure quantity is included
    });
  };  
    
  if (loading) {
    return <p className="text-center text-gray-500">Cargando producto...</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Producto no encontrado</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Product Image */}
        <img
          src={product.image || "/images/placeholder.png"}
          alt={product.name}
          className="w-96 h-96 object-contain"
        />

        
        {/* Product Details */}
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-black">{product.name}</h1>
          <p className="text-gray-700 mt-4 text-lg">{product.description}</p>
          
          {/* Price Section */}
          <div className="mt-4">
            {product.discount !== "0" && (
              <p className="text-gray-500 line-through text-xl">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-3xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-black text-lg font-medium">Cantidad:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-black w-16 text-center p-2 border rounded-lg"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart} // ✅ Use cart function directly
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
