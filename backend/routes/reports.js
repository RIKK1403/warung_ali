const express = require('express');
const router = express.Router();
const db = require('../database');

// GET profit summary
router.get('/profit', async (req, res) => {
  try {
    const summary = await db.getProfitSummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET stock summary
router.get('/stock', async (req, res) => {
  try {
    const summary = await db.getStockSummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET profit by product
router.get('/product/profit', async (req, res) => {
  try {
    const sales = await db.getAllSales();
    
    const profitByProduct = {};
    let totalProfit = 0;

    sales.forEach(sale => {
      if (!profitByProduct[sale.product_id]) {
        profitByProduct[sale.product_id] = {
          product_id: sale.product_id,
          product_name: sale.name,
          total_sales: 0,
          total_quantity: 0,
          total_profit: 0
        };
      }
      
      profitByProduct[sale.product_id].total_sales += 1;
      profitByProduct[sale.product_id].total_quantity += sale.quantity;
      profitByProduct[sale.product_id].total_profit += sale.profit;
      totalProfit += sale.profit;
    });

    res.json({
      success: true,
      data: {
        by_product: Object.values(profitByProduct),
        total_profit: totalProfit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET daily profit summary
router.get('/profit/daily', async (req, res) => {
  try {
    const data = await db.getDailyProfit();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
