"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!product) return <div>Produk tidak ditemukan</div>;

  return <ProductForm initialData={product} id={params.id as string} />;
}
