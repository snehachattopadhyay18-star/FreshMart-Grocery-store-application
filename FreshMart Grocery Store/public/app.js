/**
 * FreshMart Client Application Logic
 * Coordinates UI events, real-time reactive state, and live backend communication
 * Includes 6 unique features:
 * 1. 1-Click Recipe-to-Cart
 * 2. Live Order Tracker with Delivery Partner
 * 3. Budget Basket Builder
 * 4. Express Kolkata Locality Selector
 * 5. Subscribe & Save (5% Off Daily Essentials)
 * 6. Store Manager Admin Portal
 */

(function () {
  // Global State
  let state = {
    products: [],
    freshPicks: [],
    recipes: [],
    localities: [],
    subscriptions: [],
    activeLocality: null,
    cart: { items: [], count: 0, subtotal: 0, deliveryFee: 0, total: 0 },
    wishlist: { productIds: [], items: [], count: 0 },
    currentUser: null,
    currentCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    authMode: 'signup', // 'signup' | 'signin'
    currentSlide: 0,
    slideInterval: null,
    deliveryAddress: null,
    currentBudget: 250,
    budgetItems: [],
    latestOrderId: null
  };

  // ==================== INITIALIZATION ====================
  document.addEventListener('DOMContentLoaded', async () => {
    initLocalAddress();
    initCarousel();
    initEventListeners();
    await checkAuth();
    await loadLocalities();
    await loadCategories();
    await loadFreshPicks();
    await loadRecipes();
    await loadProducts();
    await loadCart();
    await loadWishlist();
  });

  function initLocalAddress() {
    try {
      const saved = localStorage.getItem('fm_saved_address');
      if (saved) {
        state.deliveryAddress = JSON.parse(saved);
        updateDelivPreview();
      }
    } catch (e) {
      console.warn('Failed to parse saved address');
    }
  }

  function initEventListeners() {
    // Search input with debounce
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
      let timeout;
      searchBox.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          state.searchQuery = e.target.value.trim();
          loadProducts();
        }, 250);
      });
    }

    // Sort select
    const sortOption = document.getElementById('sortOption');
    if (sortOption) {
      sortOption.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        loadProducts();
      });
    }

    // Carousel buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ==================== 1. LOCALITIES & EXPRESS DELIVERY ====================
  async function loadLocalities() {
    try {
      const res = await window.API.getLocalities();
      if (res && res.localities) {
        state.localities = res.localities;
        const savedLocId = localStorage.getItem('fm_active_loc') || 'loc-saltlake';
        const loc = state.localities.find(l => l.id === savedLocId) || state.localities[0];
        setLocality(loc);
      }
    } catch (e) {
      console.warn('Failed to load localities:', e);
    }
  }

  function setLocality(loc) {
    state.activeLocality = loc;
    localStorage.setItem('fm_active_loc', loc.id);
    const nameEl = document.getElementById('activeLocalityName');
    const etaEl = document.getElementById('locEtaBadge');
    if (nameEl) nameEl.textContent = `${loc.name} (${loc.pin})`;
    if (etaEl) etaEl.textContent = `${loc.eta} ETA`;
  }

  window.openLocalityModal = function() {
    const modal = document.getElementById('localityModal');
    const list = document.getElementById('localityList');
    if (!modal || !list) return;

    list.innerHTML = state.localities.map(l => {
      const isSel = state.activeLocality && state.activeLocality.id === l.id;
      return `
        <div class="locCard ${isSel ? 'on' : ''}" onclick="selectLocality('${l.id}')">
          <div>
            <b style="display:block;font-size:.95rem">${l.name} <small style="color:var(--mu)">(${l.pin})</small></b>
            <small style="color:var(--mu)">Hub: ${l.hub}</small>
          </div>
          <div style="text-align:right">
            <span class="etaPill"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:inline-block;vertical-align:-1px;margin-right:4px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>${l.eta}</span>
            <div style="font-size:.74rem;color:var(--gd);margin-top:4px">Free delivery > ₹${l.freeDeliveryAbove}</div>
          </div>
        </div>
      `;
    }).join('');

    modal.classList.add('show');
    document.body.classList.add('lock');
  };

  window.closeLocalityModal = function() {
    const modal = document.getElementById('localityModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  window.selectLocality = function(id) {
    const loc = state.localities.find(l => l.id === id);
    if (loc) {
      setLocality(loc);
      showToast(`Delivery area set to ${loc.name} (${loc.eta})`, 'success');
      closeLocalityModal();
    }
  };

  // ==================== 2. 1-CLICK RECIPES-TO-CART ====================
  async function loadRecipes() {
    const grid = document.getElementById('recipeGrid');
    if (!grid) return;

    try {
      const res = await window.API.getRecipes();
      if (res && res.recipes) {
        state.recipes = res.recipes;
        grid.innerHTML = res.recipes.map(r => `
          <div class="recipe-card">
            <div class="recipe-img">
              <span class="recipe-badge">${r.category}</span>
              <img src="${r.image}" alt="${r.name}" loading="lazy">
              <span class="recipe-meta">⏱️ ${r.prepTime} • ${r.servings}</span>
            </div>
            <div class="recipe-body">
              <h3>${r.name}</h3>
              <p>${r.tagline}</p>
              <div class="recipe-ings">
                <h4>Ingredients included:</h4>
                <div class="ing-pills">
                  ${r.ingredients.map(ing => `<span class="ing-pill">✓ ${ing.productName} (${ing.unit})</span>`).join('')}
                </div>
              </div>
              <div class="recipe-foot">
                <span class="recipe-price">₹${r.totalPrice}</span>
                <button class="recipe-btn" onclick="addRecipeKit('${r.id}')">Add All to Cart ➔</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (e) {
      console.warn('Failed to load recipes:', e);
    }
  }

  window.addRecipeKit = async function(recipeId) {
    try {
      const res = await window.API.addRecipeToCart(recipeId);
      await loadCart();
      showToast(res.message || 'Recipe kit added to your cart!', 'success');
      showCart();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  // ==================== 3. BUDGET BASKET BUILDER ====================
  window.openBudgetModal = async function() {
    const modal = document.getElementById('budgetModal');
    if (!modal) return;
    modal.classList.add('show');
    document.body.classList.add('lock');
    await loadBudgetBasket(state.currentBudget);
  };

  window.closeBudgetModal = function() {
    const modal = document.getElementById('budgetModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  window.setBudget = async function(amount) {
    state.currentBudget = amount;
    const btns = document.querySelectorAll('.budgetPresetBtn');
    btns.forEach(b => {
      b.classList.toggle('on', b.textContent.includes(String(amount)));
    });
    await loadBudgetBasket(amount);
  };

  async function loadBudgetBasket(budget) {
    const list = document.getElementById('budgetItemsList');
    const totalEl = document.getElementById('budgetTotal');
    if (!list) return;

    list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--mu)">Calculating optimal basket…</div>';

    try {
      const res = await window.API.buildBudgetBasket(budget, false);
      if (res && res.items) {
        state.budgetItems = res.items;
        if (totalEl) totalEl.textContent = `₹${res.total} (₹${res.savings} saved from ₹${res.budget})`;
        list.innerHTML = res.items.map(i => `
          <div class="budgetItemRow">
            <span>✓ ${i.product.name} (${i.product.unit})</span>
            <b>₹${i.product.price}</b>
          </div>
        `).join('');
      }
    } catch (e) {
      list.innerHTML = `<div style="color:#c0392b">Failed: ${e.message}</div>`;
    }
  }

  window.addBudgetBasketToCart = async function() {
    try {
      await window.API.buildBudgetBasket(state.currentBudget, true);
      await loadCart();
      closeBudgetModal();
      showToast(`Added ₹${state.currentBudget} Budget Basket to your cart!`, 'success');
      showCart();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  // ==================== 4. SUBSCRIBE & SAVE (5% OFF) ====================
  window.openSubscriptionModal = async function(productId) {
    const modal = document.getElementById('subscriptionModal');
    if (!modal) return;
    if (productId) {
      const sel = document.getElementById('subProduct');
      if (sel) sel.value = productId;
    }
    modal.classList.add('show');
    document.body.classList.add('lock');
    await loadSubscriptions();
  };

  window.closeSubscriptionModal = function() {
    const modal = document.getElementById('subscriptionModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  async function loadSubscriptions() {
    const subList = document.getElementById('subList');
    if (!subList) return;
    try {
      const res = await window.API.getSubscriptions();
      const list = res.subscriptions || [];
      state.subscriptions = list;

      if (list.length === 0) {
        subList.innerHTML = `<em>No active recurring subscriptions yet.</em>`;
      } else {
        subList.innerHTML = list.map(s => `
          <div style="display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid var(--ln);border-radius:12px;padding:10px 14px;margin-bottom:8px">
            <div>
              <b style="display:block;color:var(--tx)">${s.productName}</b>
              <small style="color:var(--gd);font-weight:600">₹${s.discountedPrice} (5% off) • ${s.frequency}</small><br>
              <small style="color:var(--mu)">Next: ${s.nextDelivery}</small>
            </div>
            <button onclick="cancelSub('${s.id}')" style="background:#fee;color:#c0392b;border:0;border-radius:8px;padding:5px 10px;font-size:.78rem;cursor:pointer">Cancel</button>
          </div>
        `).join('');
      }
    } catch (e) {
      subList.innerHTML = `<em>Could not load subscriptions.</em>`;
    }
  }

  window.createSubscription = async function() {
    const selProd = document.getElementById('subProduct').value;
    const selFreq = document.getElementById('subFreq').value;
    const selTime = document.getElementById('subTime').value;

    try {
      const res = await window.API.createSubscription(selProd, selFreq, selTime);
      showToast(res.message || 'Subscription created! 5% recurring discount applied', 'success');
      await loadSubscriptions();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  window.cancelSub = async function(id) {
    try {
      await window.API.cancelSubscription(id);
      showToast('Subscription cancelled', 'info');
      await loadSubscriptions();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  // ==================== 5. LIVE ORDER TRACKER ====================
  window.openTrackerModal = async function(orderId) {
    const modal = document.getElementById('trackerModal');
    if (!modal) return;
    modal.classList.add('show');
    document.body.classList.add('lock');

    const targetId = orderId || state.latestOrderId || 'FM-KOL-8921';
    await loadOrderTracking(targetId);
  };

  window.closeTrackerModal = function() {
    const modal = document.getElementById('trackerModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  async function loadOrderTracking(orderId) {
    const idEl = document.getElementById('trOrderId');
    const timelineEl = document.getElementById('trTimeline');
    if (idEl) idEl.textContent = orderId;

    try {
      const res = await window.API.trackOrder(orderId);
      if (res && res.timeline && timelineEl) {
        timelineEl.innerHTML = res.timeline.map((t, idx) => `
          <div class="tStep ${t.completed ? 'on' : ''}">
            <span class="tDot">${t.completed ? '✓' : idx + 1}</span>
            <b>${t.title}</b>
            <small>${t.time}</small>
          </div>
        `).join('');
      }
    } catch (e) {
      console.warn('Track order fallback');
    }
  }

  // ==================== 6. STORE MANAGER ADMIN PORTAL ====================
  let adminOrdersCache = [];
  let adminProductsCache = [];

  window.openAdminModal = async function() {
    const modal = document.getElementById('adminModal');
    if (!modal) return;
    modal.classList.add('show');
    document.body.classList.add('lock');
    await loadAdminDashboard();
  };

  window.closeAdminModal = function() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  window.switchAdminTab = function(tabId) {
    const tabs = document.querySelectorAll('.adminTabBtn');
    const contents = document.querySelectorAll('.adminTabContent');
    tabs.forEach(t => t.classList.toggle('on', t.getAttribute('onclick').includes(tabId)));
    contents.forEach(c => c.classList.toggle('active', c.id === tabId));
  };

  async function loadAdminDashboard() {
    try {
      const res = await window.API.getAdminDashboard();
      if (!res) return;

      const stats = res.stats || {};
      setHtml('admRev', `₹${stats.totalRevenue || 0}`);
      setHtml('admOrders', stats.totalOrders || 0);
      setHtml('admActive', stats.activeOrders || 0);
      setHtml('admStock', `${stats.totalProducts - stats.outOfStockCount} / ${stats.totalProducts}`);

      adminOrdersCache = res.recentOrders || [];
      adminProductsCache = res.products || [];

      renderAdminOrders(adminOrdersCache);
      renderAdminProducts(adminProductsCache);
      renderAdminSubs();
    } catch (e) {
      console.warn('Failed to load admin dashboard:', e);
    }
  }

  function renderAdminOrders(orders) {
    const tbody = document.getElementById('admOrdersBody');
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--mu)">No orders found.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => {
      const itemsSummary = o.items ? o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ') : 'Grocery Items';
      return `
        <tr>
          <td>
            <b style="color:var(--gd)">${o.id}</b><br>
            <small style="color:var(--mu)">${new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
          </td>
          <td>
            <b>${o.customerName}</b> (${o.customerPhone || 'N/A'})<br>
            <small style="color:var(--mu)">${o.shippingAddress}, ${o.city} (${o.pinCode})</small>
          </td>
          <td>
            <b>₹${o.total}</b> (${o.items ? o.items.length : 0} items)<br>
            <small style="color:var(--mu);display:block;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${itemsSummary}">${itemsSummary}</small>
          </td>
          <td>
            <span class="etaPill" style="background:#eaf6ed;color:var(--gd);border-color:#bce5c9">${o.status}</span>
          </td>
          <td>
            <select onchange="updateAdminOrderStatus('${o.id}', this.value)">
              <option value="Order Confirmed" ${o.status === 'Order Confirmed' ? 'selected' : ''}>Order Confirmed</option>
              <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Packing at Hub</option>
              <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
              <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.filterAdminOrders = function() {
    const query = (document.getElementById('admOrderSearch').value || '').toLowerCase();
    const status = document.getElementById('admOrderStatusFilter').value;

    const filtered = adminOrdersCache.filter(o => {
      const matchText = (o.id + ' ' + o.customerName + ' ' + (o.customerPhone || '') + ' ' + o.shippingAddress).toLowerCase().includes(query);
      const matchStatus = status === 'all' || o.status === status;
      return matchText && matchStatus;
    });

    renderAdminOrders(filtered);
  };

  window.updateAdminOrderStatus = async function(orderId, status) {
    try {
      await window.API.updateOrderStatus(orderId, status);
      showToast(`Order ${orderId} status set to "${status}"`, 'success');
      await loadAdminDashboard();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  // Products Tab Management
  function renderAdminProducts(products) {
    const tbody = document.getElementById('admProductsBody');
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--mu)">No matching products.</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <img src="${p.image}" alt="${p.name}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;background:#eee" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23059669%22 stroke-width=%222%22><path d=%22M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z%22/><line x1=%223%22 y1=%226%22 x2=%2221%22 y2=%226%22/><path d=%22M16 10a4 4 0 0 1-8 0%22/></svg>'">
            <div>
              <b>${p.name}</b><br>
              <small style="color:var(--mu)">Unit: ${p.unit}</small>
            </div>
          </div>
        </td>
        <td><span class="tag ${p.category}">${p.category}</span></td>
        <td>
          <input type="number" value="${p.price}" style="width:75px;padding:4px 6px;border:1px solid var(--ln);border-radius:6px;font-weight:700" onchange="updateProductPrice('${p.id}', this.value)">
        </td>
        <td>
          <span class="stockBadge ${p.inStock ? 'in' : 'out'}">${p.inStock ? '● In Stock' : '✕ Out of Stock'}</span>
        </td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="adminBtn sec" style="padding:4px 8px;font-size:.78rem" onclick="toggleProductStock('${p.id}', ${p.inStock})">
              ${p.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
            </button>
            <button class="adminBtn danger" style="padding:4px 8px;font-size:.78rem" onclick="deleteAdminProduct('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.filterAdminProducts = function() {
    const query = (document.getElementById('admProdSearch').value || '').toLowerCase();
    const filtered = adminProductsCache.filter(p => {
      return (p.name + ' ' + p.category).toLowerCase().includes(query);
    });
    renderAdminProducts(filtered);
  };

  window.toggleNewProdForm = function() {
    const form = document.getElementById('newProdForm');
    if (form) form.classList.toggle('show');
  };

  window.submitNewProduct = async function() {
    const name = getVal('npName').trim();
    const category = getVal('npCategory');
    const price = getVal('npPrice');
    const unit = getVal('npUnit').trim();
    const image = getVal('npImage').trim();
    const desc = getVal('npDesc').trim();

    if (!name || !price) {
      showToast('Please enter at least product name and price.', 'error');
      return;
    }

    try {
      const res = await window.API.createProduct({
        name,
        category,
        price: Number(price),
        unit: unit || '1 unit',
        image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        description: desc
      });

      showToast(res.message || 'Product created successfully', 'success');
      toggleNewProdForm();
      // Clear inputs
      setVal('npName', '');
      setVal('npPrice', '');
      setVal('npUnit', '');
      setVal('npImage', '');
      setVal('npDesc', '');

      await loadAdminDashboard();
      await loadProducts(); // Refresh customer catalog
    } catch (e) {
      showToast('Failed to create product: ' + e.message, 'error');
    }
  };

  window.updateProductPrice = async function(productId, newPrice) {
    try {
      await window.API.updateProduct(productId, { price: Number(newPrice) });
      showToast(`Price updated to ₹${newPrice}`, 'success');
      await loadProducts(); // Sync catalog
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  window.toggleProductStock = async function(productId, currentInStock) {
    try {
      await window.API.updateProductStock(productId, !currentInStock);
      showToast(`Stock status updated!`, 'info');
      await loadAdminDashboard();
      await loadProducts(); // Sync catalog
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  window.deleteAdminProduct = async function(productId) {
    if (!confirm('Are you sure you want to remove this product from the grocery catalog?')) return;
    try {
      await window.API.deleteProduct(productId);
      showToast('Product removed from store', 'info');
      await loadAdminDashboard();
      await loadProducts(); // Sync catalog
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  // Subscriptions Tab in Admin
  async function renderAdminSubs() {
    const tbody = document.getElementById('admSubsBody');
    if (!tbody) return;
    try {
      const res = await window.API.getSubscriptions();
      const subs = res.subscriptions || [];
      if (subs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--mu)">No subscriptions active.</td></tr>`;
        return;
      }
      tbody.innerHTML = subs.map(s => `
        <tr>
          <td><b>${s.id}</b></td>
          <td><b>Customer (${s.userId})</b></td>
          <td><b>${s.productName}</b></td>
          <td><span class="etaPill">${s.frequency}</span><br><small style="color:var(--mu)">${s.timeSlot}</small></td>
          <td><b style="color:var(--gd)">₹${s.discountedPrice}</b></td>
          <td>
            <button class="adminBtn danger" style="padding:4px 8px;font-size:.78rem" onclick="cancelSub('${s.id}');loadAdminDashboard();">Cancel</button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#c0392b">Failed to load subscriptions.</td></tr>`;
    }
  }

  // Demo Order Generator for Live Classroom/Examiner Presentation
  window.createDemoOrderForAdmin = async function() {
    try {
      const res = await window.API.placeOrder({
        customerName: 'Ananya Mukherjee',
        customerPhone: '+91 98301 23456',
        shippingAddress: 'Flat 4B, Greenfield Heights, Major Arterial Road',
        city: 'Kolkata',
        pinCode: '700156',
        paymentMethod: 'Cash on Delivery',
        items: [
          { productId: 'prod-apple', name: 'Fresh Apples (Shimla Royal)', price: 160, quantity: 1, unit: '1 kg' },
          { productId: 'prod-milk', name: 'Farm Fresh Toned Milk', price: 60, quantity: 2, unit: '1 litre' },
          { productId: 'prod-bread', name: 'White Sandwich Bread', price: 40, quantity: 1, unit: '1 pack' }
        ]
      });

      if (res && res.order) {
        showToast(`New Live Order #${res.order.id} received for ₹${res.order.total}!`, 'success');
        await loadAdminDashboard();
        switchAdminTab('ordersTab');
      }
    } catch (e) {
      showToast('Error creating demo order: ' + e.message, 'error');
    }
  };

  // ==================== CAROUSEL ====================
  function initCarousel() {
    const track = document.getElementById('track');
    const dotsContainer = document.getElementById('dots');
    if (!track) return;

    const slides = track.querySelectorAll('.slide');
    if (!slides.length) return;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `dot ${i === 0 ? 'on' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    startSlideTimer();

    const hero = document.getElementById('hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => clearInterval(state.slideInterval));
      hero.addEventListener('mouseleave', () => startSlideTimer());
    }
  }

  function startSlideTimer() {
    clearInterval(state.slideInterval);
    state.slideInterval = setInterval(() => {
      nextSlide();
    }, 5500);
  }

  function goToSlide(index) {
    const track = document.getElementById('track');
    if (!track) return;
    const slides = track.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;

    state.currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${state.currentSlide * 100}%)`;

    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === state.currentSlide);
    });

    dots.forEach((d, idx) => {
      d.classList.toggle('on', idx === state.currentSlide);
    });
  }

  function nextSlide() {
    goToSlide(state.currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(state.currentSlide - 1);
  }

  // ==================== CATEGORIES & CHIPS ====================
  async function loadCategories() {
    const chipsContainer = document.getElementById('chips');
    if (!chipsContainer) return;

    try {
      const data = await window.API.getCategories();
      if (data && data.categories) {
        chipsContainer.innerHTML = '';
        data.categories.forEach(cat => {
          const chip = document.createElement('button');
          chip.className = `chip ${state.currentCategory === cat.id ? 'on' : ''}`;
          chip.textContent = `${cat.icon} ${cat.name}`;
          chip.addEventListener('click', () => {
            selectCategory(cat.id);
          });
          chipsContainer.appendChild(chip);
        });
      }
    } catch (e) {
      console.warn('Could not load categories:', e);
    }
  }

  window.goCat = function (catId) {
    selectCategory(catId);
    const shop = document.getElementById('shop');
    if (shop) {
      shop.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function selectCategory(catId) {
    state.currentCategory = catId;
    const chips = document.querySelectorAll('#chips .chip');
    chips.forEach(chip => {
      chip.classList.toggle('on', chip.textContent.includes(catId) || (catId === 'all' && chip.textContent.includes('All')));
    });
    loadProducts();
  }

  // ==================== FRESH PICKS MARQUEE ====================
  async function loadFreshPicks() {
    const mtrack = document.getElementById('mtrack');
    if (!mtrack) return;

    try {
      const data = await window.API.getFreshPicks();
      const picks = data.picks || [];
      state.freshPicks = picks;

      if (picks.length === 0) return;

      const renderPicks = (items) => {
        return items.map(p => `
          <div class="pick" onclick="openProductDetails('${p.id}', event)" style="cursor:pointer">
            <div class="thumb">
              <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'fb\\'><svg width=\\'28\\' height=\\'28\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#059669\\' stroke-width=\\'2\\'><path d=\\'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\\'/><line x1=\\'3\\' y1=\\'6\\' x2=\\'21\\' y2=\\'6\\'/><path d=\\'M16 10a4 4 0 0 1-8 0\\'/></svg></div>'">
            </div>
            <b>${p.name}</b>
            <small>₹${p.price} / ${p.unit}</small>
            <button class="add" onclick="event.stopPropagation();quickAdd('${p.id}')">Add +</button>
          </div>
        `).join('');
      };

      mtrack.innerHTML = `
        <div class="mset">${renderPicks(picks)}</div>
        <div class="mset dup">${renderPicks(picks)}</div>
      `;
    } catch (e) {
      console.warn('Failed to load fresh picks:', e);
    }
  }

  window.quickAdd = async function (id) {
    await changeCart(id, 1);
    showToast('Added to cart', 'success');
  };

  // ==================== PRODUCTS ====================
  async function loadProducts() {
    const container = document.getElementById('productlist');
    const resultCount = document.getElementById('resultCount');
    if (!container) return;

    container.innerHTML = '<div class="empty">Loading fresh groceries…</div>';

    try {
      const data = await window.API.getProducts({
        category: state.currentCategory,
        search: state.searchQuery,
        sort: state.sortBy
      });

      const products = data.products || [];
      state.products = products;

      if (resultCount) {
        resultCount.textContent = `Showing ${products.length} product${products.length === 1 ? '' : 's'}`;
      }

      if (products.length === 0) {
        container.innerHTML = `
          <div class="empty">
            <div style="display:flex;justify-content:center;margin-bottom:12px"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--mu)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
            <h3>No products found</h3>
            <p>Try searching with another keyword or pick a different category.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = products.map(p => renderProductCard(p)).join('');
    } catch (err) {
      container.innerHTML = `<div class="empty">Failed to load products: ${err.message}</div>`;
    }
  }

  function renderProductCard(p) {
    const cartItem = state.cart.items.find(i => i.productId === p.id);
    const inWish = state.wishlist.productIds.includes(p.id);
    const qty = cartItem ? cartItem.quantity : 0;

    const actionHtml = qty > 0 ? `
      <div class="step">
        <button onclick="event.stopPropagation();changeCart('${p.id}', -1)" aria-label="Decrease quantity">−</button>
        <span>${qty}</span>
        <button onclick="event.stopPropagation();changeCart('${p.id}', 1)" aria-label="Increase quantity">+</button>
      </div>
    ` : `
      <button class="add" onclick="event.stopPropagation();changeCart('${p.id}', 1)">Add to Cart</button>
    `;

    const subOption = (p.category === 'Dairy' || p.id === 'prod-bread' || p.id === 'prod-banana') ? `
      <button class="subPrompt" onclick="event.stopPropagation();openSubscriptionModal('${p.id}')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:4px"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Subscribe & Save 5%</button>
    ` : '';

    return `
      <div class="product" id="prod-card-${p.id}" onclick="openProductDetails('${p.id}', event)">
        <button class="wishHeart ${inWish ? 'on' : ''}" onclick="event.stopPropagation();toggleWish('${p.id}')" aria-label="Add to wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${inWish ? '#dc2626' : 'none'}" stroke="${inWish ? '#dc2626' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <div class="thumb">
          <span class="tag ${p.category}">${p.category}</span>
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'fb\\'><svg width=\\'32\\' height=\\'32\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#059669\\' stroke-width=\\'2\\'><path d=\\'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\\'/><line x1=\\'3\\' y1=\\'6\\' x2=\\'21\\' y2=\\'6\\'/><path d=\\'M16 10a4 4 0 0 1-8 0\\'/></svg></div>'">
        </div>
        <div class="info">
          <h3>${p.name}</h3>
          <div class="rating">★★★★★ <span>(${p.rating} / 5)</span></div>
          <div class="pr">
            <span class="price">₹${p.price}</span>
            <span class="unit">/ ${p.unit}</span>
          </div>
          ${actionHtml}
          ${subOption}
        </div>
      </div>
    `;
  }

  // ==================== CART ====================
  async function loadCart() {
    try {
      const data = await window.API.getCart();
      if (data) {
        state.cart = {
          items: data.items || [],
          count: data.count || 0,
          subtotal: data.subtotal || 0,
          deliveryFee: data.deliveryFee || 0,
          total: data.total || 0
        };
        updateCartUI();
      }
    } catch (e) {
      console.warn('Failed to load cart:', e);
    }
  }

  function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalAmount = document.getElementById('totalAmount');
    const drawerCount = document.getElementById('drawerCount');
    const cartTotal = document.getElementById('cartTotal');
    const paymentTotal = document.getElementById('paymentTotal');

    if (cartCount) {
      cartCount.textContent = state.cart.count;
      cartCount.classList.remove('bump');
      void cartCount.offsetWidth;
      cartCount.classList.add('bump');
    }
    if (totalAmount) totalAmount.textContent = state.cart.total;
    if (drawerCount) drawerCount.textContent = state.cart.count;
    if (cartTotal) cartTotal.textContent = state.cart.total;
    if (paymentTotal) paymentTotal.textContent = state.cart.total;

    const cartItems = document.getElementById('cartItems');
    const dFoot = document.getElementById('dFoot');
    if (!cartItems) return;

    if (state.cart.items.length === 0) {
      cartItems.innerHTML = `
        <div class="emptyCart">
          <div style="display:flex;justify-content:center;margin-bottom:12px"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--mu)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
          <p>Your cart is empty</p>
          <small>Add delicious fresh groceries to get started.</small>
        </div>
      `;
      if (dFoot) dFoot.style.display = 'none';
    } else {
      if (dFoot) dFoot.style.display = 'block';
      cartItems.innerHTML = state.cart.items.map(item => {
        const p = item.product || state.products.find(x => x.id === item.productId) || {
          name: 'Grocery Item',
          price: 50,
          unit: '1 unit',
          image: ''
        };
        return `
          <div class="ci">
            <div class="im">
              <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'fb\\'><svg width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#059669\\' stroke-width=\\'2\\'><path d=\\'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\\'/><line x1=\\'3\\' y1=\\'6\\' x2=\\'21\\' y2=\\'6\\'/><path d=\\'M16 10a4 4 0 0 1-8 0\\'/></svg></div>'">
            </div>
            <div class="nm">
              <b>${p.name}</b>
              <small>₹${p.price} / ${p.unit}</small>
              <div class="step">
                <button onclick="changeCart('${item.productId}', -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeCart('${item.productId}', 1)">+</button>
              </div>
            </div>
            <div class="sd">
              <b>₹${p.price * item.quantity}</b>
              <div><button class="rm" onclick="removeItem('${item.productId}')">Remove</button></div>
            </div>
          </div>
        `;
      }).join('');
    }

    state.products.forEach(p => {
      const card = document.getElementById(`prod-card-${p.id}`);
      if (card) {
        const cartItem = state.cart.items.find(i => i.productId === p.id);
        const qty = cartItem ? cartItem.quantity : 0;
        const infoDiv = card.querySelector('.info');
        if (infoDiv) {
          const existingAction = infoDiv.querySelector('.step, .add');
          if (existingAction) {
            const newActionHtml = qty > 0 ? `
              <div class="step">
                <button onclick="event.stopPropagation();changeCart('${p.id}', -1)" aria-label="Decrease quantity">−</button>
                <span>${qty}</span>
                <button onclick="event.stopPropagation();changeCart('${p.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
            ` : `
              <button class="add" onclick="event.stopPropagation();changeCart('${p.id}', 1)">Add to Cart</button>
            `;
            existingAction.outerHTML = newActionHtml;
          }
        }
      }
    });
  }

  window.changeCart = async function (productId, delta) {
    try {
      const res = await window.API.addToCart(productId, delta);
      if (res && res.cart) {
        state.cart = {
          items: res.cart,
          count: res.count,
          subtotal: res.subtotal,
          deliveryFee: res.deliveryFee,
          total: res.total
        };
        updateCartUI();
      } else {
        await loadCart();
      }
    } catch (e) {
      showToast('Error updating cart: ' + e.message, 'error');
    }
  };

  window.removeItem = async function (productId) {
    try {
      await window.API.removeFromCart(productId);
      await loadCart();
      showToast('Item removed from cart', 'info');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  window.showCart = function () {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('lock');
  };

  window.closeCart = function () {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('lock');
  };

  // ==================== WISHLIST ====================
  async function loadWishlist() {
    try {
      const data = await window.API.getWishlist();
      if (data) {
        state.wishlist = {
          productIds: data.productIds || [],
          items: data.items || [],
          count: data.count || 0
        };
        updateWishlistUI();
      }
    } catch (e) {
      console.warn('Failed to load wishlist:', e);
    }
  }

  function updateWishlistUI() {
    const wishCount = document.getElementById('wishCount');
    const wishlistItems = document.getElementById('wishlistItems');
    if (wishCount) wishCount.textContent = state.wishlist.count;

    if (!wishlistItems) return;

    if (state.wishlist.items.length === 0) {
      wishlistItems.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--mu);">
          <div style="display:flex;justify-content:center;margin-bottom:12px"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--mu)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
          <p>Your wishlist is empty</p>
          <small>Tap the heart icon on any product to save it here.</small>
        </div>
      `;
    } else {
      wishlistItems.innerHTML = state.wishlist.items.map(p => `
        <div class="wishItem">
          <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'fb\\'><svg width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#059669\\' stroke-width=\\'2\\'><path d=\\'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\\'/><line x1=\\'3\\' y1=\\'6\\' x2=\\'21\\' y2=\\'6\\'/><path d=\\'M16 10a4 4 0 0 1-8 0\\'/></svg></div>'">
          <div>
            <b>${p.name}</b>
            <small>₹${p.price} / ${p.unit}</small>
            <div class="wishActions">
              <button class="wishAdd" onclick="moveWishToCart('${p.id}')">Add to Cart</button>
              <button class="wishRemove" onclick="toggleWish('${p.id}')">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    state.products.forEach(p => {
      const heart = document.querySelector(`#prod-card-${p.id} .wishHeart`);
      if (heart) {
        const inWish = state.wishlist.productIds.includes(p.id);
        heart.classList.toggle('on', inWish);
        heart.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="${inWish ? '#dc2626' : 'none'}" stroke="${inWish ? '#dc2626' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
      }
    });
  }

  window.toggleWish = async function (productId) {
    try {
      const res = await window.API.toggleWishlist(productId);
      if (res) {
        state.wishlist.productIds = res.productIds || [];
        state.wishlist.items = res.items || [];
        state.wishlist.count = res.count || 0;
        updateWishlistUI();
        showToast(res.inWishlist ? 'Saved to wishlist' : 'Removed from wishlist', 'info');
      }
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  window.moveWishToCart = async function (productId) {
    await changeCart(productId, 1);
    await toggleWish(productId);
    showToast('Moved to cart', 'success');
  };

  window.showWishlist = function () {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('wishlistOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('lock');
  };

  window.closeWishlist = function () {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('wishlistOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('lock');
  };

  // ==================== CHECKOUT & ADDRESS ====================
  window.showPayment = function () {
    closeCart();
    if (state.cart.items.length === 0) {
      showToast('Your cart is empty! Add items first.', 'error');
      return;
    }

    if (!state.deliveryAddress) {
      openAddress();
    } else {
      openPaymentModal();
    }
  };

  function openPaymentModal() {
    updateDelivPreview();
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.add('show');
    document.body.classList.add('lock');
  }

  window.closePayment = function () {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  window.openAddress = function () {
    closePayment();
    const modal = document.getElementById('addressModal');
    const err = document.getElementById('addrError');
    if (err) err.textContent = '';

    if (state.deliveryAddress) {
      const a = state.deliveryAddress;
      setVal('addrName', a.fullName || '');
      setVal('addrPhone', a.phone || '');
      setVal('addrLine', a.addressLine || '');
      setVal('addrLandmark', a.landmark || '');
      setVal('addrCity', a.city || 'Kolkata');
      setVal('addrPin', a.pinCode || '700001');
    } else if (state.currentUser) {
      setVal('addrName', state.currentUser.name || '');
      setVal('addrPhone', state.currentUser.phone || '');
      setVal('addrCity', 'Kolkata');
      setVal('addrPin', '700001');
    }

    if (modal) modal.classList.add('show');
    document.body.classList.add('lock');
  };

  window.closeAddress = function () {
    const modal = document.getElementById('addressModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  window.saveAddress = async function () {
    const err = document.getElementById('addrError');
    const name = getVal('addrName').trim();
    const phone = getVal('addrPhone').trim();
    const line = getVal('addrLine').trim();
    const landmark = getVal('addrLandmark').trim();
    const city = getVal('addrCity').trim();
    const pin = getVal('addrPin').trim();

    if (!name) {
      if (err) err.textContent = 'Please enter your full name.';
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      if (err) err.textContent = 'Please enter a valid 10-digit mobile number.';
      return;
    }
    if (!line) {
      if (err) err.textContent = 'Please enter your street address / apartment.';
      return;
    }
    if (!city) {
      if (err) err.textContent = 'Please enter your city.';
      return;
    }
    const cleanPin = pin.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      if (err) err.textContent = 'Please enter a valid 6-digit PIN code.';
      return;
    }

    const addrData = {
      fullName: name,
      phone: cleanPhone,
      addressLine: line,
      landmark: landmark,
      city: city,
      pinCode: cleanPin
    };

    try {
      await window.API.saveAddress(addrData);
    } catch (e) {
      // Local fallback
    }

    state.deliveryAddress = addrData;
    localStorage.setItem('fm_saved_address', JSON.stringify(addrData));

    closeAddress();
    openPaymentModal();
  };

  function updateDelivPreview() {
    const delivTo = document.getElementById('delivTo');
    if (!delivTo) return;
    if (state.deliveryAddress) {
      const a = state.deliveryAddress;
      delivTo.innerHTML = `
        <strong>Delivering to ${a.fullName} (${a.phone})</strong><br>
        <span>${a.addressLine}, ${a.landmark ? a.landmark + ', ' : ''}${a.city} - ${a.pinCode}</span>
      `;
    } else {
      delivTo.innerHTML = `<em>No address selected yet.</em>`;
    }
  }

  // ==================== ORDER PLACEMENT ====================
  window.placeOrder = async function () {
    if (!state.deliveryAddress) {
      openAddress();
      return;
    }

    try {
      const res = await window.API.placeOrder({
        customerName: state.deliveryAddress.fullName,
        customerPhone: state.deliveryAddress.phone,
        shippingAddress: state.deliveryAddress.addressLine,
        landmark: state.deliveryAddress.landmark,
        city: state.deliveryAddress.city,
        pinCode: state.deliveryAddress.pinCode,
        paymentMethod: 'Cash on Delivery'
      });

      if (res && res.order) {
        state.latestOrderId = res.order.id;
        closePayment();
        showSuccessModal(res.order);
        await loadCart();

        if (typeof window.confetti === 'function') {
          window.confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (e) {
      showToast('Could not place order: ' + e.message, 'error');
    }
  };

  window.otherPayment = function (method) {
    showToast(`Online payment (${method}) simulated! Order will be completed with Cash on Delivery for instant delivery.`, 'info');
    setTimeout(() => {
      placeOrder();
    }, 1200);
  };

  function showSuccessModal(order) {
    const modal = document.getElementById('successModal');
    if (!modal) return;

    setHtml('sId', order.id);
    setHtml('sItems', `${order.items.length} item${order.items.length === 1 ? '' : 's'}`);
    setHtml('sAddr', `${order.shippingAddress}, ${order.city} - ${order.pinCode}`);
    setHtml('sTotal', `₹${order.total}`);

    modal.classList.add('show');
    document.body.classList.add('lock');
  }

  window.closeSuccess = function () {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
    showToast('Thank you for shopping with FreshMart!', 'success');
  };

  // ==================== AUTHENTICATION ====================
  async function checkAuth() {
    try {
      const user = await window.API.getMe();
      if (user) {
        state.currentUser = user;
        updateAuthUI(true);
      } else {
        updateAuthUI(false);
      }
    } catch (e) {
      updateAuthUI(false);
    }
  }

  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function updateAuthUI(isLoggedIn) {
    const greetBox = document.getElementById('greetBox');
    const userName = document.getElementById('userName');
    const userAvatarText = document.getElementById('userAvatarText');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (isLoggedIn && state.currentUser) {
      if (greetBox) greetBox.hidden = false;
      if (userName) userName.textContent = state.currentUser.name;
      if (userAvatarText) userAvatarText.textContent = getInitials(state.currentUser.name);
      if (loginBtn) loginBtn.hidden = true;
      if (logoutBtn) logoutBtn.hidden = false;
    } else {
      if (greetBox) greetBox.hidden = true;
      if (userName) userName.textContent = '';
      if (loginBtn) loginBtn.hidden = false;
      if (logoutBtn) logoutBtn.hidden = true;
    }
  }

  window.openAuth = function (mode = 'signin') {
    state.authMode = mode;
    syncAuthModeUI();
    const page = document.getElementById('authPage');
    const err = document.getElementById('authError');
    if (err) err.textContent = '';
    if (page) page.classList.add('show');
    document.body.classList.add('lock');
  };

  window.closeAuth = function () {
    const page = document.getElementById('authPage');
    if (page) page.classList.remove('show');
    document.body.classList.remove('lock');
  };

  window.switchAuthTab = function (mode) {
    state.authMode = mode;
    syncAuthModeUI();
  };

  window.toggleAuth = function () {
    state.authMode = state.authMode === 'signup' ? 'signin' : 'signup';
    syncAuthModeUI();
  };

  function syncAuthModeUI() {
    const isSignup = state.authMode === 'signup';
    const tabSignin = document.getElementById('authTabSignin');
    const tabSignup = document.getElementById('authTabSignup');
    const nameGroup = document.getElementById('authNameGroup');
    const heading = document.getElementById('authFormHeading');
    const subtitle = document.getElementById('authFormSubtitle');
    const submitText = document.getElementById('authSubmitText');
    const err = document.getElementById('authError');
    if (err) err.textContent = '';

    if (tabSignin) {
      tabSignin.classList.toggle('active', !isSignup);
      tabSignin.setAttribute('aria-selected', !isSignup ? 'true' : 'false');
    }
    if (tabSignup) {
      tabSignup.classList.toggle('active', isSignup);
      tabSignup.setAttribute('aria-selected', isSignup ? 'true' : 'false');
    }

    if (nameGroup) nameGroup.style.display = isSignup ? 'block' : 'none';

    if (heading) {
      heading.textContent = isSignup ? 'Create Your Account' : 'Welcome to FreshMart';
    }
    if (subtitle) {
      subtitle.textContent = isSignup
        ? 'Join thousands of Kolkata families receiving crisp, farm-fresh produce daily.'
        : 'Sign in to access your saved recipe kits, active subscriptions, and express checkout.';
    }
    if (submitText) {
      submitText.textContent = isSignup ? 'Create Account & Start Shopping' : 'Sign In to FreshMart';
    }
  }

  window.quickDemoLogin = async function (email, password) {
    switchAuthTab('signin');
    setVal('authEmail', email);
    setVal('authPassword', password);
    showToast(`Logging in as ${email.split('@')[0]}…`, 'info');
    await submitAuth();
  };

  window.showAuthHelp = function () {
    showToast('Demo Accounts: password is password123 for all seeded demo users.', 'info');
  };

  window.togglePw = function () {
    const pwInput = document.getElementById('authPassword');
    const btn = document.getElementById('pwToggle');
    if (!pwInput || !btn) return;
    if (pwInput.type === 'password') {
      pwInput.type = 'text';
      btn.innerHTML = `<svg id="pwEyeIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
      btn.setAttribute('aria-label', 'Hide password');
    } else {
      pwInput.type = 'password';
      btn.innerHTML = `<svg id="pwEyeIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      btn.setAttribute('aria-label', 'Show password');
    }
  };

  window.submitAuth = async function () {
    const err = document.getElementById('authError');
    const email = getVal('authEmail').trim();
    const pw = getVal('authPassword').trim();
    const name = getVal('authName').trim();
    const submitBtn = document.getElementById('authSubmit');

    if (!email) {
      if (err) err.textContent = 'Please enter your email.';
      return;
    }
    if (!pw || pw.length < 6) {
      if (err) err.textContent = 'Password must be at least 6 characters.';
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    try {
      if (state.authMode === 'signup') {
        const res = await window.API.register(name, email, pw);
        state.currentUser = res.user;
        showToast(`Welcome to FreshMart, ${res.user.name}!`, 'success');
      } else {
        const res = await window.API.login(email, pw);
        state.currentUser = res.user;
        showToast(`Welcome back, ${res.user.name}!`, 'success');
      }

      updateAuthUI(true);
      closeAuth();
      await loadCart();
      await loadWishlist();
    } catch (e) {
      if (err) err.textContent = e.message;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    }
  };

  window.logout = async function () {
    try {
      await window.API.logout();
      state.currentUser = null;
      updateAuthUI(false);
      showToast('Logged out successfully', 'info');
      await loadCart();
      await loadWishlist();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // ==================== TOASTS ====================
  function showToast(msg, type = 'info') {
    const container = document.getElementById('toasts');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
      toast.style.background = '#c0392b';
    } else if (type === 'success') {
      toast.style.background = '#145c33';
    }
    toast.textContent = msg;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==================== USER DASHBOARD & RECEIPTS ====================
  let cachedDashboardData = null;

  window.openUserDashboard = async function () {
    if (!state.currentUser) {
      showToast('Please sign in to access your account & orders.', 'info');
      openAuth('signin');
      return;
    }
    const modal = document.getElementById('dashboardModal');
    if (!modal) return;
    modal.classList.add('show');
    document.body.classList.add('lock');
    await loadUserDashboard();
  };

  window.closeUserDashboard = function () {
    const modal = document.getElementById('dashboardModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  window.switchDashboardTab = function (tab) {
    const tabs = ['orders', 'profile', 'subs'];
    tabs.forEach(t => {
      const btn = document.getElementById(`dashTab${t.charAt(0).toUpperCase() + t.slice(1)}Btn`);
      const pane = document.getElementById(`dashTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (btn) btn.classList.toggle('active', t === tab);
      if (pane) pane.classList.toggle('active', t === tab);
    });
  };

  async function loadUserDashboard() {
    try {
      const data = await window.API.getUserDashboard();
      if (!data) return;
      cachedDashboardData = data;

      // Header & Stats
      const u = data.user || state.currentUser;
      const stats = data.stats || { totalOrders: 0, totalSpent: 0, totalSaved: 0, activeSubscriptions: 0 };

      setHtml('dashAvatar', getInitials(u.name));
      setHtml('dashUserTitle', u.name);
      setHtml('dashUserEmail', u.email);
      setHtml('dashUserPhone', u.phone || 'Phone not set');
      setHtml('dashMemberTier', `★ ${u.tier || 'Fresh Member'} · ${u.activeHub || 'Salt Lake Hub'}`);

      setHtml('dashStatOrders', stats.totalOrders);
      setHtml('dashStatSpent', `₹${stats.totalSpent}`);
      setHtml('dashStatSaved', `₹${stats.totalSaved}`);
      setHtml('dashStatSubs', stats.activeSubscriptions);

      // 1. Orders List
      const ordersList = document.getElementById('dashOrdersList');
      const countBadge = document.getElementById('dashOrdersCountBadge');
      if (countBadge) countBadge.textContent = `${data.orders.length} order${data.orders.length === 1 ? '' : 's'} recorded`;

      if (ordersList) {
        if (data.orders.length === 0) {
          ordersList.innerHTML = `
            <div style="text-align:center;padding:48px 16px;color:#64748b;background:#fff;border-radius:16px;border:1.5px dashed #cbd5e1">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:8px"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <h4 style="margin:0 0 4px;color:#0f172a">No orders placed yet</h4>
              <p style="margin:0 0 12px;font-size:.85rem">Explore fresh produce and pantry staples for 30-min express delivery.</p>
              <button class="dashBtn primary" style="margin:0 auto" onclick="closeUserDashboard();scrollToSection('shop')">Start Shopping</button>
            </div>
          `;
        } else {
          ordersList.innerHTML = data.orders.map(o => {
            const isLive = o.status !== 'Delivered' && o.status !== 'Cancelled';
            const orderDate = new Date(o.createdAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const itemsMiniHtml = o.items.map(item => `
              <div class="dashOrderItemMini" title="${item.productName}">
                <img src="${item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'}" alt="${item.productName}">
                <div>
                  <b style="font-size:.8rem;display:block;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.productName}</b>
                  <small style="color:#64748b">${item.quantity} × ₹${item.price}</small>
                </div>
              </div>
            `).join('');

            return `
              <div class="dashOrderCard">
                <div class="dashOrderHeader">
                  <div>
                    <span class="dashOrderNum">Order #${o.id}</span>
                    <span style="font-size:.78rem;color:#64748b;margin-left:8px">Placed ${orderDate}</span>
                  </div>
                  <div>
                    <span class="dashOrderStatus ${isLive ? 'live' : 'done'}">
                      ${isLive ? '<span class="pulse-dot" style="display:inline-block;width:6px;height:6px;background:#059669;border-radius:50%;margin-right:4px"></span>' : '✓ '}
                      ${o.status}
                    </span>
                  </div>
                </div>

                <div class="dashOrderItemsGrid">
                  ${itemsMiniHtml}
                </div>

                <div class="dashOrderFooter">
                  <div class="dashOrderTotal">
                    <small style="display:block;font-size:.72rem;color:#64748b;text-transform:uppercase">Amount (${o.paymentMethod || 'COD'})</small>
                    <b>₹${o.total}</b>
                  </div>
                  <div class="dashOrderActions">
                    <button class="dashBtn secondary" onclick="openReceiptModal('${o.id}')">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      View Invoice
                    </button>
                    ${isLive ? `
                      <button class="dashBtn primary" onclick="closeUserDashboard();openTrackerModal('${o.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        Track Delivery
                      </button>
                    ` : ''}
                    <button class="dashBtn secondary" onclick="reorderOrderItems('${o.id}')">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                      Reorder All
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // 2. Profile Form Inputs
      if (u.savedAddress) {
        setVal('profFullName', u.savedAddress.fullName || u.name || '');
        setVal('profPhone', u.savedAddress.phone || u.phone || '');
        setVal('profAddress', u.savedAddress.addressLine || '');
        setVal('profLandmark', u.savedAddress.landmark || '');
        setVal('profPin', u.savedAddress.pinCode || '');
      } else {
        setVal('profFullName', u.name || '');
        setVal('profPhone', u.phone || '');
        setVal('profAddress', '');
        setVal('profLandmark', '');
        setVal('profPin', '700064');
      }

      // 3. Subscriptions Tab
      const subsList = document.getElementById('dashSubsList');
      if (subsList) {
        if (data.subscriptions.length === 0) {
          subsList.innerHTML = `
            <div style="text-align:center;padding:48px 16px;color:#64748b;background:#fff;border-radius:16px;border:1.5px dashed #cbd5e1">
              <h4 style="margin:0 0 4px;color:#0f172a">No recurring subscriptions yet</h4>
              <p style="margin:0 0 12px;font-size:.85rem">Subscribe to daily milk, fresh curd, or bakery bread for an automatic 5% discount.</p>
              <button class="dashBtn primary" style="margin:0 auto" onclick="closeUserDashboard();openSubscriptionModal()">Browse Subscribable Items</button>
            </div>
          `;
        } else {
          subsList.innerHTML = data.subscriptions.map(s => `
            <div class="dashOrderCard" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px">
              <div style="display:flex;align-items:center;gap:14px">
                <div style="width:44px;height:44px;border-radius:12px;background:#ecfdf5;display:flex;align-items:center;justify-content:center;color:#059669">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <b style="font-size:.95rem;color:#0f172a">${s.productName}</b>
                  <div style="font-size:.8rem;color:#64748b;margin-top:2px">
                    Frequency: <strong>${s.frequency}</strong> · Preferred Slot: <strong>${s.timeSlot}</strong>
                  </div>
                  <small style="color:#059669;font-weight:600">Next Scheduled Dispatch: ${s.nextDelivery}</small>
                </div>
              </div>
              <div style="text-align:right;display:flex;align-items:center;gap:12px">
                <div>
                  <b style="font-size:1.1rem;color:#059669">₹${s.discountedPrice}</b>
                  <small style="display:block;text-decoration:line-through;color:#94a3b8">₹${s.price}</small>
                </div>
                <button class="dashBtn secondary" style="color:#c0392b" onclick="cancelDashboardSub('${s.id}')">Cancel</button>
              </div>
            </div>
          `).join('');
        }
      }
    } catch (e) {
      console.warn('Dashboard load error:', e);
    }
  }

  window.saveUserProfile = async function (e) {
    if (e) e.preventDefault();
    const btn = document.getElementById('profSaveBtn');
    if (btn) btn.disabled = true;

    try {
      const fullName = getVal('profFullName');
      const phone = getVal('profPhone');
      const addressLine = getVal('profAddress');
      const landmark = getVal('profLandmark');
      const pinCode = getVal('profPin');

      const res = await window.API.updateProfile({
        name: fullName,
        phone,
        savedAddress: {
          fullName,
          phone,
          addressLine,
          landmark,
          city: 'Kolkata',
          pinCode
        }
      });

      if (res && res.user) {
        state.currentUser = res.user;
        updateAuthUI(true);
        showToast('Profile and delivery address updated successfully!', 'success');
        await loadUserDashboard();
      }
    } catch (err) {
      showToast('Failed to save profile: ' + err.message, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  window.reorderOrderItems = async function (orderId) {
    try {
      const res = await window.API.reorderOrder(orderId);
      await loadCart();
      showToast(res.message || 'Items added to your cart!', 'success');
      closeUserDashboard();
      showCart();
    } catch (e) {
      showToast('Reorder failed: ' + e.message, 'error');
    }
  };

  window.cancelDashboardSub = async function (subId) {
    try {
      await window.API.cancelSubscription(subId);
      showToast('Subscription cancelled', 'info');
      await loadUserDashboard();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  // Receipt Generator
  window.openReceiptModal = async function (orderId) {
    const modal = document.getElementById('receiptModal');
    if (!modal) return;
    modal.classList.add('show');
    document.body.classList.add('lock');

    try {
      const res = await window.API.getOrderById(orderId);
      const o = res && res.order ? res.order : (cachedDashboardData?.orders?.find(x => x.id === orderId));
      if (!o) return;

      setHtml('rcOrderId', `Order #${o.id}`);
      setHtml('rcOrderDate', new Date(o.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }));
      setHtml('rcCustomerName', o.customerName || state.currentUser?.name || 'Customer');
      setHtml('rcAddress', `${o.shippingAddress}, ${o.locality || 'Kolkata'} ${o.pinCode}`);
      setHtml('rcPaymentMethod', `${o.paymentMethod || 'Cash on Delivery'} (${o.paymentStatus || 'Verified'})`);
      setHtml('rcSubtotal', `₹${o.subtotal || o.total}`);
      setHtml('rcDeliveryFee', o.deliveryFee > 0 ? `₹${o.deliveryFee}` : 'FREE');
      setHtml('rcGrandTotal', `₹${o.total}`);

      const tbody = document.getElementById('rcItemsBody');
      if (tbody) {
        tbody.innerHTML = o.items.map(i => `
          <tr>
            <td>
              <b>${i.productName || i.name}</b><br>
              <small style="color:#64748b">${i.unit || '1 unit'}</small>
            </td>
            <td style="text-align:center">${i.quantity}</td>
            <td style="text-align:right">₹${i.price * i.quantity}</td>
          </tr>
        `).join('');
      }
    } catch (e) {
      console.warn('Failed to load receipt:', e);
    }
  };

  // ==================== PRODUCT DETAILS & REVIEWS ====================
  let currentModalData = null;
  let modalQtyCount = 1;
  let modalReviewRating = 5;

  window.openProductDetails = async function (productId, event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('productModal');
    const content = document.getElementById('pmModalContent');
    if (!modal || !content) return;

    modal.classList.add('show');
    document.body.classList.add('lock');
    content.innerHTML = `
      <div style="padding:60px 20px;text-align:center;grid-column:1/-1;color:#64748b">
        <div style="display:inline-block;width:36px;height:36px;border:3px solid #e2e8f0;border-top-color:#059669;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:12px"></div>
        <p style="margin:0;font-size:.92rem;font-weight:600">Loading fresh product details & verified reviews…</p>
      </div>
    `;

    try {
      const data = await window.API.getProductById(productId);
      if (!data || !data.product) {
        throw new Error('Product not found');
      }
      currentModalData = data;

      // Determine initial quantity: if already in cart, use cart qty, else default 1
      const cartItem = state.cart.items.find(i => i.productId === data.product.id);
      modalQtyCount = cartItem && cartItem.quantity > 0 ? cartItem.quantity : 1;
      modalReviewRating = 5;

      renderProductModalView();
    } catch (err) {
      content.innerHTML = `
        <div style="padding:40px;text-align:center;grid-column:1/-1;color:#dc2626">
          <h3>Failed to load product details</h3>
          <p style="color:#64748b">${err.message || 'Please check your connection and try again.'}</p>
          <button class="dashBtn primary" style="margin:16px auto" onclick="closeProductModal()">Close</button>
        </div>
      `;
    }
  };

  window.closeProductModal = function () {
    const modal = document.getElementById('productModal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('lock');
  };

  window.changeModalQtyDelta = function (delta) {
    modalQtyCount = Math.max(1, modalQtyCount + delta);
    const qtyVal = document.getElementById('pmQtyVal');
    if (qtyVal) qtyVal.textContent = modalQtyCount;
  };

  window.addModalProductToCart = async function () {
    if (!currentModalData || !currentModalData.product) return;
    const p = currentModalData.product;
    try {
      const cartItem = state.cart.items.find(i => i.productId === p.id);
      const currentQty = cartItem ? cartItem.quantity : 0;
      const delta = modalQtyCount - currentQty;

      if (delta !== 0) {
        await changeCart(p.id, delta);
      }
      showToast(`Added ${modalQtyCount} × ${p.name} to cart!`, 'success');
      const addBtn = document.getElementById('pmAddBtnText');
      if (addBtn) addBtn.textContent = `Update in Cart (${modalQtyCount})`;
    } catch (e) {
      showToast('Error updating cart: ' + e.message, 'error');
    }
  };

  window.toggleModalProductWish = async function () {
    if (!currentModalData || !currentModalData.product) return;
    const p = currentModalData.product;
    await toggleWish(p.id);
    const inWish = state.wishlist.productIds.includes(p.id);
    const wishBtn = document.getElementById('pmWishBtn');
    if (wishBtn) {
      wishBtn.classList.toggle('active', inWish);
      wishBtn.setAttribute('aria-label', inWish ? 'Remove from wishlist' : 'Add to wishlist');
      const svg = wishBtn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', inWish ? '#dc2626' : 'none');
        svg.setAttribute('stroke', inWish ? '#dc2626' : 'currentColor');
      }
    }
  };

  window.subscribeFromModal = function () {
    if (!currentModalData || !currentModalData.product) return;
    const pid = currentModalData.product.id;
    closeProductModal();
    openSubscriptionModal(pid);
  };

  window.toggleReviewForm = function () {
    const formBox = document.getElementById('pmReviewFormBox');
    if (formBox) {
      formBox.classList.toggle('show');
      if (formBox.classList.contains('show')) {
        formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  window.setModalReviewRating = function (stars) {
    modalReviewRating = stars;
    const starsContainer = document.getElementById('pmStarPicker');
    if (starsContainer) {
      const starSpans = starsContainer.querySelectorAll('.star');
      starSpans.forEach((s, idx) => {
        s.classList.toggle('on', idx < stars);
      });
    }
    const label = document.getElementById('pmStarRatingLabel');
    if (label) {
      const labels = {
        5: '5.0 - Exceptional Freshness & Quality',
        4: '4.0 - Very Good Product',
        3: '3.0 - Average Quality',
        2: '2.0 - Below Expectations',
        1: '1.0 - Poor'
      };
      label.textContent = labels[stars] || `${stars} Stars`;
    }
  };

  window.submitModalReview = async function (e) {
    if (e) e.preventDefault();
    if (!currentModalData || !currentModalData.product) return;

    const nameInput = document.getElementById('pmRevName');
    const locInput = document.getElementById('pmRevLocality');
    const commentInput = document.getElementById('pmRevComment');
    const submitBtn = document.getElementById('pmRevSubmitBtn');

    const authorName = (nameInput?.value || '').trim() || (state.currentUser?.name || 'Verified Customer');
    const locality = (locInput?.value || '').trim() || (state.activeLocality?.name?.split('(')[0]?.trim() || 'Salt Lake, Kolkata');
    const comment = (commentInput?.value || '').trim();

    if (!comment) {
      showToast('Please write a brief comment describing your experience.', 'error');
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await window.API.addProductReview(currentModalData.product.id, {
        authorName,
        locality,
        rating: modalReviewRating,
        comment
      });

      if (res && res.reviews) {
        showToast('Thank you! Your verified review has been published.', 'success');
        // Refresh product details modal
        await openProductDetails(currentModalData.product.id);
        // Refresh customer catalog to sync rating badge
        await loadProducts();
      }
    } catch (err) {
      showToast('Failed to post review: ' + err.message, 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  function renderProductModalView() {
    const content = document.getElementById('pmModalContent');
    if (!content || !currentModalData) return;

    const { product: p, reviews, stats, specs } = currentModalData;
    const inWish = state.wishlist.productIds.includes(p.id);
    const cartItem = state.cart.items.find(i => i.productId === p.id);
    const currentCartQty = cartItem ? cartItem.quantity : 0;
    const defaultAuthor = state.currentUser?.name || '';
    const defaultLoc = state.activeLocality?.name?.split('(')[0]?.trim() || 'Kolkata';

    const starsHtml = '★★★★★'.split('').map((star, idx) => {
      const rating = Number(stats.averageRating) || 5;
      const isFilled = idx < Math.round(rating);
      return `<span style="color:${isFilled ? '#f59e0b' : '#cbd5e1'}">★</span>`;
    }).join('');

    const discountPill = p.originalPrice && p.originalPrice > p.price ? `
      <span class="pmDiscountBadge">Save ${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%</span>
    ` : '';

    const originalPriceHtml = p.originalPrice && p.originalPrice > p.price ? `
      <span class="pmOriginalPrice">₹${p.originalPrice}</span>
    ` : '';

    const subscribable = (p.category === 'Dairy' || p.id === 'prod-bread' || p.id === 'prod-banana');

    // Rating breakdown bars
    const barsHtml = [5, 4, 3, 2, 1].map(star => {
      const pct = stats.percentages ? stats.percentages[star] || 0 : 0;
      const count = stats.distribution ? stats.distribution[star] || 0 : 0;
      return `
        <div class="pmBarRow">
          <span style="width:24px">${star}★</span>
          <div class="pmBarTrack">
            <div class="pmBarFill" style="width:${pct}%"></div>
          </div>
          <span style="width:34px;text-align:right;color:#64748b">${pct}%</span>
        </div>
      `;
    }).join('');

    // Reviews list
    const reviewsHtml = reviews.length === 0 ? `
      <div style="text-align:center;padding:24px;color:#64748b;background:#f8fafc;border-radius:14px">
        No customer reviews yet. Be the first to review this product!
      </div>
    ` : reviews.map(r => {
      const initials = (r.authorName || 'VC').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const rStars = '★★★★★'.split('').map((s, i) => `<span style="color:${i < r.rating ? '#f59e0b' : '#cbd5e1'}">★</span>`).join('');
      return `
        <div class="pmReviewCard">
          <div class="pmReviewTop">
            <div class="pmReviewAuthor">
              <div class="pmAuthorAvatar">${initials}</div>
              <div>
                <div class="pmAuthorName">${r.authorName}</div>
                <div class="pmAuthorLoc">${r.locality || 'Kolkata'} · <span style="color:#94a3b8">${r.date || 'Recent'}</span></div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="font-size:1rem">${rStars}</div>
              ${r.verifiedBuyer ? `<span class="pmVerifiedBadge">✓ Verified Buyer</span>` : ''}
            </div>
          </div>
          <p class="pmReviewComment">${r.comment}</p>
        </div>
      `;
    }).join('');

    content.innerHTML = `
      <!-- LEFT COLUMN: MEDIA & FARM SPECIFICATIONS -->
      <div class="pmLeft">
        <div class="pmMediaBox">
          <span class="pmCatBadge">${p.category}</span>
          <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'">
          <div class="pmFreshTag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Farm Inspected · Chilled Transit</span>
          </div>
        </div>

        <!-- SPECS GRID -->
        <div class="pmSpecsGrid">
          <div class="pmSpecItem">
            <small>FARM ORIGIN</small>
            <b>${p.origin || specs.origin || 'Kolkata Agri Hub'}</b>
          </div>
          <div class="pmSpecItem">
            <small>SHELF LIFE</small>
            <b>${p.shelfLife || specs.shelfLife || 'Consume within 3-4 days'}</b>
          </div>
          <div class="pmSpecItem">
            <small>STORAGE GUIDE</small>
            <b>${specs.storage || 'Store in cool dry pantry'}</b>
          </div>
          <div class="pmSpecItem">
            <small>PACKAGING UNIT</small>
            <b>${p.unit || 'Standard retail pack'}</b>
          </div>
        </div>

        <!-- NUTRITIONAL PROFILE -->
        <div class="pmNutritionCard">
          <div class="pmNutritionHeader">
            <span>Nutritional Highlights</span>
            <small style="font-weight:normal;color:#047857">Per 100g serving</small>
          </div>
          <div class="pmNutriPills">
            <span class="pmNutriPill">🔥 Calories: ${specs.nutrition?.calories || '65 kcal'}</span>
            <span class="pmNutriPill">🌾 Carbs: ${specs.nutrition?.carbs || '14g'}</span>
            <span class="pmNutriPill">💪 Protein: ${specs.nutrition?.protein || '2.5g'}</span>
            <span class="pmNutriPill">✨ ${specs.nutrition?.vitamins || 'Rich in vitamins & dietary fiber'}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: DETAILS, PRICING, CART & REVIEWS -->
      <div class="pmRight">
        <div>
          <div class="pmHeaderTop">
            <div>
              <h2 class="pmTitle" id="pmModalHeading">${p.name}</h2>
              <div class="pmOriginRow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Sourced from <strong>${p.origin || 'Bengal Farm Cluster'}</strong></span>
                <span>•</span>
                <span>Dispatch: <strong>${state.activeLocality?.eta || '20-25 mins'}</strong></span>
              </div>
            </div>
            <span class="pmStockBadge ${p.inStock ? 'in' : 'out'}">
              ${p.inStock ? '● In Stock' : '✕ Out of Stock'}
            </span>
          </div>

          <div class="pmPricingRow">
            <span class="pmCurrentPrice">₹${p.price}</span>
            ${originalPriceHtml}
            ${discountPill}
            <span class="pmUnitText">/ ${p.unit}</span>
          </div>
        </div>

        <p class="pmDesc">${p.description}</p>

        <!-- CART & QUANTITY ACTION BAR -->
        <div class="pmActionsCard">
          <div class="pmCartRow">
            <div class="pmQtyControls">
              <button class="pmQtyBtn" onclick="changeModalQtyDelta(-1)" aria-label="Decrease quantity">−</button>
              <span class="pmQtyValue" id="pmQtyVal">${modalQtyCount}</span>
              <button class="pmQtyBtn" onclick="changeModalQtyDelta(1)" aria-label="Increase quantity">+</button>
            </div>

            <button class="pmAddBtn" onclick="addModalProductToCart()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span id="pmAddBtnText">${currentCartQty > 0 ? `Update in Cart (${modalQtyCount})` : 'Add to Grocery Cart'}</span>
            </button>

            <button class="pmWishBtn ${inWish ? 'active' : ''}" id="pmWishBtn" onclick="toggleModalProductWish()" aria-label="${inWish ? 'Remove from wishlist' : 'Add to wishlist'}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${inWish ? '#dc2626' : 'none'}" stroke="${inWish ? '#dc2626' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>

          ${subscribable ? `
            <div class="pmSubBanner">
              <span><strong>Recurring Breakfast Delivery:</strong> Get this fresh every morning or alternate day.</span>
              <button class="pmSubLink" onclick="subscribeFromModal()">Subscribe & Save 5%</button>
            </div>
          ` : ''}
        </div>

        <!-- RATINGS & REVIEWS SECTION -->
        <div class="pmReviewsSection">
          <div class="pmReviewsHeader">
            <div>
              <h3 class="pmReviewsTitle">Customer Ratings & Reviews</h3>
              <div style="font-size:.82rem;color:#64748b;margin-top:2px">Verified feedback from genuine Kolkata households</div>
            </div>
            <button class="dashBtn primary" onclick="toggleReviewForm()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Write a Review
            </button>
          </div>

          <!-- SUMMARY SCORE & BREAKDOWN BARS -->
          <div class="pmRatingsBox">
            <div style="text-align:center">
              <div class="pmScoreBig">${stats.averageRating || '4.8'}</div>
              <div class="pmStarsRow">${starsHtml}</div>
              <div class="pmTotalCount">${stats.totalReviews || reviews.length} verified ratings</div>
            </div>

            <div class="pmBars">
              ${barsHtml}
            </div>
          </div>

          <!-- WRITE REVIEW FORM (COLLAPSIBLE) -->
          <form id="pmReviewFormBox" class="pmWriteReviewBox" onsubmit="submitModalReview(event)">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <b style="font-size:.95rem;color:#0f172a">Share your product experience</b>
              <button type="button" style="border:none;background:transparent;cursor:pointer;color:#64748b;font-size:1.1rem" onclick="toggleReviewForm()">✕</button>
            </div>

            <div>
              <label style="display:block;font-size:.8rem;font-weight:600;color:#334155;margin-bottom:6px">Your Star Rating</label>
              <div class="starPicker" id="pmStarPicker">
                <span class="star on" onclick="setModalReviewRating(1)">★</span>
                <span class="star on" onclick="setModalReviewRating(2)">★</span>
                <span class="star on" onclick="setModalReviewRating(3)">★</span>
                <span class="star on" onclick="setModalReviewRating(4)">★</span>
                <span class="star on" onclick="setModalReviewRating(5)">★</span>
              </div>
              <small id="pmStarRatingLabel" style="display:block;margin-top:4px;font-size:.76rem;color:#059669;font-weight:600">5.0 - Exceptional Freshness & Quality</small>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div>
                <label style="display:block;font-size:.8rem;font-weight:600;color:#334155;margin-bottom:6px">Your Name</label>
                <input type="text" id="pmRevName" class="adminInput" value="${defaultAuthor}" placeholder="e.g. Debabrata Roy" required>
              </div>
              <div>
                <label style="display:block;font-size:.8rem;font-weight:600;color:#334155;margin-bottom:6px">Kolkata Locality</label>
                <input type="text" id="pmRevLocality" class="adminInput" value="${defaultLoc}" placeholder="e.g. Salt Lake, Sector 2" required>
              </div>
            </div>

            <div>
              <label style="display:block;font-size:.8rem;font-weight:600;color:#334155;margin-bottom:6px">Your Review & Comments</label>
              <textarea id="pmRevComment" class="adminInput" rows="3" placeholder="Tell us about the freshness, packing, aroma, taste, or doorstep delivery speed…" required style="resize:vertical"></textarea>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button type="button" class="dashBtn secondary" onclick="toggleReviewForm()">Cancel</button>
              <button type="submit" class="dashBtn primary" id="pmRevSubmitBtn">Publish Review</button>
            </div>
          </form>

          <!-- REVIEWS LIST -->
          <div class="pmReviewList">
            ${reviewsHtml}
          </div>
        </div>
      </div>
    `;
  }

  function closeAllModals() {
    closeAuth();
    closeCart();
    closeWishlist();
    closeAddress();
    closePayment();
    closeSuccess();
    closeLocalityModal();
    closeBudgetModal();
    closeSubscriptionModal();
    closeTrackerModal();
    closeAdminModal();
    closeUserDashboard();
    closeReceiptModal();
    closeProductModal();
  }

  // Helpers
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
})();
