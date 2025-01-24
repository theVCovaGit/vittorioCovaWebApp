"use client"

import { useState } from "react";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Replace this with Redis in the future
    const hardcodedPassword = "a&3Pk_9/6z+19";
  
    if (password === hardcodedPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="bg-blue-600 text-white py-4 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-200">
            Precios
          </button>
          <button className="bg-blue-600 text-white py-4 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-200">
            Inventario
          </button>
          <button className="bg-blue-600 text-white py-4 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-200">
            Usuarios
          </button>
          <button className="bg-blue-600 text-white py-4 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-200">
            Configuración
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

