#!/bin/bash
# Install & Start Script untuk Warung Ali
# Gunakan: bash start.sh

echo "🏪 Warung Ali - Setup & Start"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak terinstall"
    echo "Silahkan download di: https://nodejs.org"
    exit 1
fi

echo "✓ Node.js: $(node --version)"
echo "✓ NPM: $(npm --version)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
fi

# Ask for sample data
echo "Tambahkan sample data untuk testing?"
read -p "Y/n: " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]] || [ -z "$REPLY" ]; then
    echo "🌱 Adding sample data..."
    node backend/seed.js
    echo ""
fi

# Start server
echo "🚀 Starting server..."
echo "📍 Open: http://localhost:3000"
echo ""
npm start
