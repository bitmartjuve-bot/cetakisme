import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cetakisme - Cetak Kaos Custom Berkualitas",
  description: "Apply your Imagination! Jasa sablon kaos custom berkualitas tinggi di Manado.",
};

import { AuthProvider } from "@/components/providers/session-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
