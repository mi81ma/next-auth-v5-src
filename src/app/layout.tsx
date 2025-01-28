import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/navigation/MainNav";
import { UserButton } from "@/components/auth/user-button";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Analysis Dashboard",
  description: "Real-time stock analysis and alerts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold">StockChart</h1>
                  </div>
                  <div className="hidden md:ml-6 md:flex">
                    <MainNav />
                  </div>
                </div>
                <div className="flex items-center">
                  <UserButton />
                </div>
              </div>
            </div>
          </header>

          <main>
            {children}
          </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
