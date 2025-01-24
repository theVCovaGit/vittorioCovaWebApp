"use client";

import { useState } from "react";
import { products } from "../store/products"; // Adjust the path based on your project structure

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPrices, setShowPrices] = useState(false);

  const hardcodedPassword = "a&3Pk_9/6z+19";

  const handleLogin = () => {
    if (password === hardcodedPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handlePreciosClick = () => {
    setShowPrices(true);
  };

  // Map imported products to the format required for the admin dashboard
  const [productData, setProductData] = useState(
    products.map((product) => ({
      ...product,
      originalPrice: product.price,
      discount: "0", // Default discount as a string
      currentPrice: product.price,
    }))
  );

  const handlePriceChange = (id: number, field: "originalPrice" | "discount", value: string) => {
  const updatedProducts = productData.map((product) => {
    if (product.id === id) {
      const updatedProduct = { ...product };

      if (field === "originalPrice") {
        updatedProduct.originalPrice = parseFloat(value) || 0; // Update original price
      } else if (field === "discount") {
        const discountValue = parseFloat(value.replace('%', '')) || 0;
        const isPercentage = value.endsWith('%');
        const discount = isPercentage
          ? (product.originalPrice * discountValue) / 100
          : discountValue;
        updatedProduct.discount = value; // Save discount as a string
        updatedProduct.currentPrice = Math.max(product.originalPrice - discount, 0); // Calculate current price
      }

      return updatedProduct;
    }
    return product;
  });

  setProductData(updatedProducts);
};


  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
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
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
  <label className="block text-sm">Current Price:</label>
  <p className="text-sm">${product.currentPrice.toFixed(2)}</p>
</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
