# ⚡ QUICK START - Warung Ali

Mulai gunakan aplikasi Warung Ali dalam 3 langkah mudah!

## 1️⃣ Install & Start (Pilih salah satu)

### Opsi A: Tanpa Sample Data
```bash
cd warung_ali
npm install
npm start
```

### Opsi B: Dengan Sample Data (DIREKOMENDASIKAN)
```bash
cd warung_ali
npm install
node backend/seed.js
npm start
```

Buka browser: **http://localhost:3000**

---

## 2️⃣ Periksa Halaman Pertama (Dashboard)

Anda akan melihat:
✅ Cards dengan statistik warung
✅ Tombol navigasi di sidebar kiri
✅ Riwayat penjualan terbaru

---

## 3️⃣ Praktik Dasar (5 menit pertama)

### A. Tambah Produk Baru
1. Klik **📦 Kelola Barang**
2. Klik **+ Tambah Barang**
3. Isi contoh:
   ```
   Nama: Mie Instant
   Kategori: Makanan
   Harga Modal: 2000
   Harga Jual: 2500
   Stok Awal: 50
   ```
4. Klik **Simpan**

### B. Catat Penjualan
1. Klik **💳 Catat Penjualan**
2. Pilih barang dari dropdown
3. Masukkan jumlah: `5`
4. Lihat perhitungan otomatis:
   ```
   Harga Satuan: Rp 2.500
   Total Jual: Rp 12.500
   Biaya Modal: Rp 10.000
   Keuntungan: Rp 2.500 ✓
   ```
5. Klik **✓ Catat Penjualan**

### C. Lihat Laporan
1. Klik **📈 Laporan**
2. Lihat:
   - Total keuntungan warung Anda
   - Barang terlaris (by profit)
   - Status stok setiap barang

### D. Lihat Dashboard Update
1. Klik **📊 Dashboard**
2. Perhatikan perubahan:
   - Total Penjualan: +1
   - Pendapatan: +Rp 12.500
   - Keuntungan: +Rp 2.500
   - Stok berkurang: 50 → 45

---

## 🎯 Fitur Utama Dijelaskan Singkat

| Menu | Fungsi | Waktu |
|------|--------|-------|
| 📊 Dashboard | Lihat overview bisnis | 1 min |
| 📦 Kelola Barang | Tambah/edit/hapus produk | 2 min |
| 💳 Catat Penjualan | Catat transaksi & stok | 1 min |
| 📈 Laporan | Analisis profit & stok | 1 min |

---

## 💡 Contoh Skenario Real

### Pagi: Setup Awal
```
1. Tambah 5 jenis barang baru
2. Set stok awal untuk setiap barang
3. Lihat di Dashboard
```

### Siang: Catat Penjualan (setiap transaksi)
```
1. Pelanggan beli 3x Mie → Catat
2. Pelanggan beli 1x Teh → Catat
3. Pelanggan beli 2x Sabun → Catat
Profit otomatis terhitung di laporan!
```

### Sore: Cek Laporan
```
1. Lihat total keuntungan hari ini
2. Lihat barang terlaris
3. Lihat stok mana yang habis/rendah
4. Rencanakan pembelian besok
```

---

## 🚨 Poin Penting

✅ **Stok otomatis berkurang**: Tidak perlu update manual
✅ **Profit otomatis dihitung**: Tidak perlu kalkulator
✅ **All-in-one solution**: Kelola stok + profit + laporan
✅ **Responsive design**: Bisa diakses dari HP/tablet
❌ **JANGAN**: Mengubah file database secara manual

---

## 🔄 Workflow Harian

```
PAGI
├─ Cek inventory (Dashboard)
└─ Catat stok baru yang datang

SIANG (Saat Jualan)
├─ Review customer transaction → Catat penjualan
└─ Update stok otomatis

SORE
├─ Cek laporan keuntungan
├─ Monitor stok rendah
└─ Rencanakan pembelian besok
```

---

## ❓ FAQ Super Singkat

**Q: Data hilang kalau tutup aplikasi?**
A: Tidak! Tersimpan di database.

**Q: Berapa profit saya hari ini?**
A: Buka Laporan → lihat "Total Keuntungan"

**Q: Barang habis, gimana?**
A: Lihat Laporan → Stok Status menunjukkan yang habis

**Q: Salah input penjualan?**
A: Hapus dan input ulang (fitur edit coming soon)

**Q: Port 3000 error?**
A: Ganti port: `PORT=3001 npm start`

---

## 🎓 Sample Data Awal (jika pakai seed.js)

10 produk:
1. Mie Instan (Stok: 50)
2. Teh Pucuk (Stok: 30)
3. Energen (Stok: 25)
4. Shampoo (Stok: 15)
5. Sabun Cuci (Stok: 40)
6. Gula 1kg (Stok: 20)
7. Beras 2kg (Stok: 15)
8. Minyak Goreng (Stok: 10)
9. Kopi Nescafe (Stok: 35)
10. Rokok (Stok: 50)

8 sample transaksi sudah tercatat untuk testing.

---

## 📞 Support

**Runtime Error?**
- Stop server (Ctrl+C)
- Jalankan ulang: `npm start`

**Database Corrupted?**
- Hapus: `backend/warung.db`
- Jalankan: `npm start` (auto-recreate)

**Butuh bantuan lebih?**
- Baca: `README.md` (dokumentasi lengkap)
- Baca: `PANDUAN_PENGGUNAAN.md` (manual lengkap)
- Baca: `STRUKTUR_PROJECT.md` (technical deep-dive)

---

## 🎉 Selesai!

Anda sekarang siap menggunakan Warung Ali!

**Next Steps:**
1. Mulai tambah produk Anda
2. Catat semua penjualan
3. Review laporan setiap hari
4. Lihat bisnis Anda berkembang! 📈

---

**Happy Selling! 🏪💰**

Versi: 1.0.0 | Node.js + Express + SQLite
