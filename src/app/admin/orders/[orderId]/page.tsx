"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Download,
  MessageSquare,
  Printer,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    fetchOrder();
  }, [params.orderId]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.orderId}`);
      const data = await res.json();
      setOrder(data);
      setInternalNotes(data.notes || "");
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const saveInternalNotes = async () => {
    if (internalNotes === order?.notes) return;
    setSaveStatus("saving");
    try {
      await fetch(`/api/admin/orders/${params.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save notes", error);
      setSaveStatus("idle");
    }
  };

  const sendWhatsApp = () => {
    const phone = order.customerPhone.replace(/[^0-9]/g, "");
    const formattedPhone = phone.startsWith("0") ? "62" + phone.slice(1) : phone;
    let message = `Halo Kak ${order.customerName}, kami dari Cetakisme. `;
    
    if (order.status === "Baru") {
      message += `Pesanan #${order.orderNumber} Anda telah kami terima dan sedang diproses. Terima kasih!`;
    } else if (order.status === "Dalam Produksi") {
      message += `Pesanan #${order.orderNumber} Anda saat ini sedang dalam tahap produksi. Mohon tunggu kabar selanjutnya ya!`;
    } else if (order.status === "Siap Diambil") {
      message += `Kabar baik! Pesanan #${order.orderNumber} Anda sudah siap diambil. Silakan datang ke workshop kami.`;
    } else if (order.status === "Selesai") {
      message += `Terima kasih telah memesan di Cetakisme. Pesanan #${order.orderNumber} Anda telah selesai. Kami tunggu orderan selanjutnya!`;
    }

    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const printSlip = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!order) {
    return <div className="p-8 text-center text-slate-500">Pesanan tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali ke Daftar
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={printSlip}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-4 py-2 rounded-xl font-bold transition-all"
          >
            <Printer className="w-5 h-5" />
            Cetak Slip
          </button>
          <button
            onClick={sendWhatsApp}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100"
          >
            <MessageSquare className="w-5 h-5" />
            Kirim WA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri - Info Lengkap */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-slate-900">Pesanan #{order.orderNumber}</h2>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                  order.isWalkIn ? "bg-slate-200 text-slate-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {order.isWalkIn ? "WALK-IN" : "ONLINE ORDER"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(order.createdAt), "dd MMMM yyyy, HH:mm", { locale: localeId })}
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Informasi Pelanggan</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-xs text-slate-500">Nama Lengkap</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{order.customerPhone}</p>
                      <p className="text-xs text-slate-500">Nomor WhatsApp</p>
                    </div>
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{order.customerEmail}</p>
                        <p className="text-xs text-slate-500">Email</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Metode Pengambilan</h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="font-bold text-slate-900">{order.pickupType}</p>
                   <p className="text-sm text-slate-500 mt-1">
                     {order.pickupType === "Ambil di Toko" ? "Pelanggan akan datang ke workshop." : "Pesanan akan dikirim via kurir."}
                   </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Item Pesanan</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{item.product.name}</h4>
                      <p className="text-sm text-slate-500">
                        Ukuran: <span className="font-bold text-slate-700">{item.size}</span> | 
                        Warna: <span className="font-bold text-slate-700">{item.color}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">{item.quantity} pcs</p>
                      <p className="text-xs text-slate-500">Rp {item.price.toLocaleString("id-ID")} / pcs</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <div className="w-full md:w-64 space-y-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>Rp {order.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span>Rp {order.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desain & Catatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Preview Desain</h3>
               {order.design ? (
                 <div className="space-y-4">
                   <div className="aspect-square bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                     <img src={order.design.fileUrl} alt="Design Preview" className="max-w-full max-h-full object-contain" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <p className="text-sm text-slate-600">
                       <span className="font-bold">Posisi:</span> {order.design.placement}
                     </p>
                     <a
                       href={order.design.fileUrl}
                       download
                       target="_blank"
                       className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all"
                     >
                       <Download className="w-4 h-4" /> Download Desain
                     </a>
                   </div>
                 </div>
               ) : (
                 <div className="aspect-square bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-center p-4">
                   <AlertCircle className="w-8 h-8 mb-2" />
                   <p className="text-xs font-bold uppercase">Tidak ada desain diunggah</p>
                   <p className="text-[10px] mt-1">Mungkin pesanan walk-in atau desain via WA</p>
                 </div>
               )}
             </div>

             <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Catatan Pelanggan</h3>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm italic">
                    "{order.customerNotes || "Tidak ada catatan dari pelanggan."}"
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Catatan Internal Admin</h3>
                    {saveStatus === "saving" && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
                    {saveStatus === "saved" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    onBlur={saveInternalNotes}
                    placeholder="Tulis catatan rahasia admin di sini... (Auto-save)"
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Kolom Kanan - Status & Riwayat */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Status Pembayaran</h3>
             <div className={`p-4 rounded-xl border text-center ${
               order.payment?.status === "PAID" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-orange-50 border-orange-200 text-orange-700"
             }`}>
               <p className="text-2xl font-black">{order.payment?.status || "PENDING"}</p>
               <p className="text-xs font-bold uppercase mt-1">Metode: {order.payment?.method || "N/A"}</p>
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Update Status Pesanan</h3>
             <div className="space-y-3">
               {["Baru", "Dalam Produksi", "Siap Diambil", "Selesai", "Dibatalkan"].map((s) => (
                 <button
                   key={s}
                   disabled={isUpdating || order.status === s}
                   onClick={() => updateStatus(s)}
                   className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                     order.status === s
                       ? "bg-slate-100 text-slate-500 cursor-default"
                       : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600"
                   }`}
                 >
                   {order.status === s && <CheckCircle2 className="w-4 h-4" />}
                   {s}
                 </button>
               ))}
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Riwayat Status</h3>
             <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
               {order.statusHistory.map((history: any, idx: number) => (
                 <div key={history.id} className="relative pl-8">
                   <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                     idx === 0 ? "bg-indigo-600" : "bg-slate-300"
                   }`}>
                     <Clock className="w-3 h-3 text-white" />
                   </div>
                   <div>
                     <p className={`font-bold text-sm ${idx === 0 ? "text-indigo-600" : "text-slate-600"}`}>
                       {history.status}
                     </p>
                     <p className="text-xs text-slate-400">
                       {format(new Date(history.createdAt), "dd MMM, HH:mm", { locale: localeId })}
                     </p>
                     {history.notes && <p className="text-xs text-slate-500 mt-1">{history.notes}</p>}
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Print Slip Styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          main { padding: 0 !important; margin: 0 !important; }
          header, aside, nav { display: none !important; }
          .bg-white { border: none !important; shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
