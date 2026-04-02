# 🏪 WARUNG ALI - STRUKTUR PROJECT

Berikut adalah struktur lengkap dan penjelasan setiap file dalam project Warung Ali:

```
warung_ali/
├── 📄 package.json                    # Konfigurasi project & dependencies
├── 📄 README.md                       # Dokumentasi project
├── 📄 PANDUAN_PENGGUNAAN.md          # Panduan lengkap untuk user
├── 📄 STRUKTUR_PROJECT.md            # File ini
├── 📄 .gitignore                     # File yang diabaikan git
│
├── 📁 backend/                       # Server & API (Node.js/Express)
│   ├── 📄 server.js                  # Entry point aplikasi
│   │   └─ Port: 3000
│   │   └─ Menjalankan Express server
│   │   └─ Routing API
│   │   └─ Serve static files
│   │
│   ├── 📄 database.js                # Database configuration & queries
│   │   └─ SQLite connection
│   │   └─ Fungsi CRUD products
│   │   └─ Fungsi CRUD sales
│   │   └─ Fungsi reporting
│   │
│   ├── 📄 seed.js                    # Script untuk menambah sample data
│   │   └─ Sample products (10 jenis)
│   │   └─ Sample sales (8 transaksi)
│   │   └─ Jalankan: node backend/seed.js
│   │
│   ├── warung.db                     # Database file (auto-created)
│   │   └─ SQLite database
│   │   └─ Tabel: products, sales
│   │
│   └── 📁 routes/                    # API endpoints
│       ├── 📄 products.js            # API routes untuk barang
│       │   ├─ GET /api/products
│       │   ├─ GET /api/products/:id
│       │   ├─ POST /api/products
│       │   ├─ PUT /api/products/:id
│       │   ├─ DELETE /api/products/:id
│       │   └─ POST /api/products/:id/stock
│       │
│       ├── 📄 sales.js              # API routes untuk penjualan
│       │   ├─ GET /api/sales
│       │   ├─ GET /api/sales/range/:startDate/:endDate
│       │   └─ POST /api/sales
│       │
│       └── 📄 reports.js            # API routes untuk laporan
│           ├─ GET /api/reports/profit
│           ├─ GET /api/reports/stock
│           └─ GET /api/reports/product/profit
│
└── 📁 frontend/                      # User Interface (HTML/CSS/JS)
    ├── 📄 index.html                 # Main HTML file
    │   └─ Struktur halaman
    │   └─ Dashboard section
    │   └─ Products section
    │   └─ Sales section
    │   └─ Reports section
    │   └─ Navigation sidebar
    │
    ├── 📁 css/
    │   └── 📄 style.css              # Styling lengkap
    │       ├─ Sidebar & navigation
    │       ├─ Dashboard cards
    │       ├─ Forms & buttons
    │       ├─ Tables
    │       ├─ Reports grid
    │       └─ Responsive design
    │
    └── 📁 js/
        └── 📄 app.js                 # Frontend logic
            ├─ Navigation functions
            ├─ Dashboard functions
            ├─ Product management
            ├─ Sales recording
            ├─ Report generation
            ├─ API communication (fetch)
            ├─ Form handling
            └─ Data formatting (currency, date)
```

## 📊 DATABASE SCHEMA

### Tabel: products
```
id              INTEGER PRIMARY KEY AUTOINCREMENT
name            TEXT NOT NULL
category        TEXT
purchase_price  REAL NOT NULL (harga beli/modal)
selling_price   REAL NOT NULL (harga jual)
stock           INTEGER DEFAULT 0
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Contoh Data:**
| id | name | category | purchase_price | selling_price | stock |
|----|------|----------|---|---|---|
| 1 | Mie Instan | Makanan | 2000 | 2500 | 50 |
| 2 | Teh Pucuk | Minuman | 3000 | 4000 | 30 |
| 3 | Energen | Minuman | 1500 | 2000 | 25 |

### Tabel: sales
```
id              INTEGER PRIMARY KEY AUTOINCREMENT
product_id      INTEGER NOT NULL (FK ke products)
quantity        INTEGER NOT NULL
price           REAL NOT NULL (harga jual per unit)
total           REAL NOT NULL (quantity × price)
profit          REAL NOT NULL (total - modal)
sale_date       DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Contoh Data:**
| id | product_id | quantity | price | total | profit | sale_date |
|----|---|---|---|---|---|---|
| 1 | 1 | 5 | 2500 | 12500 | 2500 | 2024-01-15 10:30 |
| 2 | 2 | 3 | 4000 | 12000 | 3000 | 2024-01-15 10:45 |

## 🔄 ALUR DATA

### 1. Menambah Barang Baru
```
Frontend Form
    ↓
handleProductSubmit()
    ↓
Fetch POST /api/products
    ↓
Backend: productRoutes.post()
    ↓
db.addProduct()
    ↓
INSERT INTO products
    ↓
Database (warung.db)
    ↓
Response success
    ↓
loadProducts() → Update UI
```

### 2. Mencatat Penjualan
```
Frontend Form (Product + Quantity)
    ↓
updateSaleCalculation() → Hitung profit otomatis
    ↓
handleSaleSubmit()
    ↓
Fetch POST /api/sales
    ↓
Backend: salesRoutes.post()
    ↓
Validasi stok
    ↓
Insert sale record
Update stock (berkurang)
    ↓
Database (warung.db)
    ↓
Response dengan detail profit
    ↓
loadSalesHistory() → Update UI
loadDashboard() → Update ringkasan
```

### 3. Membuat Laporan
```
Frontend: Click "Laporan"
    ↓
loadReports()
    ↓
Fetch GET /api/reports/profit
Fetch GET /api/reports/stock
Fetch GET /api/reports/product/profit
    ↓
Backend: reportRoutes.get()
    ↓
JOIN products + sales tables
GROUP BY product_id
SUM(quantity), SUM(profit), etc.
    ↓
Database Query
    ↓
Return aggregated data
    ↓
Frontend: Display di laporan page
```

## 📱 UI/UX COMPONENTS

### Sidebar Navigation
```
WARUNG ALI 🏪
Kelontong Management

- 📊 Dashboard
- 📦 Kelola Barang
- 💳 Catat Penjualan
- 📈 Laporan
```

### Dashboard Cards (6 cards)
- Total Penjualan
- Pendapatan
- Keuntungan Warung
- Total Barang
- Total Stok
- Nilai Stok

### Forms
- **Tambah Barang**: name, category, purchase_price, selling_price, stock
- **Catat Penjualan**: product_id, quantity (dengan auto-calculation)

### Tables
- Products Table (8 kolom)
- Sales History Table (7 kolom)
- Top Products Table (4 kolom)
- Stock Report Table (5 kolom)

## 🔐 KEAMANAN & VALIDASI

### Input Validation
- Nama barang: tidak boleh kosong
- Harga: harus number, > 0
- Harga jual > harga modal
- Jumlah penjualan: > 0, ≤ stok tersedia

### Business Rules
- Stok tidak boleh negatif
- Profit = (selling_price - purchase_price) × quantity
- Margin = ((selling_price - purchase_price) / purchase_price) × 100%

### Error Handling
- Try-catch di setiap API endpoint
- User-friendly error messages
- Validasi sampai ke database level

## 🚀 PERFORMANCE OPTIMIZATION

### Frontend
- Vanilla JavaScript (no framework = ringan)
- Efficient DOM manipulation
- Event delegation untuk forms
- Caching data di memory (saat needed)

### Backend
- Single connection pool SQLite
- Efficient queries dengan JOINs
- Aggregation di database level
- CORS enabled untuk API access

### Database
- Indexed primary keys
- Foreign key relationships
- Efficient queries dengan SELECT DISTINCT, GROUP BY

## 📦 DEPENDENCIES

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",      // Web framework
    "sqlite3": "^5.1.6",       // Database
    "body-parser": "^1.20.2",  // Parse request body
    "cors": "^2.8.5"           // Enable CORS
  },
  "devDependencies": {
    "nodemon": "^2.0.22"       // Auto-restart server
  }
}
```

### Frontend
- Tidak ada external dependencies
- Hanya vanilla HTML/CSS/JavaScript
- Fetch API built-in

## 🎯 FITUR UNGGULAN

1. **Real-time Calculation**
   - Profit dihitung otomatis saat input
   - Stok update instant

2. **Comprehensive Reporting**
   - Profit per produk
   - Profit warung keseluruhan
   - Stock status monitoring

3. **User-Friendly UI**
   - Responsive design
   - Clean interface
   - Clear navigation

4. **Data Persistence**
   - Semua data tersimpan di SQLite
   - Auto-create database
   - Secure local storage

5. **Easy to Extend**
   - Modular code structure
   - Clear API endpoints
   - Database schema yang flexible

## 🔧 MAINTENANCE

### Regular Tasks
- Monitor database size
- Backup data secara berkala
- Check error logs
- Update inventory regularly

### Troubleshooting
- Check server logs
- Verify database integrity
- Restart application
- Clear browser cache

## 📈 PERTUMBUHAN BISNIS DENGAN DATA

Data dari aplikasi ini berguna untuk:
1. Analisis penjualan produk
2. Pricing strategy (margin analysis)
3. Inventory management
4. Business growth tracking
5. Tax reporting

---

**Versi**: 1.0.0
**Dibuat untuk**: Manajemen Warung Kelontong
**Technology Stack**: 
- Backend: Node.js + Express + SQLite
- Frontend: HTML5 + CSS3 + Vanilla JS

Semoga aplikasi ini membantu mengelola warung Anda dengan lebih baik! 🎉
