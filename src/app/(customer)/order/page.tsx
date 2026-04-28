"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Loader2, ArrowLeft, Store, Truck, ShoppingBag } from "lucide-react";

export default function OrderPage() {
  const router = useRouter();
  
  const [designData, setDesignData] = useState<any>(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupType, setPickupType] = useState("Tumumpa"); // Tumumpa, Paniki, Kirim
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  
  // Quantities for each size
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const data = localStorage.getItem("cetakisme_design");
    if (!data) {
      router.push("/design");
      return;
    }
    
    try {
      const parsed = JSON.parse(data);
      setDesignData(parsed);
      
      // Initialize quantities based on selected sizes
      const initialQtys: Record<string, number> = {};
      parsed.sizes.forEach((s: string) => {
        initialQtys[s] = 12; // default min order per size
      });
      setQuantities(initialQtys);

      // Fetch product details
      fetch(`/api/products`)
        .then(res => res.json())
        .then(products => {
          const prod = products.find((p: any) => p.id === parsed.productId);
          if (prod) {
            setProductDetails(prod);
          }
          setLoading(false);
        });
    } catch (e) {
      router.push("/design");
    }
  }, [router]);

  const handleQtyChange = (size: string, val: string) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 0) return;
    setQuantities(prev => ({ ...prev, [size]: num }));
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const basePrice = productDetails?.price || 0;
  // Let's add a fixed print cost of 25000 per shirt
  const printCost = 25000;
  const unitPrice = basePrice + printCost;
  const totalAmount = totalItems * unitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!name.trim()) return alert("Nama lengkap wajib diisi");
    if (!phone.trim() || !phone.match(/^[0-9+]{10,15}$/)) return alert("Nomor WA tidak valid");
    if (totalItems === 0) return alert("Total item tidak boleh nol");
    if (pickupType === "Kirim" && !address.trim()) return alert("Alamat pengiriman wajib diisi");

    setIsSubmitting(true);

    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, qty]) => ({
        productId: designData.productId,
        size: size,
        color: designData.color.name,
        quantity: qty,
        price: unitPrice
      }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          pickupType: pickupType,
          notes: pickupType === "Kirim" ? `Kirim ke: ${address}\n\nCatatan: ${notes}` : notes,
          items,
          totalAmount,
          design: {
            fileUrl: designData.image || designData.text,
            placement: designData.placement,
            notes: `Type: ${designData.designType}, Color: ${designData.textColor}`
          }
        })
      });

      if (!res.ok) throw new Error("Gagal membuat pesanan");

      const order = await res.json();
      localStorage.removeItem("cetakisme_design"); // Clear design
      router.push(`/payment/${order.id}`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan, silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <Link href="/design" className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Edit Desain
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-8">Form Pemesanan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8">
            <form id="order-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Pemesan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                    <input 
                      type="text" required
                      value={name} onChange={e => setName(e.target.value)}
                      className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor WA *</label>
                    <input 
                      type="tel" required placeholder="08..."
                      value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Opsional)</label>
                    <input 
                      type="email" 
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Metode Pengambilan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <label className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all ${pickupType === "Tumumpa" ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input type="radio" name="pickup" value="Tumumpa" checked={pickupType === "Tumumpa"} onChange={e => setPickupType(e.target.value)} className="hidden" />
                    <Store className="w-6 h-6" />
                    <span className="font-semibold text-sm">Ambil di Tumumpa</span>
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all ${pickupType === "Paniki" ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input type="radio" name="pickup" value="Paniki" checked={pickupType === "Paniki"} onChange={e => setPickupType(e.target.value)} className="hidden" />
                    <Store className="w-6 h-6" />
                    <span className="font-semibold text-sm">Ambil di Paniki</span>
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all ${pickupType === "Kirim" ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input type="radio" name="pickup" value="Kirim" checked={pickupType === "Kirim"} onChange={e => setPickupType(e.target.value)} className="hidden" />
                    <Truck className="w-6 h-6" />
                    <span className="font-semibold text-sm">Kirim ke Alamat</span>
                  </label>
                </div>

                {pickupType === "Kirim" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap *</label>
                    <textarea 
                      required rows={3}
                      value={address} onChange={e => setAddress(e.target.value)}
                      className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan..."
                    ></textarea>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Rincian Kuantitas Ukuran</h2>
                <div className="space-y-4">
                  {designData.sizes.map((size: string) => (
                    <div key={size} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-900 text-lg">
                          {size}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Ukuran {size}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(unitPrice)} / pcs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" min="0" 
                          value={quantities[size]}
                          onChange={(e) => handleQtyChange(size, e.target.value)}
                          className="w-20 rounded-lg border-gray-300 p-2 text-center border focus:ring-2 focus:ring-blue-500 font-semibold"
                        />
                        <span className="text-sm text-gray-500">pcs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Catatan Tambahan</h2>
                <textarea 
                  rows={3}
                  value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Instruksi khusus, permintaan kemasan, dll (Opsional)"
                ></textarea>
              </div>

            </form>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-700" /> Ringkasan Order
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Produk</span>
                  <span className="font-medium text-gray-900">{productDetails?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Warna</span>
                  <span className="font-medium text-gray-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border" style={{backgroundColor: designData.color.hex}}></span>
                    {designData.color.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Item</span>
                  <span className="font-medium text-gray-900">{totalItems} pcs</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-500">Subtotal ({totalItems} item)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-500">Ongkos Kirim</span>
                  <span className="font-medium text-gray-900">{pickupType === "Kirim" ? "Dihitung terpisah" : "Gratis (Ambil)"}</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-blue-700">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <p className="text-xs text-blue-800 text-center font-medium">
                  Estimasi pengerjaan 3-5 hari kerja setelah pembayaran dikonfirmasi.
                </p>
              </div>

              <button 
                type="submit" 
                form="order-form"
                disabled={isSubmitting || totalItems === 0}
                className="w-full py-4 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-700/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                ) : (
                  'Lanjut ke Pembayaran'
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
