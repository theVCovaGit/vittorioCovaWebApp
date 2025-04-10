import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "@/components/cartDrawer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"], // Light, Regular, Bold, Black
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Nikken E-Commerce",
  description: "Shop the best Nikken products with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased text-foreground bg-background flex flex-col min-h-screen font-poppins`}
      >
        <CartProvider>
          <CartDrawer />
          <Header />

          <main className="flex-1 flex flex-col">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
