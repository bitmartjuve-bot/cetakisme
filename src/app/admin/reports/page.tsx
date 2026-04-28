"use client";

import { useEffect, useState, useRef } from "react";
import {
  Calendar,
  Download,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  ChevronDown,
  BarChart3,
  PieChart as PieChartIcon,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ReportsPage() {
  const reportRef = useRef(null);
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    to: format(endOfDay(new Date()), "yyyy-MM-dd"),
  });
  const [summary, setSummary] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const query = `from=${dateRange.from}&to=${dateRange.to}`;
      const [sumRes, prodRes, payRes] = await Promise.all([
        fetch(`/api/admin/reports/summary?${query}`),
        fetch(`/api/admin/reports/products?${query}`),
        fetch(`/api/admin/reports/payments?${query}`),
      ]);
      
      setSummary(await sumRes.json());
      setProducts(await prodRes.json());
      setPayments(await payRes.json());
    } catch (error) {
      console.error("Failed to fetch report data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setShortcut = (type: string) => {
    const now = new Date();
    let from, to;
    
    switch (type) {
      case "today":
        from = startOfDay(now);
        to = endOfDay(now);
        break;
      case "week":
        from = startOfWeek(now, { weekStartsOn: 1 });
        to = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
      case "lastMonth":
        from = startOfMonth(subMonths(now, 1));
        to = endOfMonth(subMonths(now, 1));
        break;
      default:
        return;
    }
    
    setDateRange({
      from: format(from, "yyyy-MM-dd"),
      to: format(to, "yyyy-MM-dd"),
    });
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`laporan_cetakisme_${dateRange.from}_to_${dateRange.to}.pdf`);
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ["Laporan Ringkasan Cetakisme"],
      ["Periode", `${dateRange.from} - ${dateRange.to}`],
      [""],
      ["Total Pendapatan", summary?.totalRevenue],
      ["Total Pesanan", summary?.totalOrders],
      ["Pesanan Selesai", summary?.completedOrders],
      ["Pesanan Dibatalkan", summary?.cancelledOrders],
    ];
    const wsSum = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSum, "Ringkasan");

    // Products Sheet
    const wsProd = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(wb, wsProd, "Produk Terlaris");

    XLSX.writeFile(wb, `laporan_cetakisme_${dateRange.from}_to_${dateRange.to}.xlsx`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Date Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "today", label: "Hari Ini" },
            { id: "week", label: "Minggu Ini" },
            { id: "month", label: "Bulan Ini" },
            { id: "lastMonth", label: "Bulan Lalu" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setShortcut(s.id)}
              className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-sm font-bold border border-slate-100 transition-all"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-slate-400 font-bold">s/d</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="h-10 w-px bg-slate-100 hidden lg:block mx-2" />
          <div className="flex gap-2">
            <button
              onClick={exportPDF}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Export PDF"
            >
              <Download className="w-6 h-6" />
            </button>
            <button
              onClick={exportExcel}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              title="Export Excel"
            >
              <BarChart3 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-600" />
          <p className="font-bold uppercase tracking-widest text-xs">Menyusun Laporan...</p>
        </div>
      ) : (
        <div ref={reportRef} className="space-y-8 p-1">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
              <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
              <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider">Total Pendapatan</p>
              <h4 className="text-2xl font-black mt-1">Rp {summary?.totalRevenue?.toLocaleString("id-ID")}</h4>
              <p className="text-xs text-indigo-200 mt-2">↑ 12% dari periode lalu</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <ShoppingBag className="w-8 h-8 mb-4 text-slate-200" />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Pesanan</p>
              <h4 className="text-2xl font-black mt-1 text-slate-900">{summary?.totalOrders}</h4>
              <p className="text-xs text-emerald-500 mt-2 font-bold">{summary?.completedOrders} Selesai</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <XCircle className="w-8 h-8 mb-4 text-slate-200" />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Dibatalkan</p>
              <h4 className="text-2xl font-black mt-1 text-slate-900">{summary?.cancelledOrders}</h4>
              <p className="text-xs text-red-400 mt-2 font-bold">{((summary?.cancelledOrders / summary?.totalOrders) * 100).toFixed(1)}% Cancel Rate</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8 mb-4 text-slate-200" />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Rata-rata Nilai</p>
              <h4 className="text-2xl font-black mt-1 text-slate-900">Rp {Math.round(summary?.avgOrderValue || 0).toLocaleString("id-ID")}</h4>
              <p className="text-xs text-slate-400 mt-2">Per pesanan unik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Tren Pendapatan</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Online</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Walk-in</div>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary?.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickFormatter={(val) => format(new Date(val), "dd MMM")}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickFormatter={(val) => `Rp${val/1000}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    />
                    <Bar dataKey="online" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="pos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-8">Metode Pembayaran</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={payments}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {payments.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {payments.map((p: any, idx: number) => (
                    <div key={p.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-xs font-bold text-slate-700">{p.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">Rp {p.value.toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-6">Produk Terlaris</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-4">Peringkat</th>
                    <th className="pb-4">Nama Produk</th>
                    <th className="pb-4 text-center">Unit Terjual</th>
                    <th className="pb-4 text-right">Pendapatan</th>
                    <th className="pb-4 text-right">% Kontribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p: any, idx: number) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          idx === 0 ? "bg-amber-100 text-amber-600" : idx === 1 ? "bg-slate-100 text-slate-600" : "bg-orange-50 text-orange-600"
                        }`}>
                          #{idx + 1}
                        </div>
                      </td>
                      <td className="py-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-4 text-center font-black text-indigo-600">{p.units}</td>
                      <td className="py-4 text-right font-bold text-slate-900">Rp {p.revenue.toLocaleString("id-ID")}</td>
                      <td className="py-4 text-right">
                         <div className="flex items-center justify-end gap-3">
                           <span className="text-xs font-bold text-slate-400">{p.percentage.toFixed(1)}%</span>
                           <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: `${p.percentage}%` }} />
                           </div>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
