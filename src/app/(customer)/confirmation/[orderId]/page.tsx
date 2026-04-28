"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Copy, Search, Share2, Loader2, CalendarClock } from "lucide-react";

export default function ConfirmationPage() {
  const { orderId } = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setOrder(data);
        }
        setLoading(false);
      });
  }, [orderId]);

  const copyToClipboard = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToWhatsApp = () => {
    if (!order) return;
    const text = `Halo Admin Cetakisme, saya telah melakukan pemesanan dengan nomor order: *${order.orderNumber}*. Mohon di cek ya. Terima kasih!`;
    const url = `https://wa.me/6285156103411?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>;
  if (!order) return <div className="flex h-screen items-center justify-center text-red-500">Pesanan tidak ditemukan</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="mx-auto max-w-lg text-center">
        
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-20 w-20 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">Pesanan Diterima!</h1>
        <p className="text-gray-600 text-lg mb-8">Terima kasih, {order.customerName.split(" ")[0]}! Pesanan Anda telah berhasil dibuat.</p>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 mb-8">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Nomor Pesanan</p>
          
          <div className="flex items-center justify-center gap-3 mb-6 bg-blue-50 py-4 px-6 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-black text-blue-700 font-mono tracking-tight">{order.orderNumber}</span>
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-white rounded-lg hover:bg-blue-100 transition-colors shadow-sm text-blue-700"
              title="Salin Nomor Pesanan"
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-50 py-3 px-4 rounded-xl font-medium">
            <CalendarClock className="w-5 h-5" />
            Estimasi Selesai: 3-5 Hari Kerja
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/track?id=${order.orderNumber}`}
            className="flex-1 py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
          >
            <Search className="w-5 h-5" /> Lacak Pesanan
          </Link>
          <button 
            onClick={shareToWhatsApp}
            className="flex-1 py-4 px-6 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
          >
            <Share2 className="w-5 h-5" /> Hubungi Admin
          </button>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">
            &larr; Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}
