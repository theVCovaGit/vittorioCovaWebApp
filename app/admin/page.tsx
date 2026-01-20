"use client";

import { useState } from "react";
import ArchitectureContentPanel from "@/components/architectureContentPanel";
import ProductDesignContentPanel from "@/components/productDesignContentPanel";
import ArtContentPanel from "@/components/artContentPanel"; 
import FilmContentPanel from "@/components/filmContentPanel"; 


const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activePanel, setActivePanel] = useState<"architecture" | "productdesign" | "art" | "film" | null>(null); // ✅ add "art"

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
          <h1 className="text-2xl font-blurlight mb-4 text-center"></h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent font-blurlight text-black w-full p-2 mb-4 border border-gray-600 rounded-md"
            placeholder="Enter password"
          />
          <button
            onClick={handleLogin}
            className="w-full font-blurlight bg-transparent text-white py-2 px-4 rounded-md"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#554943] text-[#19333F] px-6 md:px-12 lg:px-24 mt-[10rem] sm:mt-[12rem] md:mt-[14rem] pb-28 sm:pb-32">
      <h1 className="font-blurlight text-black text-2xl font-bold">Welcome back Vittorio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <button
          onClick={() => setActivePanel("architecture")}
          className="font-blurlight bg-[#554943] border-2 border-black text-black py-3 px-6 rounded-md flex items-center gap-2"
        >
          <div className="w-3 h-3 rounded-full bg-[#fff5e0]"></div>
          Architecture
        </button>
        <button
          onClick={() => setActivePanel("productdesign")}
          className="font-blurlight bg-[#554943] border-2 border-black text-black py-3 px-6 rounded-md flex items-center gap-2"
        >
          <div className="w-3 h-3 rounded-full bg-white"></div>
          Product Design
        </button>
        <button
          onClick={() => setActivePanel("art")}
          className="font-blurlight bg-[#554943] border-2 border-black text-black py-3 px-6 rounded-md flex items-center gap-2"
        >
          <div className="w-3 h-3 rounded-full bg-[#895a59]"></div>
          Art
        </button>
        <button
          onClick={() => setActivePanel("film")}
          className="font-blurlight bg-[#554943] border-2 border-black text-black py-3 px-6 rounded-md flex items-center gap-2"
        >
          <div className="w-3 h-3 rounded-full bg-[#2d2f38]"></div>
          Film
        </button>
      </div>

      {/* Content Panels */}
      <ArchitectureContentPanel isActive={activePanel === "architecture"} />
      <ProductDesignContentPanel isActive={activePanel === "productdesign"} />
      <ArtContentPanel isActive={activePanel === "art"} />
      <FilmContentPanel isActive={activePanel === "film"} />
    </div>
  );
};

export default AdminPage;