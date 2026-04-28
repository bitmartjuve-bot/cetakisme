import { CheckCircle2, Clock, Package, Truck, XCircle, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusTimelineProps {
  currentStatus: string;
}

const statuses = [
  { id: "Baru", label: "Pesanan Dibuat", icon: Package },
  { id: "Menunggu Pembayaran", label: "Menunggu Pembayaran", icon: CreditCard },
  { id: "Pembayaran Dikonfirmasi", label: "Pembayaran Dikonfirmasi", icon: CheckCircle2 },
  { id: "Dalam Produksi", label: "Dalam Produksi", icon: Clock },
  { id: "Siap", label: "Siap Diambil/Dikirim", icon: Truck },
  { id: "Selesai", label: "Selesai", icon: CheckCircle2 },
];

export function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  if (currentStatus === "Dibatalkan") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex flex-col items-center justify-center text-center">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-800">Pesanan Dibatalkan</h3>
        <p className="text-sm text-red-600 mt-1">Pesanan ini telah dibatalkan dan tidak dapat diproses lebih lanjut.</p>
      </div>
    );
  }

  const currentIndex = statuses.findIndex((s) => s.id === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="relative border-l-2 border-gray-100 ml-3 md:ml-6 space-y-8">
      {statuses.map((status, index) => {
        const isActive = index <= activeIndex;
        const isCurrent = index === activeIndex;
        const Icon = status.icon;

        return (
          <div key={status.id} className="relative pl-8 md:pl-10">
            {/* Timeline Line (Active part) */}
            {index < statuses.length - 1 && isActive && index < activeIndex && (
              <div className="absolute left-[-2px] top-6 bottom-[-2rem] w-[2px] bg-blue-600" />
            )}

            <div
              className={cn(
                "absolute left-[-11px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white transition-colors duration-300",
                isActive ? "border-blue-600" : "border-gray-200",
                isCurrent && "ring-4 ring-blue-100"
              )}
            >
              {isActive ? (
                <div className="h-2 w-2 rounded-full bg-blue-600" />
              ) : null}
            </div>

            <div className={cn("flex items-start gap-4", !isActive && "opacity-50")}>
              <div className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="pt-2">
                <h4 className={cn("font-medium", isActive ? "text-gray-900" : "text-gray-500")}>
                  {status.label}
                </h4>
                {isCurrent && (
                  <p className="text-sm text-blue-600 mt-1">Status pesanan Anda saat ini</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
