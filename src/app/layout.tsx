import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TopNavigation } from "./components/TopNavigation";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
