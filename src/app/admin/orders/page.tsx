"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import * as XLSX from "xlsx";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
    page: 1,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams(filters as any).toString();
      const res = await fetch(`/api/admin/orders?${query}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setPagination(data.pagination || { total: 0, pages: 1, currentPage: 1 });
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    setIsBulkLoading(true);
    try {
      const res = await fetch("/api/admin/orders/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status }),
      });
      if (res.ok) {
        fetchOrders();
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Bulk update failed", error);
    } finally {
      setIsBulkLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o: any) => o.id));
    }
  };

  const exportToExcel = () => {
    const data = orders.map((o: any) => ({
      "No. Pesanan": o.orderNumber,
      "Pelanggan": o.customerName,
      "Telepon": o.customerPhone,
      "Tanggal": format(new Date(o.createdAt), "yyyy-MM-dd HH:mm"),
      "Total": o.totalAmount,
      "Status Bayar": o.payment?.status || "PENDING",
      "Status Pesanan": o.status,
      "Jenis": o.isWalkIn ? "Walk-in" : "Online",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `orders_export_${format(new Date(), "yyyyMMdd")}.xlsx`);
  };

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-900">Manajemen Pesanan</h1>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all"
        >
          <Download className="w-5 h-5" />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Cari Pesanan</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Nama, No. Pesanan, atau HP..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Semua Status</option>
            <option value="Baru">Baru</option>
            <option value="Dalam Produksi">Dalam Produksi</option>
            <option value="Siap Diambil">Siap Diambil</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Jenis</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Semua Jenis</option>
            <option value="online">Online</option>
            <option value="walk-in">Walk-in</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              {selectedIds.length}
            </div>
            <span className="font-bold text-indigo-900">Pesanan terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-indigo-700 mr-2">Update Status:</span>
            {["Baru", "Dalam Produksi", "Siap Diambil", "Selesai"].map((s) => (
              <button
                key={s}
                disabled={isBulkLoading}
                onClick={() => handleBulkUpdate(s)}
                className="bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4 w-12">
                  <button onClick={toggleSelectAll}>
                    {selectedIds.length === orders.length && orders.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                </th>
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
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-6 py-4 bg-slate-50/50 h-16"></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada pesanan ditemukan
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(order.id) ? "bg-indigo-50/30" : ""}`}>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleSelect(order.id)}>
                        {selectedIds.includes(order.id) ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      #{order.orderNumber}
                      {order.isWalkIn && (
                        <span className="ml-2 bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">POS</span>
                      )}
                    </td>
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
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-sm"
                      >
                        Detail <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-bold text-slate-900">{orders.length}</span> dari <span className="font-bold text-slate-900">{pagination.total}</span> pesanan
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: pagination.pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setFilters({ ...filters, page: i + 1 })}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                  filters.page === i + 1
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "hover:bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={filters.page === pagination.pages}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
