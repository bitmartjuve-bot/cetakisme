import { MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl mb-4">
            Hubungi Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Punya pertanyaan atau ingin berdiskusi tentang pesanan kustom partai besar? 
            Jangan ragu untuk menghubungi tim kami atau kunjungi workshop Cetakisme terdekat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card Tumumpa */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-blue-700" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Cabang Tumumpa</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Lingkungan IV, Tumumpa Dua, Tuminting<br />
              Manado, Sulawesi Utara 95239
            </p>
            <a 
              href="https://maps.google.com/?q=Tumumpa+Manado" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-800"
            >
              Buka di Google Maps &rarr;
            </a>
          </div>

          {/* Card Paniki */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-blue-700" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Cabang Paniki</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Paniki Bawah, Mapanget<br />
              Manado, Sulawesi Utara 95256
            </p>
            <a 
              href="https://maps.google.com/?q=Paniki+Bawah+Manado" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-800"
            >
              Buka di Google Maps &rarr;
            </a>
          </div>
        </div>

        <div className="bg-blue-700 rounded-3xl p-8 md:p-12 shadow-xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-blue-600">
            
            <div className="pb-8 md:pb-0 md:pr-12 flex flex-col items-center md:items-start">
              <Phone className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
              <p className="text-blue-100 mb-4 text-sm">Konsultasi cepat via chat</p>
              <a 
                href="https://wa.me/6285156103411" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-black hover:text-amber-400 transition-colors"
              >
                +62 851-5610-3411
              </a>
            </div>

            <div className="py-8 md:py-0 md:px-12 flex flex-col items-center md:items-start">
              <Clock className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Jam Operasional</h3>
              <p className="text-blue-100 text-sm">
                Senin - Sabtu<br />
                <span className="text-lg font-bold text-white mt-1 block">08.00 - 17.00 WITA</span>
              </p>
              <p className="text-amber-400 font-bold mt-2 text-sm">Minggu Libur</p>
            </div>

            <div className="pt-8 md:pt-0 md:pl-12 flex flex-col items-center md:items-start">
              <div className="flex gap-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="text-amber-400" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="text-amber-400" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                  </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sosial Media</h3>
              <p className="text-blue-100 text-sm mb-4">Ikuti update terbaru kami</p>
              <div className="flex flex-col gap-2">
                <a href="https://instagram.com/cetakisme" className="text-lg font-bold hover:text-amber-400 transition-colors">@cetakisme</a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
