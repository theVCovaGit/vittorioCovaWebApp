import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "../context/CartContext";
import { IconDisplayProvider } from "@/context/IconDisplayContext";
import CartDrawer from "@/components/cartDrawer";



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"], // Light, Regular, Bold, Black
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Vittorio Cova Studio",
  description: "Frame the vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} min-h-screen flex flex-col font-poppins`}>
          <IconDisplayProvider>
          <CartProvider>
          <CartDrawer />
          <Header />
            <main className="flex-1 flex flex-col overflow-y-auto">
              {children}
            </main>
          <Footer />
          </CartProvider>
          </IconDisplayProvider>
      </body>
    </html>
  );
}
