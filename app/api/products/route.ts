import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis
const redis = Redis.fromEnv();

interface Product {
  price: any;
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  originalPrice: number;
  discount: string;
}

// ✅ GET: Fetch All Products with Correct Discount Applied
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
          image: product.image && product.image !== "" ? product.image : "/images/placeholder.png", // ✅ Ensure image isn't empty
          price: Math.max(originalPrice - discountAmount, 0), // ✅ Calculate final price
        };
      }),
    }, { status: 200 });

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

    // ✅ Fetch existing products
    const existingProductsData = await redis.get("products");
    let existingProducts: Product[] = [];

    if (typeof existingProductsData === "string") {
      existingProducts = JSON.parse(existingProductsData);
    } else if (Array.isArray(existingProductsData)) {
      existingProducts = existingProductsData as Product[];
    }

    // ✅ Merge new and existing products
    const updatedProducts = products.map((newProduct) => {
      const existingProduct = existingProducts.find((p) => p.id === newProduct.id);

      if (existingProduct) {
        // ✅ Update existing product
        return {
          ...existingProduct, // Preserve existing fields
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category || "uncategorized", // ✅ Ensure category is always updated
          originalPrice: newProduct.originalPrice,
          discount: newProduct.discount,
        };
      }

      // ✅ If it's a new product, add it
      return {
        ...newProduct,
        category: newProduct.category || "uncategorized",
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

    // ✅ Fetch current products
    const existingProductsData = await redis.get("products");
    let existingProducts: Product[] = [];

    if (typeof existingProductsData === "string") {
      existingProducts = JSON.parse(existingProductsData);
    } else if (Array.isArray(existingProductsData)) {
      existingProducts = existingProductsData as Product[];
    }

    // ✅ Remove product with the given ID
    const updatedProducts = existingProducts.filter((product) => product.id !== id);

    await redis.set("products", JSON.stringify(updatedProducts));

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product from Redis:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}


