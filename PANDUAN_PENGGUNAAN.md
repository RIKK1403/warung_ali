# Panduan Setup Warung Ali

## 📋 Persyaratan
- Node.js (versi 12 atau lebih tinggi)
- npm (sudah termasuk dengan Node.js)
- Terminal/Command Prompt

## 🚀 Langkah-langkah Setup

### 1. Install Dependencies
Buka terminal di folder `warung_ali` dan jalankan:

```bash
npm install
```

Ini akan menginstall semua package yang diperlukan:
- express
- sqlite3
- cors
- body-parser

### 2. Jalankan Server

#### Tanpa Sample Data
```bash
npm start
```

#### Dengan Sample Data
Jika ingin menambahkan sample data untuk testing:

```bash
node backend/seed.js
npm start
```

Server akan berjalan di: `http://localhost:3000`

## 📖 Panduan Penggunaan Dasar

### 1. Halaman Dashboard
Saat pertama kali membuka aplikasi, Anda akan melihat Dashboard dengan:
- Total penjualan
- Total pendapatan
- Total keuntungan
- Riwayat penjualan terbaru

### 2. Menambah Produk Baru

**Langkah:**
1. Klik menu "📦 Kelola Barang"
2. Klik tombol "+ Tambah Barang"
3. Isi form:
   - **Nama Barang**: Nama produk (contoh: "Mie Instan")
   - **Kategori**: Jenis kategori (contoh: "Makanan", "Minuman")
   - **Harga Modal**: Harga pembelian produk (contoh: 2000)
   - **Harga Jual**: Harga menjual ke pelanggan (contoh: 2500)
   - **Stok Awal**: Jumlah stok awal (contoh: 50)
4. Klik "Simpan"

**Poin Penting:**
- Harga Jual harus lebih besar dari Harga Modal
- Margin keuntungan akan otomatis dihitung: `(Harga Jual - Harga Modal) / Harga Modal × 100%`

### 3. Mencatat Penjualan

**Langkah:**
1. Klik menu "💳 Catat Penjualan"
2. Pilih barang dari dropdown yang tersedia
3. Masukkan jumlah yang terjual (contoh: 5 unit)
4. Sistem akan otomatis menampilkan:
   - **Harga Satuan**: Harga jual per unit
   - **Total Penjualan**: Hasil kali harga × jumlah
   - **Biaya Modal**: Modal yang dikeluarkan
   - **Keuntungan**: Profit dari transaksi ini
5. Klik "✓ Catat Penjualan"

**Poin Penting:**
- Stok akan otomatis berkurang
- Tidak bisa menjual jika stok tidak cukup
- Keuntungan dihitung otomatis berdasarkan harga modal dan harga jual

### 4. Melihat Laporan

**Langkah:**
1. Klik menu "📈 Laporan"
2. Anda akan melihat beberapa bagian:

**Bagian 1: Laporan Keuntungan**
- Total transaksi penjualan
- Total pendapatan warung
- Total keuntungan warung
- Rata-rata profit per transaksi

**Bagian 2: Barang Terlaris**
- Daftar barang berdasarkan keuntungan terbesar
- Menampilkan: nama barang, jumlah terjual, jumlah transaksi, total keuntungan

**Bagian 3: Laporan Stok**
- Daftar semua barang dengan status stok
- Status:
  - 🟢 **Baik**: Stok > 20 unit
  - 🟡 **Rendah**: Stok 1-20 unit
  - 🔴 **Habis**: Stok 0 unit

## 💡 Contoh Perhitungan

### Contoh 1: Penjualan Mie Instan
```
Harga Modal: Rp 2.000
Harga Jual: Rp 2.500
Jumlah Terjual: 5 unit

Perhitungan:
- Total Penjualan = Rp 2.500 × 5 = Rp 12.500
- Biaya Modal = Rp 2.000 × 5 = Rp 10.000
- Keuntungan = Rp 12.500 - Rp 10.000 = Rp 2.500

Margin = (2.500 - 2.000) / 2.000 × 100% = 25%
```

### Contoh 2: Laporan Warung (dari 10 Transaksi)
```
Transaksi:
1. Mie: 5 unit → Profit Rp 2.500
2. Teh: 3 unit → Profit Rp 3.000
3. Energen: 2 unit → Profit Rp 1.000
4. Shampoo: 1 unit → Profit Rp 1.500
5. Sabun: 2 unit → Profit Rp 2.000
6. Mie: 3 unit → Profit Rp 1.500
7. Kopi: 4 unit → Profit Rp 4.000
8. Gula: 2 unit → Profit Rp 4.000
dan seterusnya...

Total Penjualan: 10 transaksi
Total Keuntungan Warung: Rp 19.500
Rata-rata Profit per Transaksi: Rp 1.950
```

## 🔧 Fitur Lanjutan

### Edit & Hapus Barang
Pada halaman "Kelola Barang", setiap barang memiliki tombol:
- **Edit**: Untuk mengubah informasi barang
- **Hapus**: Untuk menghapus barang

### Update Stok Manual
Jika ada perubahan stok (barang rusak, pengembalian, dll):
1. Buka "Kelola Barang"
2. Klik "Edit" pada barang yang diinginkan
3. Ubah jumlah stok
4. Simpan

## ⚙️ Tips & Trik

1. **Kategorisasi Barang**: Gunakan kategori yang konsisten (Makanan, Minuman, Kesehatan, dll) untuk memudahkan pencarian dan laporan

2. **Margin Keuntungan**: Pastikan margin keuntungan cukup untuk cover operasional warung. Minimal 15-20%

3. **Monitor Stok**: Periksa laporan stok secara berkala untuk menghindari stockout

4. **Data Lengkap**: Catat semua penjualan untuk analisis yang akurat

5. **Backup Data**: Backup file `backend/warung.db` secara berkala untuk keamanan data

## 🆘 Troubleshooting

### Aplikasi tidak bisa membuka
**Solusi:**
1. Pastikan server sudah running: `npm start`
2. Buka browser dan akses: `http://localhost:3000`
3. Jika tidak muncul, cek apakah ada error di terminal

### Error: "Port 3000 sudah digunakan"
**Solusi:**
```bash
PORT=3001 npm start
```
Kemudian akses `http://localhost:3001`

### Stok tidak berkurang setelah penjualan
**Solusi:**
1. Refresh halaman
2. Jika masih tidak berubah, restart server
3. Cek database tidak corrupted

### Database corrupted/Error
**Solusi:**
1. Hapus file `backend/warung.db`
2. Restart server dengan: `npm start`
3. Database akan dibuat ulang secara otomatis

## 📱 Responsif Design
Aplikasi ini responsive dan bisa diakses dari:
- Desktop/Laptop
- Tablet
- Mobile Phone

Cukup buka `-http://localhost:3000` di browser perangkat manapun dalam satu jaringan yang sama.

## 💾 Menyimpan Database
Database SQLite disimpan di: `backend/warung.db`

Untuk backup:
```bash
cp backend/warung.db backup_warung_$(date +%Y%m%d).db
```

## ❓ Pertanyaan Umum

**Q: Apakah data hilang setelah menutup aplikasi?**
A: Tidak, semua data tersimpan di database SQLite dan akan tetap ada.

**Q: Bisa di-host online?**
A: Ya, aplikasi ini bisa di-host ke cloud seperti Heroku, Railway, atau Vercel dengan konfigurasi tambahan.

**Q: Apakah ada backup otomatis?**
A: Belum, tapi Anda bisa membuat script backup sendiri atau gunakan solusi cloud storage.

**Q: Berapa kapasitas data yang bisa disimpan?**
A: SQLite bisa menangani jutaan transaksi tanpa masalah, sesuai dengan kebutuhan warung.

---

Selamat menggunakan Warung Ali! 🎉
