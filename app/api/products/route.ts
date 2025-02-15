import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis
const redis = Redis.fromEnv();

/**
 * GET Request: Fetch all products with prices from Redis
 */
export async function GET() {
    try {
      const products = (await redis.get("products")) || []; // Ensure it's always an array
  
      if (!Array.isArray(products)) {
        return NextResponse.json({ products: [] }, { status: 200 }); // Return an empty array if it's not properly stored
      }
  
      interface Product {
        id: number;
        name: string;
        originalPrice: number;
        discount: string;
        price?: number; // Price will be calculated dynamically
      }
      
      const updatedProducts = products.map((p: Product) => ({
      
        ...p,
        price: Math.max(
          p.originalPrice - 
          (p.discount.endsWith('%') ? (p.originalPrice * parseFloat(p.discount) / 100) : parseFloat(p.discount)), 
          0 // Ensure non-negative prices
        )
      }));
  
      return NextResponse.json({ products: updatedProducts }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
  }
  


/**
 * PUT Request: Update existing product prices in Redis
 */
export async function PUT(req: NextRequest) {
  try {
    const { products } = await req.json(); // Extract updated product data

    // Update products in Redis
    await redis.set("products", JSON.stringify(products));

    return NextResponse.json({ message: "Products updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 });
  }
}
