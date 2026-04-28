"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Package, ShoppingBag, Eye, EyeOff } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const filtered = products.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-900">Manajemen Produk</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" />
          Tambah Produk Baru
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
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
                <th className="px-6 py-4">Harga (per pcs)</th>
                <th className="px-6 py-4">Min. Order</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 bg-slate-50/50 h-16"></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada produk ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((product: any) => (
                  <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${!product.isActive ? "opacity-60" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                          {product.image ? (
                            <img src={product.image} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <span className="font-bold text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {product.category || "Kaos"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {product.minOrder} pcs
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(product.id, product.isActive)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                          product.isActive 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {product.isActive ? (
                          <>
                            <Eye className="w-3 h-3" /> Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Nonaktif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
