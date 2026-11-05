import { Suspense } from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: {
    default: "BookNook — Discover Your Next Great Read",
    template: "%s | BookNook",
  },
  description:
    "BookNook is your small online library to explore, borrow, and manage your favorite books seamlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div className="h-16 bg-white border-b" />}>
          <Navbar />
        </Suspense>
        
        <main>{children}</main>
        
        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}