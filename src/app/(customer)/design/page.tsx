"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Upload, Type, Download, ArrowRight, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = [
  { id: "black", name: "Hitam", hex: "#111827" },
  { id: "white", name: "Putih", hex: "#ffffff" },
  { id: "navy", name: "Navy", hex: "#1e3a8a" },
  { id: "red", name: "Merah", hex: "#dc2626" },
  { id: "yellow", name: "Kuning", hex: "#facc15" },
  { id: "green", name: "Hijau", hex: "#166534" },
  { id: "gray", name: "Abu-abu", hex: "#6b7280" },
];

const sizes = ["S", "M", "L", "XL", "XXL"];

const placements = [
  { id: "front", label: "Depan" },
  { id: "back", label: "Belakang" },
  { id: "both", label: "Depan & Belakang" },
  { id: "left_sleeve", label: "Lengan Kiri" },
  { id: "right_sleeve", label: "Lengan Kanan" },
];

function DesignStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProductId = searchParams?.get("product") || "";

  const mockupRef = useRef<HTMLDivElement>(null);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Design State
  const [selectedProduct, setSelectedProduct] = useState(initialProductId);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedPlacement, setSelectedPlacement] = useState("front");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  // Customization State
  const [activeTab, setActiveTab] = useState<"image" | "text">("image");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(24);
  const [textPosition, setTextPosition] = useState({ top: 40, left: 50 }); // percentages

  const [isDownloading, setIsDownloading] = useState(false);

  const productVectors: Record<string, string> = {
    "Kaos Oblong": "/mockups/tshirt.png",
    "Polo Shirt": "/mockups/polo.png",
    "Hoodie": "/mockups/hoodie.png",
    "default": "/mockups/tshirt.png"
  };

  const getCurrentProduct = () => {
    return products.find(p => p.id === selectedProduct);
  };

  const getMockupVector = () => {
    const product = getCurrentProduct();
    if (!product) return productVectors.default;
    
    const name = product.name;
    if (name.includes("Kaos Oblong")) return productVectors["Kaos Oblong"];
    if (name.includes("Polo")) return productVectors["Polo Shirt"];
    if (name.includes("Hoodie")) return productVectors["Hoodie"];
    
    return productVectors.default;
  };


  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if (initialProductId) {
          setSelectedProduct(initialProductId);
        } else if (data.length > 0) {
          setSelectedProduct(data[0].id);
        }
        setLoading(false);
      });
  }, [initialProductId]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPreview = async () => {
    if (!mockupRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(mockupRef.current, { backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'cetakisme-preview.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to download", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleProceedToOrder = () => {
    if (!selectedProduct) {
      alert("Pilih produk terlebih dahulu!");
      return;
    }
    if (selectedSizes.length === 0) {
      alert("Pilih minimal satu ukuran yang dibutuhkan!");
      return;
    }
    if (!uploadedImage && !customText) {
      alert("Silakan upload desain gambar atau tambahkan teks!");
      return;
    }

    const designData = {
      productId: selectedProduct,
      color: selectedColor,
      placement: selectedPlacement,
      sizes: selectedSizes,
      designType: activeTab,
      image: uploadedImage,
      text: customText,
      textColor: textColor,
      // Default qty mapping for selected sizes
      items: selectedSizes.map(size => ({
        size,
        quantity: 12 // Default minimum order logic
      }))
    };

    localStorage.setItem("cetakisme_design", JSON.stringify(designData));
    router.push("/order");
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-8">Design Tool Studio</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">1. Pilih Dasar Kaos</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipe Produk</label>
                  <select 
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - Rp{p.price.toLocaleString('id-ID')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Warna Kaos</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "h-10 w-10 rounded-full border-2 transition-all",
                          selectedColor.id === color.id ? "border-blue-600 scale-110" : "border-gray-200 hover:scale-105"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Posisi Sablon</label>
                  <div className="grid grid-cols-2 gap-2">
                    {placements.map(placement => (
                      <button
                        key={placement.id}
                        onClick={() => setSelectedPlacement(placement.id)}
                        className={cn(
                          "px-3 py-2 text-sm rounded-lg border transition-all text-left",
                          selectedPlacement === placement.id 
                            ? "bg-blue-50 border-blue-600 text-blue-700 font-semibold" 
                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                        )}
                      >
                        {placement.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">2. Desain Sablon</h2>
              
              <div className="flex border-b mb-4">
                <button
                  className={cn("flex-1 py-2 text-sm font-semibold border-b-2 transition-colors flex justify-center items-center gap-2", activeTab === "image" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700")}
                  onClick={() => setActiveTab("image")}
                >
                  <ImageIcon className="w-4 h-4" /> Upload Gambar
                </button>
                <button
                  className={cn("flex-1 py-2 text-sm font-semibold border-b-2 transition-colors flex justify-center items-center gap-2", activeTab === "text" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700")}
                  onClick={() => setActiveTab("text")}
                >
                  <Type className="w-4 h-4" /> Tambah Teks
                </button>
              </div>

              {activeTab === "image" ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                    <input 
                      type="file" 
                      id="file-upload" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Pilih gambar (Max 5MB)</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG, SVG dengan background transparan disarankan</span>
                    </label>
                  </div>
                  {uploadedImage && (
                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                      <span className="text-sm truncate max-w-[200px]">Desain.png</span>
                      <button onClick={() => setUploadedImage(null)} className="text-red-500 text-sm hover:underline">Hapus</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teks</label>
                    <input 
                      type="text" 
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Masukkan teks desain..."
                      className="w-full rounded-lg border-gray-300 p-2.5 border"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Warna Teks</label>
                      <input 
                        type="color" 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full h-10 rounded border p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran ({textSize}px)</label>
                      <input 
                        type="range" 
                        min="16" max="72" 
                        value={textSize}
                        onChange={(e) => setTextSize(parseInt(e.target.value))}
                        className="w-full mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">3. Ukuran Dibutuhkan</h2>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "w-12 h-12 rounded-lg font-bold transition-colors",
                      selectedSizes.includes(size)
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Pilih semua ukuran yang ingin Anda pesan. Kuantitas per ukuran dapat diatur di halaman selanjutnya.</p>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[500px] relative">
              
              {/* Toolbar */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={handleDownloadPreview}
                  disabled={isDownloading}
                  className="p-2 bg-white rounded-lg shadow border hover:bg-gray-50 text-gray-700 transition-colors"
                  title="Download Preview"
                >
                  {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                </button>
              </div>

              {/* Mockup Container */}
              <div 
                ref={mockupRef}
                className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center transition-all duration-500 overflow-hidden"
              >
                {/* 1. Color Layer (Masked Silhouette) */}
                <div 
                  className="absolute inset-0 transition-colors duration-500"
                  style={{ 
                    backgroundColor: selectedColor.hex,
                    maskImage: `url(${getMockupVector()})`,
                    WebkitMaskImage: `url(${getMockupVector()})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                  }}
                />

                {/* 2. Shading Layer (Multiply Overlay for details/shadows) */}
                <img 
                  src={getMockupVector()}
                  alt="Mockup Shading"
                  className="absolute inset-0 w-full h-full object-contain mix-blend-multiply opacity-80 pointer-events-none"
                />

                {/* Printable Area Box (visual guide) */}
                <div className="absolute top-[22%] w-[45%] aspect-[3/4] border border-dashed border-gray-400/30 flex flex-col items-center pt-4 pointer-events-none">
                  {/* Render Design Image */}
                  {activeTab === "image" && uploadedImage && (
                    <div className="relative w-full aspect-square mt-2 px-4">
                      <img 
                        src={uploadedImage} 
                        alt="Design" 
                        className="w-full h-full object-contain drop-shadow-md" 
                      />
                    </div>
                  )}

                  {/* Render Design Text */}
                  {activeTab === "text" && customText && (
                    <div 
                      className="font-bold text-center mt-6 drop-shadow-md leading-tight"
                      style={{ 
                        color: textColor, 
                        fontSize: `${textSize}px`,
                        wordBreak: 'break-word',
                        maxWidth: '95%'
                      }}
                    >
                      {customText}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <button
              onClick={handleProceedToOrder}
              className="mt-8 flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-blue-700 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-700/30 transition-all hover:bg-blue-800 hover:-translate-y-1"
            >
              Lanjut ke Pemesanan <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
export default function DesignPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>}>
      <DesignStudio />
    </Suspense>
  );
}
