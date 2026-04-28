"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  History,
  BarChart3,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
  { name: "Kasir", href: "/admin/cashier", icon: ShoppingCart },
  { name: "Produk", href: "/admin/products", icon: Package },
  { name: "Inventori", href: "/admin/inventory", icon: History },
  { name: "Laporan", href: "/admin/reports", icon: BarChart3 },
  { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6">
          <div className="text-xl font-black text-indigo-600 tracking-tighter">
            CETAK<span className="text-slate-900">ISME</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="text-lg font-black text-indigo-600 tracking-tighter">
          CETAK<span className="text-slate-900">ISME</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-white pt-20 px-4">
           <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-6 h-6" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar Desktop */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {navigation.find((n) => pathname.startsWith(n.href))?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-900">
                {session?.user?.name || "Admin"}
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                {(session?.user as any)?.role || "ADMIN"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
              {session?.user?.name?.[0] || <User className="w-5 h-5" />}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 flex justify-around items-center z-10 shadow-lg">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${
                isActive ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
