"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, Phone } from "lucide-react";
import { WhatsAppButton } from "@/components/customer/WhatsAppButton";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Produk", href: "/products" },
  { name: "Desain", href: "/design" },
  { name: "Lacak Pesanan", href: "/track" },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-blue-700">
                CETAKISME
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isActive
                      ? "text-blue-700"
                      : "text-gray-600 hover:text-blue-700"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex">
            <Link
              href="/contact"
              className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
            >
              Hubungi Kami
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded-md p-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-xl transition-transform">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-blue-700">CETAKISME</span>
              <button
                type="button"
                className="rounded-md p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-base font-semibold",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-900 hover:bg-gray-50 hover:text-blue-700"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 block w-full rounded-xl bg-blue-700 px-3 py-3 text-center text-base font-semibold text-white hover:bg-blue-800"
              >
                Hubungi Kami
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                CETAKISME
              </span>
              <p className="mt-4 text-sm text-gray-400 max-w-sm">
                Apply your Imagination. Jasa sablon kaos custom berkualitas tinggi
                di Manado. Melayani pesanan satuan maupun partai besar.
              </p>
              <div className="mt-6 flex gap-4">
                <a href="https://instagram.com/cetakisme" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                  </svg>
                </a>
                <a href="https://facebook.com/cetakisme" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                  </svg>
                </a>
                <a href="https://tiktok.com/@cetakisme" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">Lokasi Kami</h3>
              <ul className="mt-4 space-y-4">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-blue-500" />
                  <span className="text-sm">
                    <strong className="text-white block">Tumumpa</strong>
                    Lingkungan IV, Tumumpa Dua, Tuminting, Manado 95239
                  </span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-blue-500" />
                  <span className="text-sm">
                    <strong className="text-white block">Paniki</strong>
                    Paniki Bawah, Mapanget, Manado 95256
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">Hubungi Kami</h3>
              <ul className="mt-4 space-y-4">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <a href="https://wa.me/6285156103411" className="text-sm hover:text-white transition-colors">
                    +62 851-5610-3411
                  </a>
                </li>
                <li className="text-sm text-gray-400">
                  <strong className="text-white block mb-1">Jam Operasional</strong>
                  Senin - Sabtu: 08.00 - 17.00 WITA<br />
                  Minggu: Libur
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Cetakisme. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
