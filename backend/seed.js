// Script untuk menambahkan sample data ke database
// Jalankan: node backend/seed.js

const db = require('./database');

async function seedDatabase() {
  try {
    console.log('🌱 Menambahkan sample data...');

    // Sample products dengan harga per box yang realistis
    const sampleProducts = [
      { name: 'Mie Instan', category: 'Makanan', purchasePrice: 24000, sellingPrice: 2500, quantityPerBox: 12, stock: 50 },
      { name: 'Teh Pucuk', category: 'Minuman', purchasePrice: 18000, sellingPrice: 4000, quantityPerBox: 6, stock: 30 },
      { name: 'Energen', category: 'Minuman', purchasePrice: 12000, sellingPrice: 2000, quantityPerBox: 8, stock: 25 },
      { name: 'Shampoo', category: 'Kesehatan', purchasePrice: 100000, sellingPrice: 6500, quantityPerBox: 20, stock: 15 },
      { name: 'Sabun Cuci', category: 'Pembersih', purchasePrice: 35000, sellingPrice: 4500, quantityPerBox: 10, stock: 40 },
      { name: 'Gula 1kg', category: 'Makanan', purchasePrice: 60000, sellingPrice: 14000, quantityPerBox: 5, stock: 20 },
      { name: 'Beras 2kg', category: 'Makanan', purchasePrice: 280000, sellingPrice: 31000, quantityPerBox: 10, stock: 15 },
      { name: 'Minyak Goreng', category: 'Makanan', purchasePrice: 60000, sellingPrice: 17000, quantityPerBox: 4, stock: 10 },
      { name: 'Kopi Nescafe', category: 'Minuman', purchasePrice: 30000, sellingPrice: 3500, quantityPerBox: 12, stock: 35 },
      { name: 'Rokok', category: 'Barang lain-lain', purchasePrice: 450000, sellingPrice: 48000, quantityPerBox: 10, stock: 50 }
    ];

    let productIds = [];
    for (const product of sampleProducts) {
      const id = await db.addProduct(
        product.name,
        product.category,
        product.purchasePrice,
        product.sellingPrice,
        product.quantityPerBox
      );
      productIds.push({ id, ...product });
      
      // Update stock
      if (product.stock > 0) {
        await db.updateStock(id, product.stock);
      }
      console.log(`✓ Ditambahkan: ${product.name}`);
    }

    // Sample sales
    const sampleSales = [
      { productId: productIds[0].id, quantity: 5, sellPrice: 2500 },
      { productId: productIds[1].id, quantity: 3, sellPrice: 4000 },
      { productId: productIds[2].id, quantity: 2, sellPrice: 2000 },
      { productId: productIds[3].id, quantity: 1, sellPrice: 6500 },
      { productId: productIds[0].id, quantity: 3, sellPrice: 2500 },
      { productId: productIds[4].id, quantity: 2, sellPrice: 4500 },
      { productId: productIds[8].id, quantity: 4, sellPrice: 3500 },
      { productId: productIds[5].id, quantity: 2, sellPrice: 14000 },
    ];

    for (const sale of sampleSales) {
      const product = productIds.find(p => p.id === sale.productId);
      const pricePerUnit = product.purchasePrice / product.quantityPerBox;
      const total = sale.sellPrice * sale.quantity;
      const cost = pricePerUnit * sale.quantity;
      const profit = total - cost;

      await db.addSale(sale.productId, sale.quantity, sale.sellPrice, total, profit);
      await db.updateStock(sale.productId, -sale.quantity);
      console.log(`✓ Penjualan ${sale.quantity}x ${product.name}: Keuntungan Rp${profit}`);
    }

    console.log('🎉 Sample data berhasil ditambahkan!');
    console.log('\nServer siap dijalankan: npm start');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
