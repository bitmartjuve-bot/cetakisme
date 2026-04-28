"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { History, TrendingUp, TrendingDown, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

export default function StockHistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/history");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/inventory"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Riwayat Perubahan Stok</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Produk & Varian</th>
                <th className="px-6 py-4">Perubahan</th>
                <th className="px-6 py-4">Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-4 bg-slate-50/50 h-16"></td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Belum ada riwayat perubahan stok
                  </td>
                </tr>
              ) : (
                history.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{log.variant.product.name}</span>
                        <span className="text-xs text-slate-500 uppercase font-black">
                          {log.variant.size} / {log.variant.color}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 font-black text-lg ${
                        log.change > 0 ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {log.change > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {log.change > 0 ? `+${log.change}` : log.change}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {log.reason}
                      </span>
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
