import React from 'react';
import Link from 'next/link';
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let products: any[] = [];
  let error = null;

  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      take: 6,
    });
  } catch (e: any) {
    console.error("Prisma Error:", e);
    error = e.message;
  }

  // Data dummy sebagai fallback jika database kosong atau error
  const dummyProducts = [
    {
      id: "dummy-1",
      nama: "Kaos Polos Cotton Combed 30s",
      harga: "Rp 55.000",
      gambar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500",
      deskripsi: "Bahan adem dan menyerap keringat."
    },
    {
      id: "dummy-2",
      nama: "Kaos Custom Sablon DTF",
      harga: "Rp 85.000",
      gambar: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=500",
      deskripsi: "Bebas desain suka-suka tanpa minimal order."
    },
    {
      id: "dummy-3",
      nama: "Kaos Oversize Streetwear",
      harga: "Rp 110.000",
      gambar: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=500",
      deskripsi: "Potongan boxy fit yang kekinian."
    }
  ];

  const displayProducts = products.length > 0 
    ? products.map(p => ({
        id: p.id,
        nama: p.name,
        harga: `Rp ${p.price.toLocaleString('id-ID')}`,
        gambar: p.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500",
        deskripsi: p.description
      }))
    : dummyProducts;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-700">Koleksi Kaos Terbaik</h1>
        <p className="mt-4 text-gray-500">Kualitas sablon premium dengan bahan cotton kualitas ekspor.</p>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
            Database Error: {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayProducts.map((item) => (
          <div key={item.id} className="group border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="relative h-72 w-full overflow-hidden bg-gray-100">
              <img
                src={item.gambar}
                alt={item.nama}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">{item.nama}</h2>
              <p className="text-sm text-gray-500 mt-2">{item.deskripsi}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">{item.harga}</span>
                <Link 
                  href={`/design?product=${item.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Detail Produk
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}