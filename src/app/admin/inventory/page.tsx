"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  History, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  Check, 
  X,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [showAdjustModal, setShowAdjustModal] = useState<any>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      setInventory(data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStock = async (id: string, newStock: number, reason: string = "Manual adjustment") => {
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock, reason }),
      });
      if (res.ok) {
        fetchInventory();
        setEditingId(null);
        setShowAdjustModal(null);
        setAdjustAmount(0);
        setAdjustReason("");
      }
    } catch (error) {
      console.error("Failed to update stock", error);
    }
  };

  const getStatus = (stock: number, threshold: number = 10) => {
    if (stock <= 0) return { label: "Habis", color: "bg-red-100 text-red-700" };
    if (stock <= threshold) return { label: "Menipis", color: "bg-orange-100 text-orange-700" };
    return { label: "Cukup", color: "bg-emerald-100 text-emerald-700" };
  };

  const filtered = inventory.filter((item: any) => 
    item.product.name.toLowerCase().includes(search.toLowerCase()) ||
    item.size.toLowerCase().includes(search.toLowerCase()) ||
    item.color.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-900">Manajemen Inventori</h1>
        <button
          onClick={() => window.location.href = "/admin/inventory/history"}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-4 py-2 rounded-xl font-bold transition-all"
        >
          <History className="w-5 h-5" />
          Riwayat Perubahan
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk, ukuran, atau warna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Varian</th>
                <th className="px-6 py-4">Stok Saat Ini</th>
                <th className="px-6 py-4">Threshold</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4 bg-slate-50/50 h-16"></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada item ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((item: any) => {
                  const status = getStatus(item.stock, 10);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            {item.product.image ? (
                              <img src={item.product.image} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <span className="font-bold text-slate-900">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.product.category || "Kaos"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black uppercase text-slate-600">
                            {item.size}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black uppercase text-slate-600">
                            {item.color}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                              onKeyDown={(e) => e.key === "Enter" && updateStock(item.id, editValue)}
                              className="w-20 px-2 py-1 border border-indigo-300 rounded outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                            <button onClick={() => updateStock(item.id, editValue)} className="p-1 text-emerald-600">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-red-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditValue(item.stock);
                            }}
                            className="font-black text-slate-900 text-lg hover:text-indigo-600 hover:underline"
                          >
                            {item.stock}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-medium">10</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setShowAdjustModal(item)}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold text-sm"
                        >
                          <Plus className="w-4 h-4" /> Tambah Stok
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Penyesuaian Stok</h2>
            <p className="text-slate-500 mb-6">
              Update stok untuk <span className="font-bold text-slate-900">{showAdjustModal.product.name}</span> ({showAdjustModal.size}, {showAdjustModal.color}).
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Jumlah Perubahan (+/-)</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setAdjustAmount(prev => prev - 1)}
                    className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all"
                  >
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  </button>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                    className="flex-1 text-center text-3xl font-black text-slate-900 bg-slate-50 border border-slate-200 py-3 rounded-2xl"
                  />
                  <button 
                    onClick={() => setAdjustAmount(prev => prev + 1)}
                    className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all"
                  >
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Alasan Perubahan</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Pilih alasan...</option>
                  <option value="Restock dari Supplier">Restock dari Supplier</option>
                  <option value="Retur Pelanggan">Retur Pelanggan</option>
                  <option value="Barang Rusak/Cacat">Barang Rusak/Cacat</option>
                  <option value="Audit Inventori">Audit Inventori</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAdjustModal(null)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => updateStock(showAdjustModal.id, showAdjustModal.stock + adjustAmount, adjustReason)}
                  disabled={!adjustReason || adjustAmount === 0}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
