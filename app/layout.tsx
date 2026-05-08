import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { AdminBootstrap } from "@/components/admin-bootstrap";
import { AdminResetButton } from "@/components/admin-reset-button";
import { ChunkErrorHandler } from "@/components/chunk-error-handler";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Beagvs - Pi Network Marketplace",
    template: "%s | Beagvs",
  },
  description: "Beagvs - A secure marketplace for goods and services powered by Pi Network. Buy, sell, and ship with confidence using escrow-protected transactions.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Beagvs - Pi Network Marketplace",
    description: "Beagvs - A secure marketplace for goods and services powered by Pi Network.",
    siteName: "Beagvs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beagvs - Pi Network Marketplace",
    description: "Beagvs - A secure marketplace for goods and services powered by Pi Network.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <ChunkErrorHandler />
              <AdminBootstrap />
              <AdminResetButton />
              <div className="flex min-h-screen flex-col">
                <Navigation />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
