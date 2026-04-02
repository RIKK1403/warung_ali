const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Pastikan folder backend ada
const backendDir = path.dirname(__filename);
if (!fs.existsSync(backendDir)) {
  fs.mkdirSync(backendDir, { recursive: true });
}

const dbPath = path.join(backendDir, 'warung.db');
console.log('Database path:', dbPath);

// Buat koneksi database dengan error handling
let db;
try {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      throw err;
    }
    console.log('Connected to SQLite database at:', dbPath);
  });
} catch (error) {
  console.error('Failed to create database connection:', error);
  throw error;
}

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        // Table untuk produk
        db.run(`
          CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            purchase_price REAL NOT NULL,
            selling_price REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            quantity_per_box INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating products table:', err);
            reject(err);
            return;
          }
          console.log('Products table ready');
        });

        // Alter table untuk tambah kolom jika belum ada
        db.run(`ALTER TABLE products ADD COLUMN quantity_per_box INTEGER DEFAULT 1`, (err) => {
          if (err && err.message.includes('duplicate column')) {
            // Kolom sudah ada, ignore
            console.log('quantity_per_box column already exists');
          } else if (err) {
            console.error('Error adding quantity_per_box column:', err);
          } else {
            console.log('Added quantity_per_box column');
          }
        });

        // Table untuk penjualan
        db.run(`
          CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            total REAL NOT NULL,
            profit REAL NOT NULL,
            sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(product_id) REFERENCES products(id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating sales table:', err);
            reject(err);
            return;
          }
          console.log('Sales table ready');
          resolve();
        });

      } catch (error) {
        console.error('Error in initDatabase:', error);
        reject(error);
      }
    });
  });
};

// GET all products
const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
      if (err) {
        console.error('Error getting all products:', err);
        reject(err);
      } else {
        console.log(`Retrieved ${rows.length} products`);
        resolve(rows);
      }
    });
  });
};

// GET product by id
const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error getting product by id:', err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// ADD product
const addProduct = (name, category, purchasePrice, sellingPrice, quantityPerBox = 1) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO products (name, category, purchase_price, selling_price, stock, quantity_per_box) VALUES (?, ?, ?, ?, 0, ?)',
      [name, category, purchasePrice, sellingPrice, quantityPerBox],
      function(err) {
        if (err) {
          console.error('Error adding product:', err);
          reject(err);
        } else {
          console.log(`Added product: ${name} with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      }
    );
  });
};

// UPDATE product
const updateProduct = (id, name, category, purchasePrice, sellingPrice, stock, quantityPerBox = 1) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE products SET name = ?, category = ?, purchase_price = ?, selling_price = ?, stock = ?, quantity_per_box = ? WHERE id = ?',
      [name, category, purchasePrice, sellingPrice, stock, quantityPerBox, id],
      (err) => {
        if (err) {
          console.error('Error updating product:', err);
          reject(err);
        } else {
          console.log(`Updated product ID: ${id}`);
          resolve();
        }
      }
    );
  });
};

// DELETE product
const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Error deleting product:', err);
        reject(err);
      } else {
        console.log(`Deleted product ID: ${id}`);
        resolve();
      }
    });
  });
};

// UPDATE stock
const updateStock = (id, quantity) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [quantity, id],
      (err) => {
        if (err) {
          console.error('Error updating stock:', err);
          reject(err);
        } else {
          console.log(`Updated stock for product ID: ${id} by ${quantity}`);
          resolve();
        }
      }
    );
  });
};

// ADD sale
const addSale = (productId, quantity, price, total, profit) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO sales (product_id, quantity, price, total, profit) VALUES (?, ?, ?, ?, ?)',
      [productId, quantity, price, total, profit],
      function(err) {
        if (err) {
          console.error('Error adding sale:', err);
          reject(err);
        } else {
          console.log(`Added sale for product ID: ${productId}, quantity: ${quantity}`);
          resolve(this.lastID);
        }
      }
    );
  });
};

// GET all sales
const getAllSales = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT s.*, p.name, p.purchase_price AS box_purchase_price, p.selling_price AS unit_selling_price, p.quantity_per_box,
        (p.purchase_price * 1.0 / p.quantity_per_box) AS unit_purchase_price
       FROM sales s
       JOIN products p ON s.product_id = p.id
       ORDER BY s.sale_date DESC`,
      (err, rows) => {
        if (err) {
          console.error('Error getting all sales:', err);
          reject(err);
        } else {
          console.log(`Retrieved ${rows.length} sales records`);
          resolve(rows);
        }
      }
    );
  });
};

// GET sales by date range
const getSalesByDateRange = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT s.*, p.name, p.purchase_price AS box_purchase_price, p.selling_price AS unit_selling_price, p.quantity_per_box,
        (p.purchase_price * 1.0 / p.quantity_per_box) AS unit_purchase_price
       FROM sales s
       JOIN products p ON s.product_id = p.id
       WHERE DATE(s.sale_date) BETWEEN ? AND ?
       ORDER BY s.sale_date DESC`,
      [startDate, endDate],
      (err, rows) => {
        if (err) {
          console.error('Error getting sales by date range:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

// GET profit summary
const getProfitSummary = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
        COUNT(*) as total_sales,
        SUM(total) as total_revenue,
        SUM(profit) as total_profit,
        AVG(profit) as avg_profit
       FROM sales`,
      (err, row) => {
        if (err) {
          console.error('Error getting profit summary:', err);
          reject(err);
        } else {
          console.log('Retrieved profit summary');
          resolve(row);
        }
      }
    );
  });
};

// GET daily profit summary
const getDailyProfit = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DATE(sale_date) as date,
        COUNT(*) as total_transactions,
        SUM(total) as total_revenue,
        SUM(profit) as total_profit
      FROM sales
      GROUP BY DATE(sale_date)
      ORDER BY DATE(sale_date) DESC`,
      (err, rows) => {
        if (err) {
          console.error('Error getting daily profit:', err);
          reject(err);
        } else {
          console.log(`Retrieved ${rows.length} daily profit records`);
          resolve(rows);
        }
      }
    );
  });
};

// CLEAR all sales history
const clearSales = () => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM sales', function(err) {
      if (err) {
        console.error('Error clearing sales:', err);
        reject(err);
      } else {
        console.log(`Cleared ${this.changes} sales records`);
        resolve();
      }
    });
  });
};

// CLEAR negative-profit sales
const clearNegativeSales = () => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM sales WHERE profit < 0', function(err) {
      if (err) {
        console.error('Error clearing negative sales:', err);
        reject(err);
      } else {
        console.log(`Cleared ${this.changes} negative profit sales`);
        resolve();
      }
    });
  });
};

// CLEAR all data from products and sales
const clearAllData = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DELETE FROM sales', function(err) {
        if (err) return reject(err);
        db.run('DELETE FROM products', function(err2) {
          if (err2) return reject(err2);
          console.log('Cleared all data');
          resolve();
        });
      });
    });
  });
};

// GET stock summary
const getStockSummary = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
        id,
        name,
        category,
        stock,
        purchase_price,
        selling_price,
        quantity_per_box,
        (stock * (purchase_price * 1.0 / quantity_per_box)) as total_value
       FROM products
       ORDER BY stock DESC`,
      (err, rows) => {
        if (err) {
          console.error('Error getting stock summary:', err);
          reject(err);
        } else {
          console.log(`Retrieved ${rows.length} stock records`);
          resolve(rows);
        }
      }
    );
  });
};

// Initialize database with sample data if empty
const initDatabaseWithSampleData = async () => {
  try {
    await initDatabase();

    // Check if products table is empty
    const products = await getAllProducts();
    if (products.length === 0) {
      console.log('Adding sample products...');

      // Sample products
      const sampleProducts = [
        { name: 'Indomie Goreng', category: 'Makanan', purchasePrice: 2500, sellingPrice: 3500, quantityPerBox: 40 },
        { name: 'Susu Ultra Milk', category: 'Minuman', purchasePrice: 12000, sellingPrice: 15000, quantityPerBox: 12 },
        { name: 'Biskuit Roma', category: 'Snack', purchasePrice: 8000, sellingPrice: 12000, quantityPerBox: 20 },
        { name: 'Teh Botol Sosro', category: 'Minuman', purchasePrice: 3000, sellingPrice: 4500, quantityPerBox: 24 },
        { name: 'Sabun Lifebuoy', category: 'Kebutuhan', purchasePrice: 2500, sellingPrice: 4000, quantityPerBox: 72 }
      ];

      for (const product of sampleProducts) {
        await addProduct(
          product.name,
          product.category,
          product.purchasePrice,
          product.sellingPrice,
          product.quantityPerBox
        );
      }

      console.log('Sample products added successfully');
    } else {
      console.log(`Found ${products.length} existing products`);
    }

  } catch (error) {
    console.error('Error initializing with sample data:', error);
    throw error;
  }
};

module.exports = {
  initDatabase,
  initDatabaseWithSampleData,
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  addSale,
  getAllSales,
  getSalesByDateRange,
  getProfitSummary,
  getDailyProfit,
  clearSales,
  clearNegativeSales,
  clearAllData,
  getStockSummary
};
