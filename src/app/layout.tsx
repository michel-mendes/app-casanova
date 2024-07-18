import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TopNavigation } from "./components/TopNavigation";
import "./globals.css";
import { Suspense } from "react";
import { LoadingAnimation } from "./components/LoadingAnimation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Casa Nova Acabamentos",
  description: "WebApp administrativo Casa Nova Acabamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNavigation />
        <Suspense fallback={<LoadingAnimation />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
