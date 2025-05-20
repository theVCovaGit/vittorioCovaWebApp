"use client";

import { useState } from "react";
import ArchitectureContentPanel from "@/components/architectureContentPanel";
import ProductDesignContentPanel from "@/components/productDesignContentPanel";


const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activePanel, setActivePanel] = useState<"architecture" | "productdesign" | null>(null);

  const hardcodedPassword = "123";

  const handleLogin = () => {
    if (password === hardcodedPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96 p-6 bg-transparent text-white">
          <h1 className="text-2xl font-basica mb-4 text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black w-full p-2 mb-4 border border-gray-600 rounded-md"
            placeholder="Enter password"
          />
          <button
            onClick={handleLogin}
            className="w-full font-basica bg-transparent text-white py-2 px-4 rounded-md"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#5c4b4a] text-[#19333F] px-6 md:px-12 lg:px-24 mt-[10rem] sm:mt-[12rem] md:mt-[14rem] pb-28 sm:pb-32">
      <h1 className="font-basica text-[#FFF3DF] text-2xl font-bold">Welcome back Vittorio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <button
          onClick={() => setActivePanel("architecture")}
          className="bg-black text-white py-3 px-6 rounded-md"
        >
          Architecture
        </button>
        <button
          onClick={() => setActivePanel("productdesign")}
          className="bg-blue-600 text-white py-3 px-6 rounded-md"
        >
          Product Design
        </button>

        {/* Future: Add buttons for Film, Product Design, Art */}
      </div>

      {/* Content Panels */}
      <ArchitectureContentPanel isActive={activePanel === "architecture"} />
      <ProductDesignContentPanel isActive={activePanel === "productdesign"} />

    </div>
  );
};

export default AdminPage;
