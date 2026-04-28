"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { formatCurrency } from "@/lib/utils";
import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function PaymentPage() {
  const { orderId } = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setOrder(data);
          if (data.status !== "Menunggu Pembayaran" && data.status !== "Baru") {
            // If already paid or cancelled, go to confirmation
            router.push(`/confirmation/${orderId}`);
          }
        }
        setLoading(false);
      });
  }, [orderId, router]);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/payment/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      // Open Midtrans Snap Popup
      (window as any).snap.pay(data.token, {
        onSuccess: function(result: any) {
          router.push(`/confirmation/${orderId}`);
        },
        onPending: function(result: any) {
          router.push(`/confirmation/${orderId}`);
        },
        onError: function(result: any) {
          alert("Pembayaran gagal. Silakan coba lagi.");
          setIsProcessing(false);
        },
        onClose: function() {
          setIsProcessing(false);
        }
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat memproses pembayaran");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      {/* Midtrans Snap Script */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-yellow-800">MODE TEST - Bukan pembayaran nyata</h3>
            <p className="text-sm text-yellow-700 mt-1">Gunakan metode pembayaran simulasi Midtrans Sandbox untuk menguji alur ini.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-700 p-6 text-center text-white">
            <h1 className="text-2xl font-black mb-1">Selesaikan Pembayaran</h1>
            <p className="text-blue-100 text-sm">Pesanan #{order.orderNumber}</p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center pb-6 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-500 mb-2">Total Tagihan</p>
              <p className="text-4xl font-black text-gray-900">{formatCurrency(order.totalAmount)}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                Ringkasan Pemesan
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-semibold text-gray-900">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">WhatsApp</span>
                  <span className="font-semibold text-gray-900">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pengambilan</span>
                  <span className="font-semibold text-gray-900">{order.pickupType}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Detail Item</h3>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-3 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">Ukuran {item.size} • Warna {item.color}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-700/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2 text-lg"
              >
                {isProcessing ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Membuka Pembayaran...</>
                ) : (
                  <><ShieldCheck className="w-6 h-6" /> Bayar Sekarang</>
                )}
              </button>
              <div className="flex justify-center items-center gap-2 mt-4 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" /> Pembayaran aman terenkripsi oleh Midtrans
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
