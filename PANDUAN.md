# PANDUAN OPERASIONAL CETAKISME

Selamat! Sistem manajemen internal Cetakisme telah siap digunakan. Berikut adalah panduan untuk menjalankan dan mengelola sistem ini setiap hari.

## 1. Cara Menjalankan Sistem

Setiap kali Anda ingin mulai bekerja, ikuti langkah-langkah berikut:

1. **Buka Terminal / Command Prompt**:
   - Di Windows: Tekan `Win + R`, ketik `cmd`, lalu Enter.
   - Di Mac: Tekan `Cmd + Space`, ketik `Terminal`, lalu Enter.

2. **Masuk ke Folder Project**:
   ```bash
   cd [path-ke-folder-cetakisme]
   ```

3. **Pastikan Database Berjalan**:
   - Sistem ini menggunakan SQLite, jadi database sudah tersimpan dalam file `dev.db`. Tidak perlu menjalankan server database terpisah.

4. **Jalankan Aplikasi**:
   ```bash
   pnpm dev
   ```
   *Jika Anda belum menginstall pnpm, gunakan `npm run dev`.*

5. **Akses Lewat Browser**:
   - **Website Customer**: [http://localhost:3000](http://localhost:3000)
   - **Dashboard Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

6. **Menghentikan Server**:
   - Tekan `Ctrl + C` di terminal, lalu ketik `Y` jika diminta konfirmasi.

---

## 2. Akun Akses Default

- **Email Admin**: `admin@cetakisme.com`
- **Password**: `admin123`
*Segera ganti password di menu Pengaturan > Akun Admin setelah login.*

---

## 3. Fitur Utama Admin

### 🛒 Modul Kasir (POS)
Gunakan modul ini untuk transaksi langsung (walk-in) di workshop.
- Pilih lokasi (Tumumpa/Paniki) sebelum memulai.
- Cari produk dan klik untuk menambah ke keranjang.
- Mendukung diskon nominal/persentase.
- Cetak struk digital setelah transaksi selesai.

### 📦 Manajemen Inventori
- Stok akan berkurang otomatis setiap ada penjualan.
- Gunakan badge warna (Hijau/Kuning/Merah) untuk memantau stok yang kritis.
- Edit stok langsung di tabel dengan mengklik angka stok.

### 📊 Laporan & Analisis
- Pantau pendapatan harian, mingguan, atau bulanan.
- Lihat perbandingan performa Online vs Walk-in.
- Export laporan ke **PDF** untuk arsip atau **Excel** untuk pengolahan data lanjut.

---

## 4. Troubleshooting (Masalah Umum)

- **Port 3000 sudah dipakai**:
  Jalankan dengan port berbeda: `pnpm dev -p 3001`.
- **Database Error**:
  Jalankan `npx prisma generate` untuk memperbarui koneksi database.
- **Gambar tidak muncul**:
  Pastikan koneksi internet stabil (sistem menggunakan UploadThing untuk penyimpanan gambar).

---

## 5. Cara Backup Project

Sangat disarankan untuk melakukan backup ke GitHub secara rutin:
1. `git add .`
2. `git commit -m "Update sistem [Tanggal]"`
3. `git push origin main`

---

**Cetakisme - Apply your Imagination**
*Sistem ini dikembangkan untuk mendukung efisiensi operasional dan pertumbuhan bisnis Anda.*
