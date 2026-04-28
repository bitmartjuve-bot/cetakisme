"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Plus,
  ShoppingCart,
  BarChart3,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    weekOrders: 0,
    pendingOrders: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/reports/summary?period=today"),
          fetch("/api/admin/orders?limit=10"),
        ]);
        
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();

        // In a real app, I'd have a specific dashboard stats API
        // For now, let's use what we have or mock the missing parts
        setStats({
          todayRevenue: statsData.totalRevenue || 0,
          weekOrders: statsData.totalOrders || 0,
          pendingOrders: statsData.completedOrders || 0, // Placeholder
          lowStock: 5, // Placeholder
        });
        setRecentOrders(ordersData.orders || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Baru": return "bg-blue-100 text-blue-700";
      case "Proses": return "bg-yellow-100 text-yellow-700";
      case "Selesai": return "bg-green-100 text-green-700";
      case "Batal": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Shortcut Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/cashier"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
        >
          <ShoppingCart className="w-5 h-5" />
          Kasir Baru
        </Link>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-bold transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk
        </Link>
        <Link
          href="/admin/reports"
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-bold transition-all"
        >
          <BarChart3 className="w-5 h-5" />
          Lihat Laporan
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pendapatan Hari Ini"
          value={`Rp ${stats.todayRevenue.toLocaleString("id-ID")}`}
          icon={TrendingUp}
          color="bg-emerald-500"
          trend="+12% dari kemarin"
        />
        <StatCard
          title="Pesanan Minggu Ini"
          value={stats.weekOrders.toString()}
          icon={ShoppingBag}
          color="bg-blue-500"
          trend="+5 pesanan baru"
        />
        <StatCard
          title="Perlu Diproses"
          value={stats.pendingOrders.toString()}
          icon={Clock}
          color="bg-orange-500"
          trend="Status: Baru & Produksi"
        />
        <StatCard
          title="Stok Menipis"
          value={stats.lowStock.toString()}
          icon={AlertTriangle}
          color="bg-red-500"
          trend="Perlu restock segera"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">10 Pesanan Terbaru</h3>
          <Link
            href="/admin/orders"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">No. Pesanan</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status Bayar</th>
                <th className="px-6 py-4">Status Pesanan</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4 bg-slate-50/50"></td>
                  </tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Belum ada pesanan terbaru
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">#{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{order.customerName}</span>
                        <span className="text-xs text-slate-500">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {format(new Date(order.createdAt), "dd MMM yyyy", { locale: id })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.payment?.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {order.payment?.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          {trend}
        </p>
      </div>
    </div>
  );
}
