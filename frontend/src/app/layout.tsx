import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AIChat } from "@/components/AIChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeachMe",
  description: "The next generation learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AIChat />
      </body>
    </html>
  );
}
