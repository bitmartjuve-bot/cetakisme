import { ProductCard } from "@/components/customer/ProductCard";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: { 
      isActive: true,
      ...(category && category !== "Semua" ? {
        name: {
          contains: category
        }
      } : {})
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = ["Semua", "Kaos Oblong", "Polo", "Hoodie"];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Katalog Produk
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan berbagai jenis pakaian berkualitas tinggi yang siap dicetak dengan desain kreatif Anda.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = (!category && cat === "Semua") || category === cat;
            return (
              <Link
                key={cat}
                href={cat === "Semua" ? "/products" : `/products?category=${cat}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-blue-700 text-white shadow-md scale-105" 
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-700 hover:text-blue-700"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Produk tidak ditemukan</h3>
            <p className="mt-2 text-gray-500">Silakan pilih kategori lain atau kembali ke semua produk.</p>
          </div>
        )}
      </div>
    </div>
  );
}
