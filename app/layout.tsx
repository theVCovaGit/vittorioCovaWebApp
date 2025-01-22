import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-background flex flex-col min-h-screen`}
      >
        {/* Header for Navigation */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 md:p-8">
          {children}
        </main>

        {/* Footer at the bottom */}
        <Footer />
      </body>
    </html>
  );
}
