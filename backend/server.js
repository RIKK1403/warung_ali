const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await db.initDatabaseWithSampleData();
    console.log('Database initialized successfully');

    // Routes (setelah database siap)
    app.use('/api/products', productRoutes);
    app.use('/api/sales', salesRoutes);
    app.use('/api/reports', reportRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', database: 'connected' });
    });

    // Serve index.html for all non-API routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/index.html'));
    });

    // Error handling
    app.use((err, req, res, next) => {
      console.error('Server error:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    });

    app.listen(PORT, () => {
      console.log(`Warung Ali server running on http://localhost:${PORT}`);
      console.log(`Database file: ${path.join(__dirname, 'warung.db')}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();
