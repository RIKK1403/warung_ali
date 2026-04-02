# Warung Ali - Kelontong Management System

Website manajemen warung kelontong dengan fitur stok dan keuntungan. Aplikasi ini dirancang untuk memudahkan pengelolaan inventori, pencatatan penjualan, dan analisis keuntungan warung.

## Fitur Utama

### 1. **Dashboard**
- Ringkasan total penjualan, pendapatan, dan keuntungan warung
- Tampilan stok barang dan nilai total stok
- Laporan penjualan terakhir

### 2. **Kelola Barang**
- Tambah barang baru dengan harga modal dan harga jual
- Edit dan hapus barang
- Kelola stok barang
- Lihat margin keuntungan setiap barang
- Tampilan nilai stok (harga modal × jumlah stok)

### 3. **Catat Penjualan**
- Form penjualan dengan perhitungan otomatis
- Tracking stok otomatis (berkurang saat terjual)
- Perhitungan keuntungan per transaksi
- Riwayat penjualan lengkap

### 4. **Laporan & Analisis**
- Laporan keuntungan totalwarung
- Laporan barang terlaris berdasarkan keuntungan
- Laporan stok dengan status (Baik, Rendah, Habis)
- Analisis profit per produk
- Tingkat margin keuntungan

## Teknologi yang Digunakan

### Backend
- **Node.js** dengan **Express.js**
- **SQLite3** untuk database
- **CORS** untuk API integration
- **Body Parser** untuk request parsing

### Frontend
- **HTML5**
- **CSS3** (Responsive Design)
- **Vanilla JavaScript** (ES6+)
- **Fetch API** untuk komunikasi dengan server

## Struktur Folder

```
warung_ali/
├── backend/
│   ├── server.js              # Entry point aplikasi
│   ├── database.js            # Database configuration & queries
│   ├── routes/
│   │   ├── products.js        # API endpoints untuk produk
│   │   ├── sales.js           # API endpoints untuk penjualan
│   │   └── reports.js         # API endpoints untuk laporan
│   └── warung.db              # Database file (auto-created)
├── frontend/
│   ├── index.html             # Main HTML
│   ├── css/
│   │   └── style.css          # Styling
│   └── js/
│       └── app.js             # Frontend logic
├── package.json               # Project dependencies
└── README.md                  # Documentation
```

## Database Schema

### Tabel: products
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT) - Nama barang
- category (TEXT) - Kategori barang
- purchase_price (REAL) - Harga modal/beli
- selling_price (REAL) - Harga jual
- stock (INTEGER) - Jumlah stok
- created_at (DATETIME)
```

### Tabel: sales
```sql
- id (INTEGER PRIMARY KEY)
- product_id (INTEGER) - FK ke products
- quantity (INTEGER) - Jumlah terjual
- price (REAL) - Harga jual per unit
- total (REAL) - Total penjualan
- profit (REAL) - Keuntungan (total - biaya modal)
- sale_date (DATETIME)
```

## API Endpoints

### Products
- `GET /api/products` - Dapatkan semua barang
- `GET /api/products/:id` - Dapatkan barang spesifik
- `POST /api/products` - Tambah barang baru
- `PUT /api/products/:id` - Update barang
- `DELETE /api/products/:id` - Hapus barang
- `POST /api/products/:id/stock` - Update stok barang

### Sales
- `GET /api/sales` - Dapatkan semua penjualan
- `GET /api/sales/range/:startDate/:endDate` - Penjualan by date range
- `POST /api/sales` - Catat penjualan baru

### Reports
- `GET /api/reports/profit` - Laporan keuntungan warung
- `GET /api/reports/stock` - Laporan stok
- `GET /api/reports/product/profit` - Laporan profit per produk

## Instalasi & Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server
```bash
npm start
```

Atau untuk development (dengan auto-reload):
```bash
npm run dev
```

### 3. Buka di Browser
```
http://localhost:3000
```

## Cara Menggunakan

### Menambah Barang Baru
1. Klik menu "Kelola Barang"
2. Klik button "+ Tambah Barang"
3. Isi form: Nama, Kategori, Harga Modal, Harga Jual, Stok Awal
4. Klik "Simpan"

### Mencatat Penjualan
1. Klik menu "Catat Penjualan"
2. Pilih barang dari dropdown
3. Masukkan jumlah penjualan
4. Sistem akan otomatis hitung total, biaya modal, dan keuntungan
5. Klik "Catat Penjualan"

### Melihat Laporan
1. Klik menu "Laporan"
2. Lihat ringkasan keuntungan warung
3. Lihat barang terlaris berdasarkan keuntungan
4. Lihat status stok setiap barang

## Fitur Kalkulasi

### Perhitungan Keuntungan
```
Keuntungan = (Harga Jual × Jumlah) - (Harga Modal × Jumlah)
```

### Margin Keuntungan
```
Margin = ((Harga Jual - Harga Modal) / Harga Modal) × 100%
```

### Nilai Stok
```
Nilai Stok = Harga Modal × Jumlah Stok
```

## Sistem Stok Otomatis
- Stok berkurang otomatis saat penjualan dicatat
- Sistem akan mencegah penjualan jika stok tidak cukup
- Menampilkan warning jika stok rendah

## Catatan Penting

1. **Validasi Harga**: Harga jual harus lebih besar dari harga modal
2. **Validasi Stok**: Tidak bisa menjual barang jika stok habis
3. **Database**: SQLite database otomatis dibuat saat pertama kali menjalankan aplikasi
4. **Recovery**: Jika ingin reset database, hapus file `backend/warung.db` lalu jalankan server lagi

## Pengembangan Lebih Lanjut

Fitur yang bisa ditambahkan:
- Sistem user login & authentication
- Export laporan ke PDF/Excel
- Analisis grafik penjualan
- Manajemen supplier
- Sistem kas harian
- Notifikasi stok minimum otomatis
- Mobile app version

## Troubleshooting

### Port sudah digunakan
```bash
# Gunakan port berbeda
PORT=3001 npm start
```

### Database corrupted
```bash
# Hapus database dan buat baru
rm backend/warung.db
npm start
```

### Dependencies error
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

## Lisensi
Free untuk digunakan dan dikembangkan sesuai kebutuhan.

## Support
Untuk pertanyaan atau bantuan, silahkan hubungi developer.
