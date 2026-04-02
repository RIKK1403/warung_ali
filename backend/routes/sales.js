const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all sales
router.get('/', async (req, res) => {
  try {
    const sales = await db.getAllSales();
    res.json({
      success: true,
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET sales by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const sales = await db.getSalesByDateRange(startDate, endDate);
    res.json({
      success: true,
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CLEAR all sales history
router.delete('/', async (req, res) => {
  try {
    await db.clearSales();
    res.json({
      success: true,
      message: 'Riwayat penjualan berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CLEAR negative-sales history
router.delete('/negative', async (req, res) => {
  try {
    await db.clearNegativeSales();
    res.json({
      success: true,
      message: 'Riwayat penjualan negatif berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CLEAR all data (products + sales)
router.delete('/all', async (req, res) => {
  try {
    await db.clearAllData();
    res.json({
      success: true,
      message: 'Semua data produk dan penjualan berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ADD sale
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product ID dan jumlah penjualan harus valid'
      });
    }

    // Get product details
    const product = await db.getProductById(product_id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Barang tidak ditemukan'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stok tidak cukup! Stok tersedia: ${product.stock}`
      });
    }

    // Calculate cost and profit per unit
    const unitPurchasePrice = product.purchase_price / (product.quantity_per_box || 1);
    const total = product.selling_price * quantity;
    const cost = unitPurchasePrice * quantity;
    const profit = total - cost;

    // Add sale record
    const saleId = await db.addSale(product_id, quantity, product.selling_price, total, profit);

    // Update stock
    await db.updateStock(product_id, -quantity);

    res.status(201).json({
      success: true,
      message: 'Penjualan berhasil dicatat',
      data: {
        id: saleId,
        product_name: product.name,
        quantity,
        total,
        profit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
