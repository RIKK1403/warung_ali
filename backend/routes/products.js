const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ADD product
router.post('/', async (req, res) => {
  try {
    const { name, category, purchase_price, selling_price, quantity_per_box } = req.body;

    if (!name || !purchase_price || !selling_price) {
      return res.status(400).json({
        success: false,
        message: 'Nama barang, harga modal, dan harga jual harus diisi'
      });
    }

    const qtyPerBox = quantity_per_box || 1;
    const id = await db.addProduct(name, category, purchase_price, selling_price, qtyPerBox);
    res.status(201).json({
      success: true,
      message: 'Barang berhasil ditambahkan',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  try {
    const { name, category, purchase_price, selling_price, stock, quantity_per_box } = req.body;
    
    const qtyPerBox = quantity_per_box || 1;
    await db.updateProduct(req.params.id, name, category, purchase_price, selling_price, stock, qtyPerBox);
    res.json({
      success: true,
      message: 'Barang berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await db.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Barang berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE stock
router.post('/:id/stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: 'Jumlah stok harus diisi'
      });
    }

    await db.updateStock(req.params.id, quantity);
    res.json({
      success: true,
      message: `Stok berhasil diperbarui (${quantity > 0 ? '+' : ''}${quantity})`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
