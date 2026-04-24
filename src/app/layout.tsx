import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Video portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={roboto.className}
      >
        <TRPCProvider>
          <Toaster />
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
