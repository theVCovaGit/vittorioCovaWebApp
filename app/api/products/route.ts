import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis
const redis = Redis.fromEnv();

interface Product {
  id: number;
  name: string;
  description?: string; // ✅ Optional description added
  image?: string; // ✅ Optional image added
  originalPrice: number;
  discount: string;
}

// ✅ GET: Fetch All Products
export async function GET() {
  try {
    const productsData = await redis.get("products");

    let products: Product[] = [];

    if (typeof productsData === "string") {
      products = JSON.parse(productsData);
    } else if (Array.isArray(productsData)) {
      products = productsData as Product[];
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ PUT: Update Products in Redis
export async function PUT(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products format" }, { status: 400 });
    }

    await redis.set("products", JSON.stringify(products));

    return NextResponse.json({ message: "Products updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving products to Redis:", error);
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 });
  }
}
