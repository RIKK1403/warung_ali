// API Base URL
const API_URL = '/api';

// ========== Utility Functions ==========

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const mainContent = document.querySelector('.main-content');
  mainContent.insertBefore(alertDiv, mainContent.firstChild);
  
  setTimeout(() => alertDiv.remove(), 3000);
}

// ========== Mobile Menu Toggle ==========
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

function closeMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.remove('active');
  }
}

// ========== Navigation Functions ==========

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected section
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('active');
  }

  // Add active class to corresponding nav link
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionNames = {
    'products': 'kelola barang',
    'sales': 'catat penjualan',
    'reports': 'laporan'
  };
  const searchText = sectionNames[sectionId] || sectionId;
  
  navLinks.forEach(link => {
    if (link.textContent.toLowerCase().includes(searchText)) {
      link.classList.add('active');
    }
  });
}

function showDashboard() {
  // Dashboard is disabled, redirect ke laporan
  showReports();
}

function showProducts() {
  showSection('products');
  closeMobileMenu();
  loadProducts();
}

function showSales() {
  showSection('sales');
  closeMobileMenu();
  loadProducts();
  loadSalesHistory();
}

function showReports() {
  showSection('reports');
  closeMobileMenu();
  loadReports();
}

// ========== Dashboard Functions ==========

async function loadDashboardData() {
  try {
    // Load profit summary
    const profitRes = await fetch(`${API_URL}/reports/profit`);
    const profitData = await profitRes.json();

    // Load stock summary
    const stockRes = await fetch(`${API_URL}/reports/stock`);
    const stockData = await stockRes.json();

    // Load all products
    const productsRes = await fetch(`${API_URL}/products`);
    const productsData = await productsRes.json();

    // Load all sales
    const salesRes = await fetch(`${API_URL}/sales`);
    const salesData = await salesRes.json();

    // Update dashboard cards
    if (profitData.success) {
      const profit = profitData.data;
      document.getElementById('totalSales').textContent = profit.total_sales || 0;
      document.getElementById('totalRevenue').textContent = formatCurrency(profit.total_revenue || 0);
      document.getElementById('totalProfit').textContent = formatCurrency(profit.total_profit || 0);
    }

    if (productsData.success) {
      document.getElementById('totalProducts').textContent = productsData.data.length;
      
      let totalStock = 0;
      let stockValue = 0;
      productsData.data.forEach(product => {
        totalStock += product.stock || 0;
        const qtyPerBox = product.quantity_per_box || 1;
        const pricePerUnit = product.purchase_price / qtyPerBox;
        stockValue += ((product.stock || 0) * pricePerUnit);
      });
      document.getElementById('totalStock').textContent = totalStock;
      document.getElementById('stockValue').textContent = formatCurrency(stockValue);
    }

    // Load recent sales
    if (salesData.success) {
      const recentSales = salesData.data.slice(0, 5);
      const tbody = document.getElementById('recentSalesTable');
      tbody.innerHTML = '';

      if (recentSales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Belum ada penjualan</td></tr>';
      } else {
        recentSales.forEach(sale => {
          const row = tbody.insertRow();
          row.innerHTML = `
            <td>${sale.name}</td>
            <td>${sale.quantity}</td>
            <td>${formatCurrency(sale.price)}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td style="color: #27ae60; font-weight: bold;">${formatCurrency(sale.profit)}</td>
            <td>${formatDate(sale.sale_date)}</td>
          `;
        });
      }
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showAlert('Gagal memuat data dashboard', 'error');
  }
}

// ========== Products Functions ==========

let allSaleProducts = [];

async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();

    if (data.success) {
      // save product list for filter
      allSaleProducts = data.data;

      // Update products table
      const tbody = document.getElementById('productsTable');
      tbody.innerHTML = '';

      if (data.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Tidak ada barang</td></tr>';
      } else {
        data.data.forEach(product => {
          const qtyPerBox = product.quantity_per_box || 1;
          const pricePerUnit = product.purchase_price / qtyPerBox;
          const margin = product.selling_price - pricePerUnit;
          const marginPercent = ((margin / pricePerUnit) * 100).toFixed(1);
          const stockValue = product.stock * pricePerUnit;
          const boxCount = Math.floor(product.stock / qtyPerBox);
          const pcsRemaining = product.stock % qtyPerBox;

          const row = tbody.insertRow();
          row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category || '-'}</td>
            <td>${qtyPerBox} pcs</td>
            <td>${formatCurrency(product.purchase_price)}</td>
            <td>${formatCurrency(pricePerUnit)}</td>
            <td>${formatCurrency(product.selling_price)}</td>
            <td>${formatCurrency(margin)} (${marginPercent}%)</td>
            <td><strong>${product.stock}</strong> <span style="color: #7f8c8d; font-size: 12px;">(${boxCount} box + ${pcsRemaining} pcs)</span></td>
            <td>${formatCurrency(stockValue)}</td>
            <td>
              <button class="btn btn-small btn-primary" onclick="editProduct(${product.id})">Edit</button>
              <button class="btn btn-small btn-danger" onclick="deleteProduct(${product.id})">Hapus</button>
            </td>
          `;
        });
      }

      // Update product select for sales
      const select = document.getElementById('saleProduct');
      const searchInput = document.getElementById('saleSearch');
      select.innerHTML = '<option value="">-- Pilih Barang --</option>';
      const dataList = document.getElementById('saleDatalist');
      dataList.innerHTML = '';

      data.data.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        const qtyPerBox = product.quantity_per_box || 1;
        const pricePerUnit = product.purchase_price / qtyPerBox;
        const boxCount = Math.floor(product.stock / qtyPerBox);
        const pcsRemaining = product.stock % qtyPerBox;
        option.textContent = `${product.name} (${product.stock} pcs)`;
        option.dataset.price = product.selling_price;
        option.dataset.purchasePrice = pricePerUnit;
        option.dataset.quantityPerBox = qtyPerBox;
        select.appendChild(option);

        const dataOption = document.createElement('option');
        dataOption.value = product.name;
        dataList.appendChild(dataOption);
      });
    }
  } catch (error) {
    console.error('Error loading products:', error);
    showAlert('Gagal memuat data barang', 'error');
  }
}

function filterSaleProducts() {
  const query = document.getElementById('saleSearch').value.toLowerCase();
  const select = document.getElementById('saleProduct');

  select.innerHTML = '<option value="">-- Pilih Barang --</option>';
  const filtered = allSaleProducts.filter(product => product.name.toLowerCase().includes(query));

  filtered.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      const qtyPerBox = product.quantity_per_box || 1;
      const pricePerUnit = product.purchase_price / qtyPerBox;
      option.textContent = `${product.name} (${product.stock} pcs)`;
      option.dataset.price = product.selling_price;
      option.dataset.purchasePrice = pricePerUnit;
      option.dataset.quantityPerBox = qtyPerBox;
      select.appendChild(option);
    });

  // Jika hanya satu hasil filter, auto-select
  if (filtered.length === 1) {
    select.value = filtered[0].id;
  }
}

function showAddProductForm() {
  document.getElementById('productForm').style.display = 'block';
  document.getElementById('formTitle').textContent = 'Tambah Barang Baru';
  document.getElementById('saveProductId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productCategory').value = '';
  document.getElementById('purchaseMode').value = 'box';
  document.querySelector('label[for="purchasePrice"]').textContent = 'Harga Modal/Box (Rp) *';
  document.querySelector('label[for="quantityPerBox"]').textContent = 'Qty per Box *';
  document.getElementById('quantityPerBox').value = '1';
  document.getElementById('quantityPerBox').disabled = false;
  document.getElementById('purchasePrice').value = '';
  document.getElementById('pricePerUnit').value = '';
  document.getElementById('sellingPrice').value = '';
  document.getElementById('productStock').value = '0';
  document.getElementById('productName').focus();
}

function hideProductForm() {
  document.getElementById('productForm').style.display = 'none';
  document.getElementById('saveProductId').value = '';
}

async function handleProductSubmit(event) {
  event.preventDefault();

  const saveProductId = document.getElementById('saveProductId').value;
  const name = document.getElementById('productName').value;
  const category = document.getElementById('productCategory').value;
  const purchaseMode = document.getElementById('purchaseMode').value;
  let quantityPerBox = parseInt(document.getElementById('quantityPerBox').value) || 1;
  let purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
  const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
  const stock = parseInt(document.getElementById('productStock').value) || 0;

  if (purchaseMode === 'unit') {
    quantityPerBox = 1;
  }

  const pricePerUnit = purchaseMode === 'unit' ? purchasePrice : purchasePrice / quantityPerBox;

  if (pricePerUnit >= sellingPrice) {
    showAlert('Harga jual harus lebih besar dari harga modal per satuan', 'error');
    return;
  }

  try {
    const isUpdate = saveProductId;
    const url = isUpdate ? `${API_URL}/products/${saveProductId}` : `${API_URL}/products`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        category,
        purchase_price: purchasePrice,
        selling_price: sellingPrice,
        quantity_per_box: quantityPerBox,
        stock
      })
    });

    const data = await res.json();

    if (data.success) {
      showAlert(isUpdate ? 'Barang berhasil diperbarui' : 'Barang berhasil ditambahkan', 'success');
      hideProductForm();
      loadProducts();
      loadSalesHistory();
      loadReports();
    } else {
      showAlert(data.message || 'Gagal menyimpan barang', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Terjadi kesalahan', 'error');
  }
}

function editProduct(id) {
  // Load product data and show form
  fetch(`${API_URL}/products/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const product = data.data;
        document.getElementById('saveProductId').value = id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category || '';
        document.getElementById('purchaseMode').value = 'box';
        document.getElementById('quantityPerBox').value = product.quantity_per_box || 1;
        document.getElementById('purchasePrice').value = product.purchase_price;
        document.getElementById('sellingPrice').value = product.selling_price;
        document.getElementById('pricePerUnit').value = (product.purchase_price / (product.quantity_per_box || 1)).toFixed(0);
        
        document.getElementById('productForm').style.display = 'block';
        document.getElementById('formTitle').textContent = 'Edit Barang';
        document.getElementById('productName').focus();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showAlert('Gagal memuat data barang', 'error');
    });
}

async function deleteProduct(id) {
  if (!confirm('Yakin hapus barang ini?')) return;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (data.success) {
      showAlert('Barang berhasil dihapus', 'success');
      loadProducts();
    } else {
      showAlert(data.message || 'Gagal menghapus barang', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Terjadi kesalahan', 'error');
  }
}

function calculatePricePerUnit() {
  const purchaseMode = document.getElementById('purchaseMode').value;
  const quantityPerBox = parseInt(document.getElementById('quantityPerBox').value) || 1;
  const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;

  let pricePerUnit = 0;
  if (purchaseMode === 'unit') {
    pricePerUnit = purchasePrice;
  } else {
    if (quantityPerBox > 0) {
      pricePerUnit = purchasePrice / quantityPerBox;
    }
  }

  if (purchasePrice > 0) {
    document.getElementById('pricePerUnit').value = pricePerUnit.toFixed(0);
  } else {
    document.getElementById('pricePerUnit').value = '';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Product form calculations
  const quantityPerBox = document.getElementById('quantityPerBox');
  const purchasePrice = document.getElementById('purchasePrice');
  const purchaseMode = document.getElementById('purchaseMode');

  if (purchaseMode) {
    purchaseMode.addEventListener('change', () => {
      if (purchaseMode.value === 'unit') {
        document.querySelector('label[for="purchasePrice"]').textContent = 'Harga Modal/Satuan (Rp) *';
        document.querySelector('label[for="quantityPerBox"]').textContent = 'Qty per Box (otomatis 1)';
        quantityPerBox.value = 1;
        quantityPerBox.disabled = true;
      } else {
        document.querySelector('label[for="purchasePrice"]').textContent = 'Harga Modal/Box (Rp) *';
        document.querySelector('label[for="quantityPerBox"]').textContent = 'Qty per Box *';
        quantityPerBox.disabled = false;
      }
      calculatePricePerUnit();
    });
  }

  if (quantityPerBox && purchasePrice) {
    quantityPerBox.addEventListener('input', calculatePricePerUnit);
    purchasePrice.addEventListener('input', calculatePricePerUnit);
  }
  
  // Sales calculations
  const saleProduct = document.getElementById('saleProduct');
  const saleQuantity = document.getElementById('saleQuantity');

  if (saleProduct && saleQuantity) {
    saleProduct.addEventListener('change', updateSaleCalculation);
    saleQuantity.addEventListener('input', updateSaleCalculation);
  }
});

// Global cart array
let saleCart = [];

function updateSaleCalculation() {
  const select = document.getElementById('saleProduct');
  const quantity = parseInt(document.getElementById('saleQuantity').value) || 0;

  if (select.value && quantity > 0) {
    const option = select.options[select.selectedIndex];
    const price = parseFloat(option.dataset.price);
    document.getElementById('salePrice').value = formatCurrency(price);
  } else {
    document.getElementById('salePrice').value = '';
  }
}

function addItemToCart() {
  const select = document.getElementById('saleProduct');
  const quantity = parseInt(document.getElementById('saleQuantity').value) || 0;

  if (!select.value || !quantity || quantity <= 0) {
    showAlert('Pilih barang dan masukkan jumlah', 'error');
    return;
  }

  const option = select.options[select.selectedIndex];
  const productId = select.value;
  const productName = option.textContent.split('(')[0].trim();
  const price = parseFloat(option.dataset.price);
  const purchasePrice = parseFloat(option.dataset.purchasePrice);
  const stock = parseInt(option.text.match(/\d+/)) || 0;

  if (quantity > stock) {
    showAlert(`Stok tidak cukup! Tersedia: ${stock}`, 'error');
    return;
  }

  // Check if product already in cart
  const existingItem = saleCart.find(item => item.product_id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    saleCart.push({
      product_id: productId,
      product_name: productName,
      quantity: quantity,
      price: price,
      purchase_price: purchasePrice,
      total: price * quantity,
      cost: purchasePrice * quantity,
      profit: (price * quantity) - (purchasePrice * quantity)
    });
  }

  updateCartDisplay();
  document.getElementById('saleProduct').value = '';
  document.getElementById('saleQuantity').value = '';
  document.getElementById('salePrice').value = '';
  select.focus();
}

function removeItemFromCart(index) {
  saleCart.splice(index, 1);
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartBody = document.getElementById('cartBody');
  const emptyCart = document.getElementById('emptyCart');

  if (saleCart.length === 0) {
    cartBody.innerHTML = '<tr id="emptyCart"><td colspan="7" style="text-align: center; color: #999;">Belum ada item</td></tr>';
    document.getElementById('submitBtn').disabled = false; // tetap aktif untuk pembelian 1 item langsung
    document.getElementById('cartTotalSale').textContent = formatCurrency(0);
    document.getElementById('cartTotalCost').textContent = formatCurrency(0);
    document.getElementById('cartTotalProfit').textContent = formatCurrency(0);
    resetPaymentFields();
    return;
  }

  cartBody.innerHTML = '';
  let totalSale = 0, totalCost = 0, totalProfit = 0;

  saleCart.forEach((item, index) => {
    totalSale += item.total;
    totalCost += item.cost;
    totalProfit += item.profit;

    const row = cartBody.insertRow();
    row.innerHTML = `
      <td>${item.product_name}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${formatCurrency(item.total)}</td>
      <td>${formatCurrency(item.cost)}</td>
      <td style="color: #27ae60; font-weight: bold;">${formatCurrency(item.profit)}</td>
      <td><button type="button" class="btn btn-small btn-danger" onclick="removeItemFromCart(${index})">Hapus</button></td>
    `;
  });

  document.getElementById('submitBtn').disabled = false;
  document.getElementById('cartTotalSale').textContent = formatCurrency(totalSale);
  document.getElementById('cartTotalCost').textContent = formatCurrency(totalCost);
  document.getElementById('cartTotalProfit').textContent = formatCurrency(totalProfit);
  
  // Update kembalian jika ada uang pembeli
  calculateChange();
}

function calculateChange() {
  const totalSaleText = document.getElementById('cartTotalSale').textContent;
  const totalSale = parseInt(totalSaleText.replace(/\D/g, '')) || 0;
  const buyerMoney = parseInt(document.getElementById('buyerMoney').value) || 0;
  const changeAmount = buyerMoney - totalSale;
  
  const changeInput = document.getElementById('changeAmount');
  changeInput.value = changeAmount;
  
  // Warna berubah jika ada kekurangan atau kembalian
  if (changeAmount < 0) {
    changeInput.style.color = '#e74c3c';
    changeInput.style.fontWeight = 'bold';
  } else if (changeAmount > 0) {
    changeInput.style.color = '#27ae60';
    changeInput.style.fontWeight = 'bold';
  } else {
    changeInput.style.color = '#2c3e50';
    changeInput.style.fontWeight = 'normal';
  }
}

function resetPaymentFields() {
  document.getElementById('buyerMoney').value = '';
  document.getElementById('changeAmount').value = '';
  document.getElementById('changeAmount').style.color = '#2c3e50';
  document.getElementById('changeAmount').style.fontWeight = 'normal';
}

async function handleSaleSubmit(event) {
  event.preventDefault();

  const productId = document.getElementById('saleProduct').value;
  const quantity = parseInt(document.getElementById('saleQuantity').value) || 0;

  if (productId && quantity > 0) {
    const option = document.getElementById('saleProduct').selectedOptions[0];
    const productName = option.textContent.split('(')[0].trim();
    const price = parseFloat(option.dataset.price);
    const purchasePrice = parseFloat(option.dataset.purchasePrice);

    const existingItem = saleCart.find(item => item.product_id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
      existingItem.cost = existingItem.purchase_price * existingItem.quantity;
      existingItem.profit = existingItem.total - existingItem.cost;
    } else {
      saleCart.push({
        product_id: productId,
        product_name: productName,
        quantity: quantity,
        price: price,
        purchase_price: purchasePrice,
        total: price * quantity,
        cost: purchasePrice * quantity,
        profit: (price * quantity) - (purchasePrice * quantity)
      });
    }
  }

  if (saleCart.length === 0) {
    showAlert('Pilih barang dan masukkan jumlah penjualan', 'error');
    return;
  }

  // Validasi pembayaran
  const totalSaleText = document.getElementById('cartTotalSale').textContent;
  const totalSale = parseInt(totalSaleText.replace(/\D/g, '')) || 0;
  const buyerMoney = parseInt(document.getElementById('buyerMoney').value) || 0;
  const changeAmount = buyerMoney - totalSale;

  if (buyerMoney === 0) {
    showAlert('Masukkan nominal uang pembeli', 'error');
    document.getElementById('buyerMoney').focus();
    return;
  }

  if (changeAmount < 0) {
    showAlert(`Uang pembeli kurang! Kekurangan: ${formatCurrency(Math.abs(changeAmount))}`, 'error');
    document.getElementById('buyerMoney').focus();
    return;
  }

  updateCartDisplay();

  try {
    // Submit cart sales
    for (const item of saleCart) {
      const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: parseInt(item.product_id),
          quantity: item.quantity
        })
      });

      const data = await res.json();
      if (!data.success) {
        showAlert(`Gagal mencatat ${item.product_name}: ${data.message}`, 'error');
        return;
      }
    }

    showAlert(`Penjualan berhasil dicatat! (${saleCart.length} item)`, 'success');
    saleCart = [];
    resetSaleForm();
    loadSalesHistory();
    loadReports();
  } catch (error) {
    console.error('Error:', error);
    showAlert('Terjadi kesalahan', 'error');
  }
}

function resetSaleForm() {
  saleCart = [];
  document.getElementById('saleProduct').value = '';
  document.getElementById('saleQuantity').value = '';
  document.getElementById('salePrice').value = '';
  updateCartDisplay();
  resetPaymentFields();
  document.getElementById('submitBtn').disabled = false; // tetap bisa klik Catat Penjualan
}

async function clearSalesHistory() {
  if (!confirm('Hapus semua riwayat penjualan? Aksi ini tidak bisa dibatalkan.')) return;

  try {
    const res = await fetch(`${API_URL}/sales`, {
      method: 'DELETE'
    });
    const data = await res.json();

    if (data.success) {
      showAlert(data.message, 'success');
      loadSalesHistory();
      loadReports();
    } else {
      showAlert(data.message || 'Gagal menghapus riwayat penjualan', 'error');
    }
  } catch (error) {
    console.error('Error clearing sales:', error);
    showAlert('Terjadi kesalahan saat menghapus riwayat', 'error');
  }
}

async function clearNegativeSalesHistory() {
  if (!confirm('Hapus hanya transaksi dengan keuntungan negatif?')) return;

  try {
    const res = await fetch(`${API_URL}/sales/negative`, {
      method: 'DELETE'
    });
    const data = await res.json();

    if (data.success) {
      showAlert(data.message, 'success');
      loadSalesHistory();
      loadReports();
    } else {
      showAlert(data.message || 'Gagal menghapus transaksi negatif', 'error');
    }
  } catch (error) {
    console.error('Error clearing negative sales:', error);
    showAlert('Terjadi kesalahan saat menghapus transaksi negatif', 'error');
  }
}

async function clearAllStoreData() {
  if (!confirm('Hapus semua data produk + penjualan? Akan kosong total DB.')) return;

  try {
    const res = await fetch(`${API_URL}/sales/all`, {
      method: 'DELETE'
    });
    const data = await res.json();

    if (data.success) {
      showAlert(data.message, 'success');
      loadProducts();
      loadSalesHistory();
      loadReports();
    } else {
      showAlert(data.message || 'Gagal menghapus semua data', 'error');
    }
  } catch (error) {
    console.error('Error clearing all data:', error);
    showAlert('Terjadi kesalahan saat menghapus semua data', 'error');
  }
}

async function loadSalesHistory() {
  try {
    const res = await fetch(`${API_URL}/sales`);
    const data = await res.json();

    if (data.success) {
      const tbody = document.getElementById('salesTable');
      tbody.innerHTML = '';

      if (data.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Belum ada penjualan</td></tr>';
      } else {
        data.data.forEach(sale => {
          const unitPurchasePrice = parseFloat(sale.unit_purchase_price) || (parseFloat(sale.box_purchase_price) / (parseFloat(sale.quantity_per_box) || 1));
          const cost = unitPurchasePrice * sale.quantity;
          const row = tbody.insertRow();
          row.innerHTML = `
            <td>${sale.name}</td>
            <td>${sale.quantity}</td>
            <td>${formatCurrency(sale.price)}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${formatCurrency(cost)}</td>
            <td style="color: #27ae60; font-weight: bold;">${formatCurrency(sale.profit)}</td>
            <td>${formatDate(sale.sale_date)}</td>
          `;
        });
      }
    }
  } catch (error) {
    console.error('Error loading sales:', error);
    showAlert('Gagal memuat riwayat penjualan', 'error');
  }
}

// ========== Reports Functions ==========

async function loadReports() {
  try {
    console.log('Starting loadReports...');
    
    // Load profit summary
    const profitRes = await fetch(`${API_URL}/reports/profit`);
    if (!profitRes.ok) {
      throw new Error(`Profit API failed: ${profitRes.status}`);
    }
    const profitData = await profitRes.json();
    console.log('Profit data:', profitData);

    // Load product profit
    const productRes = await fetch(`${API_URL}/reports/product/profit`);
    if (!productRes.ok) {
      throw new Error(`Product profit API failed: ${productRes.status}`);
    }
    const productData = await productRes.json();
    console.log('Product data:', productData);

    // Load stock summary
    const stockRes = await fetch(`${API_URL}/reports/stock`);
    if (!stockRes.ok) {
      throw new Error(`Stock API failed: ${stockRes.status}`);
    }
    const stockData = await stockRes.json();
    console.log('Stock data:', stockData);

    // Update profit report
    if (profitData.success) {
      const profit = profitData.data;
      document.getElementById('reportTotalSales').textContent = profit.total_sales || 0;
      document.getElementById('reportTotalRevenue').textContent = formatCurrency(profit.total_revenue || 0);
      document.getElementById('reportTotalProfit').textContent = formatCurrency(profit.total_profit || 0);
      document.getElementById('reportAvgProfit').textContent = formatCurrency(profit.avg_profit || 0);
      console.log('Updated profit report');
    }

    // Update top products
    if (productData.success) {
      const topProducts = productData.data.by_product
        .sort((a, b) => b.total_profit - a.total_profit)
        .slice(0, 10);

      const tbody = document.getElementById('topProductsTable');
      if (!tbody) {
        throw new Error('topProductsTable element not found');
      }
      tbody.innerHTML = '';

      if (topProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Belum ada data penjualan</td></tr>';
      } else {
        topProducts.forEach(product => {
          const row = tbody.insertRow();
          row.innerHTML = `
            <td>${product.product_name}</td>
            <td>${product.total_quantity}</td>
            <td>${product.total_sales}</td>
            <td style="color: #27ae60; font-weight: bold;">${formatCurrency(product.total_profit)}</td>
          `;
        });
      }
      console.log('Updated top products');
    }

    // Load daily profit report
    const dailyRes = await fetch(`${API_URL}/reports/profit/daily`);
    if (!dailyRes.ok) {
      throw new Error(`Daily profit API failed: ${dailyRes.status}`);
    }
    const dailyData = await dailyRes.json();
    console.log('Daily data:', dailyData);

    // Update daily profit report
    if (dailyData.success) {
      const tbody = document.getElementById('dailyProfitTable');
      if (!tbody) {
        throw new Error('dailyProfitTable element not found');
      }
      tbody.innerHTML = '';

      if (dailyData.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Belum ada data penjualan</td></tr>';
      } else {
        dailyData.data.forEach(day => {
          const row = tbody.insertRow();
          row.innerHTML = `
            <td>${day.date}</td>
            <td>${day.total_transactions}</td>
            <td>${formatCurrency(day.total_revenue)}</td>
            <td style="color: #27ae60; font-weight: bold;">${formatCurrency(day.total_profit)}</td>
          `;
        });
      }
      console.log('Updated daily profit');
    }

    // Update stock report
    if (stockData.success) {
      const tbody = document.getElementById('stockReportTable');
      if (!tbody) {
        throw new Error('stockReportTable element not found');
      }
      tbody.innerHTML = '';

      if (stockData.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Tidak ada data stok</td></tr>';
      } else {
        stockData.data.forEach(stock => {
          let statusClass = 'status-warning';
          let statusText = 'Rendah';

          if (stock.stock > 20) {
            statusClass = 'status-good';
            statusText = 'Baik';
          } else if (stock.stock === 0) {
            statusClass = 'status-danger';
            statusText = 'Habis';
          }

          const row = tbody.insertRow();
          row.innerHTML = `
            <td>${stock.name}</td>
            <td>${stock.category || '-'}</td>
            <td>${stock.stock}</td>
            <td>${formatCurrency(stock.total_value)}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
          `;
        });
      }
      console.log('Updated stock report');
    }
    
    console.log('loadReports completed successfully');
  } catch (error) {
    console.error('Error loading reports:', error);
    showAlert('Gagal memuat laporan: ' + error.message, 'error');
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', function() {
  showSales();
});
