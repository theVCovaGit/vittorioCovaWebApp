"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError: (err: Error) => void;
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}

export default function PayPalButton() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.paypal) {
      setLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (loaded && window.paypal) {
      window.paypal
        .Buttons({
          createOrder: async (): Promise<string> => {
            const res = await fetch("/api/paypal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: "100.00" }),
            });
            const data = await res.json();
            return data.id;
          },
          onApprove: async (data: { orderID: string }): Promise<void> => {
            const res = await fetch(`/api/paypal`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const response = await res.json();
            if (response.status === "COMPLETED") {
              alert("Payment successful!");
            }
          },
          onError: (err: Error) => {
            console.error("PayPal Button Error:", err);
          },
        })
        .render("#paypal-button-container");
    }
  }, [loaded]);

  return <div id="paypal-button-container" />;
}
