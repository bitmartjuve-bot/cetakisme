"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, PackageCheck } from "lucide-react";
import { OrderStatusTimeline } from "@/components/customer/OrderStatusTimeline";
import { formatCurrency } from "@/lib/utils";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams?.get("id") || "";

  const [orderNumber, setOrderNumber] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Pesanan tidak ditemukan. Pastikan nomor pesanan benar (contoh: CTK-YYYYMMDD-XXXX).");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat melacak pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-track if initialId exists
  useEffect(() => {
    if (initialId) {
      handleTrack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="mx-auto max-w-3xl">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">Lacak Pesanan</h1>
          <p className="text-gray-600">Masukkan nomor pesanan Anda untuk mengetahui status terkininya.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="contoh: CTK-20240115-0001"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg transition-colors bg-gray-50 uppercase"
              />
            </div>
            <button 
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="py-4 px-8 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-700/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Lacak"}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 font-medium text-center">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
            {result.status === "Siap" && (
              <div className="bg-green-500 text-white p-6 text-center">
                <PackageCheck className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-2xl font-black">Pesanan Siap!</h2>
                <p className="font-medium mt-1">Silakan ambil pesanan Anda atau tunggu kurir kami mengantarnya.</p>
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-gray-100 pb-6 mb-8 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Nomor Pesanan</p>
                  <p className="text-2xl font-black text-gray-900 font-mono">{result.orderNumber}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Pemesan</p>
                  <p className="text-lg font-bold text-blue-700">Hi, {result.customerName}!</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-gray-900 mb-6">Status Perjalanan</h3>
                <OrderStatusTimeline currentStatus={result.status} />
              </div>
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>}>
      <TrackingContent />
    </Suspense>
  );
}
