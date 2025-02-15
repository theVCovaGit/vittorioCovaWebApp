"use client";

import { useState } from "react";
import { products } from "../store/products"; // Adjust the path based on your project structure

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPrices, setShowPrices] = useState(false);
  const [productData, setProductData] = useState(
    products.map((product) => ({
      ...product,
      originalPrice: product.price,
      discount: "0", // Default discount
    }))
  );

  const hardcodedPassword = "123";

  const handleLogin = () => {
    if (password === hardcodedPassword) {
      setIsAuthenticated(true);
      fetchPrices(); // Fetch prices upon successful login
    } else {
      alert("Incorrect password");
    }
  };

  const handlePreciosClick = () => {
    setShowPrices(true);
  };

  // ✅ Fetch Prices from Redis
  const fetchPrices = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      
      if (data.products && Array.isArray(data.products)) {
        // Merge with hardcoded products
        const updatedProducts = products.map((product) => {
          const redisProduct = data.products.find((p: { id: number }) => p.id === product.id);
          return {
            ...product,
            originalPrice: redisProduct?.originalPrice || product.price, // Keep originalPrice updated
            discount: redisProduct?.discount || "0", // Keep discount updated
          };
        });

        setProductData(updatedProducts);
      }
    } catch (error) {
      console.error("Failed to fetch product prices", error);
    }
  };

  // Handle Price Changes
  const handlePriceChange = (id: number, field: "originalPrice" | "discount", value: string) => {
    const updatedProducts = productData.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product };
  
        if (field === "originalPrice") {
          updatedProduct.originalPrice = parseFloat(value) || 0;
        } else if (field === "discount") {
          const discountValue = parseFloat(value.replace('%', '')) || 0;
          const isPercentage = value.endsWith('%');
  
          updatedProduct.discount = value; // Save discount as entered
  
          // ✅ Calculate new price and store it
          updatedProduct.price = Math.max(
            updatedProduct.originalPrice - (isPercentage 
              ? (updatedProduct.originalPrice * discountValue / 100) 
              : discountValue), 
            0
          );
        }
  
        return updatedProduct;
      }
      return product;
    });
  
    setProductData(updatedProducts);
  };
  

  // Save Updated Prices to Redis
  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: productData }),
      });

      if (response.ok) {
        alert("Precios actualizados!");
      } else {
        alert("Error al actualizar los precios.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar los cambios.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="w-96 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D4CDBB] text-[#19333F]">
      <header className="bg-[#D4CDBB] py-4 px-6">
        <h1 className="text-2xl text-[#19333F] font-bold">Admin Dashboard</h1>
      </header>
      <main className="p-6">
        {!showPrices && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={handlePreciosClick}
              className="bg-blue-600 text-white py-4 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            >
              Precios
            </button>
          </div>
        )}

        {showPrices && (
          <div className="grid gap-4">
            <h2 className="text-xl font-bold text-center mb-4">Adjust Prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productData.map((product) => (
                <div key={product.id} className="p-4 bg-gray-800 rounded-md shadow-md">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-400">Category: {product.category}</p>
                  <p className="text-sm text-gray-400">ID: {product.id}</p>
                  <div className="mt-2">
                    <label className="block text-sm">Original Price:</label>
                    <input
                      type="text"
                      value={product.originalPrice.toFixed(2)}
                      onChange={(e) => handlePriceChange(product.id, "originalPrice", e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 30.00"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm">Discount (amount or %):</label>
                    <input
                      type="text"
                      value={product.discount}
                      onChange={(e) => handlePriceChange(product.id, "discount", e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10 or 10%"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm">Final Price:</label>
                    <p className="text-sm font-bold">
                      ${Math.max(product.originalPrice - (product.discount.endsWith('%') 
                        ? (product.originalPrice * parseFloat(product.discount) / 100) 
                        : parseFloat(product.discount)), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Save Changes Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSaveChanges}
                className="bg-green-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-green-700 transition duration-200"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
