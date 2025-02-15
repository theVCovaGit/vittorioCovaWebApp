import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis
const redis = Redis.fromEnv();

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discount: string;
}

// ✅ GET Request: Fetch all products from Redis
export async function GET() {
  try {
    // Fetch products from Redis
    const productsData = await redis.get("products");

    let products: Product[] = [];

    if (typeof productsData === "string") {
      // ✅ Only parse if it's a valid JSON string
      products = JSON.parse(productsData);
    } else if (Array.isArray(productsData)) {
      // ✅ Handle case where data is directly an array
      products = productsData as Product[];
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ PUT Request: Update and store products in Redis
export async function PUT(req: NextRequest) {
  try {
    const { products } = await req.json(); // Extract updated product data

    // ✅ Store as JSON string in Redis
    await redis.set("products", JSON.stringify(products));

    return NextResponse.json({ message: "Products updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving products to Redis:", error);
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 });
  }
}
