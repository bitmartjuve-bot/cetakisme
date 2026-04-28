import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string | null;
}

export function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg">{name}</h3>
        <p className="mt-2 text-xl font-bold text-blue-700">
          {formatCurrency(price)}
        </p>
        <Link
          href={`/design?product=${id}`}
          className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-700/20 active:scale-95"
        >
          Desain & Pesan
        </Link>
      </div>
    </div>
  );
}
