import { useEffect, useState } from "react";

// Define Product Type
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  originalPrice?: number; // ✅ Original price needed for discount calculations
  discount?: string; // ✅ Store discount separately
  price?: number; // ✅ Final price after discount calculation
}

// Hardcoded Product Details (Without Prices)
const productDetails: Product[] = [
  { id: 0, name: "PiMag Hydrogen", description: "whatever", image: "/images/PiDrogen.png", category: "agua" },
  { id: 1, name: "Pi Water", description: "whatever", image: "/images/Pi-Water.png", category: "agua" },
  { id: 2, name: "Optimizer", description: "whatever", image: "/images/PiMag-Optimizer.png", category: "agua" },
  { id: 3, name: "Waterfall", description: "whatever", image: "/images/PiMag-Waterfall.png", category: "agua" },
  { id: 4, name: "Kenko Air Purifier", description: "whatever", image: "/images/Kenko-Air.png", category: "aire" },
  { id: 5, name: "Kenko Sleep", description: "whatever", image: "/images/Colchon.png", category: "descanso" },
  { id: 6, name: "Kenko Sleep Comforter", description: "whatever", image: "/images/product3.jpg", category: "descanso" },
  { id: 7, name: "Repuesto Optimizer", description: "whatever", image: "/images/product3.jpg", category: "repuestos" },
  { id: 8, name: "Repuesto Kenko Air", description: "whatever", image: "/images/product3.jpg", category: "repuestos" },
  { id: 9, name: "Repuesto PiMag Aqua Pour", description: "whatever", image: "/images/product3.jpg", category: "repuestos" },
  { id: 10, name: "Repuesto PiMag Waterfall", description: "whatever", image: "/images/product3.jpg", category: "repuestos" },
  { id: 11, name: "Repuesto PiMag Piwater", description: "whatever", image: "/images/product3.jpg", category: "repuestos" },
  { id: 12, name: "Repuesto PiMag", description: "whatever", image: "/images/product3.jpg", category: "repuestos" },
];

// ✅ Hook to Fetch Prices from Redis & Merge with Products
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
          // ✅ Merge Static Product Details with Fetched Prices
          const updatedProducts = productDetails.map((product) => {
            const matchingProduct = data.products.find((p: { id: number }) => p.id === product.id);

            const originalPrice = matchingProduct?.originalPrice ?? product.originalPrice ?? 0;
            const discount = matchingProduct?.discount ?? "0";

            return {
              ...product,
              originalPrice, // ✅ Ensure originalPrice is present
              discount, // ✅ Store discount for admin adjustments
              price: Math.max(
                originalPrice -
                  (discount.endsWith('%')
                    ? (originalPrice * parseFloat(discount) / 100) // ✅ Percentage discount
                    : parseFloat(discount) || 0), // ✅ Fixed discount
                0
              ),
            };
          });

          setProducts(updatedProducts);
        } else {
          console.error("Invalid product data received:", data);
          setProducts(productDetails); // Default to static data if API fails
        }
      } catch (error) {
        console.error("Failed to fetch product prices", error);
        setProducts(productDetails); // Default to static data if API fails
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);

  return { products, loading };
}
