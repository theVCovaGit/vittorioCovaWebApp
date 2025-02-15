import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis
const redis = Redis.fromEnv();

// Define the Product interface globally for reuse
interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discount: string;
  price?: number; // Price is dynamically calculated
}

/**
 * GET Request: Fetch all products with dynamically updated prices from Redis
 */
export async function GET() {
  try {
    // Fetch and parse products from Redis
    const productsData = await redis.get("products");
    const products: Product[] = productsData ? JSON.parse(productsData as string) : [];

    if (!Array.isArray(products)) {
      return NextResponse.json({ products: [] }, { status: 200 }); // Return empty array if invalid
    }

    // Calculate price dynamically
    const updatedProducts = products.map((p: Product) => ({
      ...p,
      price: Math.max(
        p.originalPrice - 
        (p.discount.endsWith('%') ? (p.originalPrice * parseFloat(p.discount) / 100) : parseFloat(p.discount)), 
        0 // Ensure non-negative prices
      ),
    }));

    return NextResponse.json({ products: updatedProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

/**
 * PUT Request: Update existing product prices in Redis
 */
export async function PUT(req: NextRequest) {
  try {
    const { products }: { products: Product[] } = await req.json(); // Extract updated product data

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid product data format" }, { status: 400 });
    }

    // Store updated product data in Redis
    await redis.set("products", JSON.stringify(products));

    return NextResponse.json({ message: "Products updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating products in Redis:", error);
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 });
  }
}
