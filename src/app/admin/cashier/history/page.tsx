"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Search, Calendar, ChevronRight, Printer, ShoppingBag } from "lucide-react";

export default function CashierHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = transactions.filter((t: any) => 
    t.id.toLowerCase().includes(search.toLowerCase()) || 
    t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-900">Riwayat Transaksi Kasir</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Cari Transaksi</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="ID, Nama, atau Lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">ID Transaksi</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Metode</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4 bg-slate-50/50 h-16"></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada transaksi ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">#{t.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {format(new Date(t.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-black uppercase">
                        {t.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{t.customerName || "-"}</td>
                    <td className="px-6 py-4 font-black text-slate-900">Rp {t.totalAmount.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">
                       <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-all">
                        <Printer className="w-5 h-5" />
                      </button>
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
