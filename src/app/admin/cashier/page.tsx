"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Printer,
  X,
  ChevronRight,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const CATEGORIES = ["Semua", "Kaos", "Polo", "Hoodie", "Aksesoris"];

export default function CashierPage() {
  const [location, setLocation] = useState<string | null>(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [cart, setCart] = useState<any[]>([]);
  const [discount, setDiscount] = useState({ type: "nominal", value: 0 });
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [amountPaid, setAmountPaid] = useState(0);
  const [showStruk, setShowStruk] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category !== "Semua") {
      // Assuming products have category, if not we'll mock it
      result = result.filter((p: any) => p.category === category || category === "Semua");
    }
    setFilteredProducts(result);
  }, [search, category, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount.type === "percentage" ? (subtotal * discount.value) / 100 : discount.value;
  const total = Math.max(0, subtotal - discountAmount);
  const kembalian = Math.max(0, amountPaid - total);

  const handleSelesaikan = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          customerName: customer.name,
          customerPhone: customer.phone,
          items: cart,
          totalAmount: total,
          discount: discountAmount,
          paymentMethod,
          amountPaid,
          change: kembalian,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLastTransaction(data);
        setShowStruk(true);
      }
    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTransaction = () => {
    setCart([]);
    setDiscount({ type: "nominal", value: 0 });
    setCustomer({ name: "", phone: "" });
    setAmountPaid(0);
    setShowStruk(false);
    setLastTransaction(null);
  };

  if (!location) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-3xl font-black text-indigo-600 tracking-tighter mb-4">
            CETAK<span className="text-slate-900">ISME</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pilih Lokasi Kasir</h2>
          <p className="text-slate-500 mb-8">Pilih lokasi Anda saat ini untuk mulai transaksi.</p>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setLocation("Tumumpa")}
              className="flex items-center justify-between p-6 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl transition-all group"
            >
              <div className="text-left">
                <p className="font-black text-slate-900 group-hover:text-indigo-600">CETAKISME TUMUMPA</p>
                <p className="text-xs text-slate-500">Jl. Raya Tumumpa No. 12</p>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-600" />
            </button>
            <button
              onClick={() => setLocation("Paniki")}
              className="flex items-center justify-between p-6 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl transition-all group"
            >
              <div className="text-left">
                <p className="font-black text-slate-900 group-hover:text-indigo-600">CETAKISME PANIKI</p>
                <p className="text-xs text-slate-500">Kawasan Grand Meridian</p>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-50 z-40 flex flex-col md:flex-row overflow-hidden">
      {/* Panel Kiri - Produk */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50 border-r border-slate-200">
        <div className="p-6 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation(null)}
                className="text-sm font-bold text-slate-500 hover:text-slate-900"
              >
                Ganti Lokasi
              </button>
              <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                Lokasi: {location}
              </div>
            </div>
            <div className="text-xl font-black text-indigo-600 tracking-tighter">
              CETAK<span className="text-slate-900">ISME</span> POS
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari produk berdasarkan nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                    category === cat
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product: any) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-left flex flex-col gap-3 group"
              >
                <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-10 h-10 text-slate-200" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-slate-500 mb-1">Stok: {product.variants?.reduce((s: number, v: any) => s + v.stock, 0) || 0}</p>
                  <p className="text-indigo-600 font-black">Rp {product.price.toLocaleString("id-ID")}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Kanan - Keranjang */}
      <div className="w-full md:w-[450px] flex flex-col bg-white shadow-2xl z-10">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-lg font-black uppercase tracking-widest">Keranjang</h2>
          </div>
          <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {cart.reduce((s, i) => s + i.quantity, 0)}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="font-bold">Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4>
                  <p className="text-indigo-600 font-bold text-xs mt-1">Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nama Customer (Opsional)"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="No HP (Opsional)"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setDiscount({ ...discount, value: discount.value > 0 ? 0 : 10000 })}
                className={`text-sm font-bold flex items-center gap-1.5 transition-all ${
                  discount.value > 0 ? "text-red-600" : "text-slate-400"
                }`}
              >
                <Trash2 className={`w-4 h-4 ${discount.value > 0 ? "block" : "hidden"}`} />
                {discount.value > 0 ? "Hapus Diskon" : "Tambah Diskon"}
              </button>
              {discount.value > 0 && (
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                  <input
                    type="number"
                    value={discount.value}
                    onChange={(e) => setDiscount({ ...discount, value: parseInt(e.target.value) || 0 })}
                    className="w-20 text-right font-bold text-sm outline-none px-2"
                  />
                  <select
                    value={discount.type}
                    onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
                    className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded"
                  >
                    <option value="nominal">IDR</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 py-4 border-t border-slate-200">
            <div className="flex justify-between text-slate-500">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-slate-900">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            {discount.value > 0 && (
              <div className="flex justify-between text-red-500">
                <span className="font-medium">Diskon</span>
                <span className="font-bold">- Rp {discountAmount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between items-end pt-2">
              <span className="text-slate-900 font-bold">Total Tagihan</span>
              <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Metode Pembayaran</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "Tunai", icon: Banknote },
                { id: "QRIS", icon: QrCode },
                { id: "Transfer", icon: CreditCard },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    paymentMethod === m.id
                      ? "bg-indigo-50 border-indigo-600 text-indigo-600"
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  <m.icon className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase">{m.id}</span>
                </button>
              ))}
            </div>

            {paymentMethod === "Tunai" && (
              <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Uang Diterima</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">Rp</span>
                  <input
                    type="number"
                    value={amountPaid || ""}
                    onChange={(e) => setAmountPaid(parseInt(e.target.value) || 0)}
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-indigo-100 rounded-2xl text-2xl font-black text-slate-900 outline-none focus:border-indigo-600 transition-all"
                    placeholder="0"
                  />
                </div>
                {amountPaid > 0 && (
                  <div className="flex justify-between items-center px-2 py-1 bg-emerald-50 rounded-lg">
                    <span className="text-xs font-bold text-emerald-600 uppercase">Kembalian</span>
                    <span className="text-xl font-black text-emerald-700">Rp {kembalian.toLocaleString("id-ID")}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            disabled={cart.length === 0 || isProcessing || (paymentMethod === "Tunai" && amountPaid < total)}
            onClick={handleSelesaikan}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                SELESAIKAN TRANSAKSI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal Struk */}
      {showStruk && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={resetTransaction}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-900 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="text-3xl font-black text-indigo-600 tracking-tighter">
                CETAK<span className="text-slate-900">ISME</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Lokasi {location}
              </p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                {location === "Tumumpa" ? "Jl. Raya Tumumpa No. 12" : "Kawasan Grand Meridian, Paniki"}
                <br />
                +62 851-5610-3411
              </p>
            </div>

            <div className="border-t border-b border-dashed border-slate-200 py-4 mb-4 space-y-1">
               <div className="flex justify-between text-[10px] text-slate-500">
                 <span>ID: {lastTransaction?.id.slice(-8).toUpperCase()}</span>
                 <span>{format(new Date(), "dd/MM/yy HH:mm")}</span>
               </div>
               {customer.name && (
                 <p className="text-[10px] font-bold text-slate-900">Cust: {customer.name}</p>
               )}
            </div>

            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-xs">
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.quantity} x {item.price.toLocaleString("id-ID")}</p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-dashed border-slate-200 pt-4 mb-8">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString("id-ID")}</span>
              </div>
              {discount.value > 0 && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Diskon</span>
                  <span>-{discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-1">
                <span>TOTAL</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-2">
                <span className="uppercase">{paymentMethod}</span>
                <span>{amountPaid.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>KEMBALI</span>
                <span>{kembalian.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 space-y-2">
              <p className="font-bold text-slate-900">Terima kasih!</p>
              <p>IG & TikTok: @cetakisme</p>
              <p className="italic font-medium uppercase tracking-widest text-indigo-400">Apply your Imagination</p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm"
              >
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button
                onClick={resetTransaction}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printer styles for receipt */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-content, #receipt-content * { visibility: visible; }
          #receipt-content { position: absolute; left: 0; top: 0; width: 58mm; }
        }
      `}</style>
    </div>
  );
}

function Loader2(props: any) {
  return <Loader2Icon {...props} />;
}
function Loader2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
