import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis
const redis = Redis.fromEnv();

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  originalPrice: number;
  discount: string;
  price: number; // ✅ Fix: Explicitly define as number
}

// GET: Fetch All Products with Correct Discount Applied
export async function GET() {
  try {
    const productsData = await redis.get("products");

    let products: Product[] = [];

    if (typeof productsData === "string") {
      products = JSON.parse(productsData);
    } else if (Array.isArray(productsData)) {
      products = productsData as Product[];
    }

    return NextResponse.json({
      products: products.map((product) => {
        const originalPrice = product.originalPrice || 0;
        const discount = product.discount || "0";

        const discountAmount = discount.endsWith("%")
          ? (originalPrice * parseFloat(discount) / 100) // ✅ Percentage discount
          : parseFloat(discount) || 0; // ✅ Fixed discount

          return {
            ...product,
            image: product.image && product.image !== "" ? product.image : "/images/placeholder.png",
            price: Math.max(originalPrice - discountAmount, 0) || 0, // ✅ Ensure price is always a number
          };
      }),
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching products from Redis:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create Products in Redis
export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json();

    if (!product || !product.id) {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    // ✅ Fetch existing products
    const productsData = await redis.get("products");
    let products: Product[] = [];

    if (typeof productsData === "string") {
      products = JSON.parse(productsData);
    } else if (Array.isArray(productsData)) {
      products = productsData as Product[];
    }

    // ✅ Add new product
    products.push({
      ...product,
      price: Math.max(
        product.originalPrice -
          (product.discount.endsWith("%")
            ? (product.originalPrice * parseFloat(product.discount)) / 100
            : parseFloat(product.discount) || 0),
        0
      ), // ✅ Ensure price calculation is applied
    });

    await redis.set("products", JSON.stringify(products)); // ✅ Save to Redis

    return NextResponse.json({ message: "Product added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

// PUT: Update Products in Redis
export async function PUT(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products format" }, { status: 400 });
    }

    await redis.get("products"); // ✅ Remove unused variable, but still fetch existing data to avoid errors

    const updatedProducts = products.map((newProduct) => {
      //const existingProduct = existingProducts.find((p) => p.id === newProduct.id);
      const originalPrice = newProduct.originalPrice || 0;
      const discount = newProduct.discount || "0";

      const discountAmount = discount.endsWith("%")
        ? (originalPrice * parseFloat(discount)) / 100
        : parseFloat(discount) || 0;

      const calculatedPrice = Math.max(originalPrice - discountAmount, 0); // ✅ Ensure price is correctly calculated

      return {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category || "uncategorized",
        image: newProduct.image && newProduct.image !== "" ? newProduct.image : "/images/placeholder.png",
        originalPrice: newProduct.originalPrice,
        discount: newProduct.discount,
        price: calculatedPrice, // ✅ Apply correct price calculation
      };
    });

    await redis.set("products", JSON.stringify(updatedProducts));

    return NextResponse.json({ message: "Products updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving products to Redis:", error);
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const existingProductsData = await redis.get("products");
    let existingProducts: Product[] = [];

    if (existingProductsData) {
      if (typeof existingProductsData === "string") {
        existingProducts = JSON.parse(existingProductsData);
      } else if (Array.isArray(existingProductsData)) {
        existingProducts = existingProductsData as Product[];
      }
    }

    const updatedProducts = existingProducts.filter((product) => product.id !== id);

    await redis.set("products", JSON.stringify(updatedProducts));

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product from Redis:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}



