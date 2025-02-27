import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis
const redis = Redis.fromEnv();

interface Product {
  id: number;
  name: string;
  description?: string;
  image?: string;
  originalPrice: number;
  discount: string;
}

// ✅ GET: Fetch a Single Product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productsData = await redis.get("products");

    if (!productsData) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    let products: Product[] = typeof productsData === "string" ? JSON.parse(productsData) : productsData;

    const requestedId = Number(params.id);
    if (isNaN(requestedId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = products.find((p) => p.id === requestedId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
