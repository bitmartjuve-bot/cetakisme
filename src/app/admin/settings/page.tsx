"use client";

import { useEffect, useState } from "react";
import {
  Store,
  Settings as SettingsIcon,
  CreditCard,
  User,
  Save,
  Loader2,
  CheckCircle2,
  MapPin,
  Phone,
  Globe,
  Camera,
  Share2,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("toko");
  const [settings, setSettings] = useState<any>({
    storeName: "Cetakisme",
    tagline: "Apply your Imagination",
    addressTumumpa: "Jl. Raya Tumumpa No. 12, Manado",
    addressPaniki: "Kawasan Grand Meridian, Paniki, Manado",
    phone: "+62 851-5610-3411",
    instagram: "cetakisme",
    facebook: "cetakisme",
    tiktok: "cetakisme",
    minOrder: "12",
    productionDays: "5",
    lowStockThreshold: "10",
    midtransMode: "sandbox",
    midtransServerKey: "",
    midtransClientKey: "",
    midtransMerchantId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (Object.keys(data).length > 0) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const tabs = [
    { id: "toko", name: "Informasi Toko", icon: Store },
    { id: "sistem", name: "Pengaturan Sistem", icon: SettingsIcon },
    { id: "midtrans", name: "Pembayaran Midtrans", icon: CreditCard },
    { id: "akun", name: "Akun Admin", icon: User },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Pengaturan</h1>
          <p className="text-slate-500">Konfigurasi sistem dan identitas bisnis Cetakisme.</p>
        </div>
        {saveSuccess && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-right-4 duration-300">
            <CheckCircle2 className="w-5 h-5" />
            Pengaturan berhasil disimpan!
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tab Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-500 hover:bg-white hover:text-slate-900"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSave} className="p-8 space-y-8">
            {activeTab === "toko" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Identitas Toko</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Toko</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi 1 (Tumumpa)</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <textarea
                        value={settings.addressTumumpa}
                        onChange={(e) => setSettings({ ...settings, addressTumumpa: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi 2 (Paniki)</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <textarea
                        value={settings.addressPaniki}
                        onChange={(e) => setSettings({ ...settings, addressPaniki: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nomor WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Instagram Username</label>
                    <div className="relative">
                      <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={settings.instagram}
                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sistem" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Parameter Sistem</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Order</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={settings.minOrder}
                        onChange={(e) => setSettings({ ...settings, minOrder: e.target.value })}
                        className="w-24 px-4 py-2 border border-slate-200 rounded-lg font-black text-indigo-600 outline-none"
                      />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">pcs per pesanan</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">*Berlaku untuk semua produk secara default.</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Estimasi Produksi</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={settings.productionDays}
                        onChange={(e) => setSettings({ ...settings, productionDays: e.target.value })}
                        className="w-24 px-4 py-2 border border-slate-200 rounded-lg font-black text-indigo-600 outline-none"
                      />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">hari kerja</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">*Ditampilkan sebagai estimasi kepada pelanggan.</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Threshold Stok Menipis</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={settings.lowStockThreshold}
                        onChange={(e) => setSettings({ ...settings, lowStockThreshold: e.target.value })}
                        className="w-24 px-4 py-2 border border-slate-200 rounded-lg font-black text-indigo-600 outline-none"
                      />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">unit</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">*Notifikasi muncul jika stok di bawah angka ini.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "midtrans" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Integrasi Midtrans</h3>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, midtransMode: "sandbox" })}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        settings.midtransMode === "sandbox" ? "bg-white text-orange-600 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      Sandbox
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, midtransMode: "production" })}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        settings.midtransMode === "production" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400"
                      }`}
                    >
                      Production
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck className="w-5 h-5 text-indigo-500" />
                       <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Kunci Keamanan</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Server Key</label>
                      <input
                        type="password"
                        value={settings.midtransServerKey}
                        onChange={(e) => setSettings({ ...settings, midtransServerKey: e.target.value })}
                        placeholder="M-Server-XXXXXXXX"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Client Key</label>
                      <input
                        type="password"
                        value={settings.midtransClientKey}
                        onChange={(e) => setSettings({ ...settings, midtransClientKey: e.target.value })}
                        placeholder="M-Client-XXXXXXXX"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Merchant ID</label>
                      <input
                        type="text"
                        value={settings.midtransMerchantId}
                        onChange={(e) => setSettings({ ...settings, midtransMerchantId: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Test Koneksi Midtrans
                  </button>
                </div>
              </div>
            )}

            {activeTab === "akun" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Keamanan Akun</h3>
                
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Admin</label>
                    <input
                      type="email"
                      defaultValue="admin@cetakisme.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase mb-4">Ganti Password</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Password Lama</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Password Baru</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Konfirmasi Password Baru</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                SIMPAN SEMUA PERUBAHAN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
