"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { UploadButton } from "../../lib/uploadthing";

interface ProductFormProps {
  initialData?: any;
  id?: string;
}

export default function ProductForm({ initialData, id }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!id;
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    minOrder: initialData?.minOrder?.toString() || "12",
    image: initialData?.image || "",
    isActive: initialData?.isActive ?? true,
    variants: initialData?.variants?.map((v: any) => ({
      ...v,
      stock: v.stock.toString()
    })) || [{ size: "L", color: "Hitam", stock: "0" }],
  });

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: "L", color: "Putih", stock: "0" }]
    });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_: any, i: number) => i !== index)
    });
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants];
    (newVariants[index] as any)[field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = isEdit ? `/api/admin/products/${id}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save product", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">
            {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan Produk
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri - Info Dasar */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Informasi Dasar</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kaos Oversize Cotton Combed 24s"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Produk</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan detail bahan, keunggulan, dll..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Harga (per pcs)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Minimal Order</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={formData.minOrder}
                      onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-right pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold uppercase">pcs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Varian Produk</h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-sm"
              >
                <Plus className="w-4 h-4" /> Tambah Varian
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="pb-4">Ukuran</th>
                    <th className="pb-4">Warna</th>
                    <th className="pb-4">Stok Awal</th>
                    <th className="pb-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {formData.variants.map((v: any, idx: number) => (
                    <tr key={idx} className="group">
                      <td className="pr-2 pb-2">
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                        />
                      </td>
                      <td className="px-2 pb-2">
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                        />
                      </td>
                      <td className="px-2 pb-2">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-right"
                        />
                      </td>
                      <td className="pl-2 pb-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Media & Status */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Foto Produk</h3>
            
            <div className="space-y-4">
              <div className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="bg-white text-red-600 p-3 rounded-full shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase">Belum ada foto</p>
                  </div>
                )}
              </div>
              
              {!formData.image && (
                <div className="w-full">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: any) => {
                      if (res?.[0]) {
                        setFormData({ ...formData, image: res[0].url });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Status Publikasi</h3>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div>
                 <p className="font-bold text-slate-900 text-sm">Produk Aktif</p>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Tampil di Website</p>
               </div>
               <button
                 type="button"
                 onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                 className={`w-12 h-6 rounded-full transition-all relative ${
                   formData.isActive ? "bg-indigo-600" : "bg-slate-300"
                 }`}
               >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                   formData.isActive ? "right-1" : "left-1"
                 }`} />
               </button>
             </div>
          </div>
        </div>
      </div>
    </form>
  );
}
