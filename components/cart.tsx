"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { cart, removeFromCart, toggleCart, isCartOpen } = useCart();
  const router = useRouter();

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white text-black shadow-lg transition-transform transform ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Carrito</h2>
        <button className="absolute top-2 right-2 text-lg" onClick={toggleCart}>✖</button>

        {cart.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name} ({item.quantity})</span>
                <button onClick={() => removeFromCart(item.id)}>❌</button>
              </li>
            ))}
          </ul>
        )}

        <button
          className="w-full bg-primary text-white py-2 mt-4"
          onClick={() => {
            toggleCart();
            router.push("/store/checkout");
          }}
        >
          Ir al Checkout
        </button>
      </div>
    </div>
  );
}
