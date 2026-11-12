/**
 * FreshMart Backend API Client
 * Provides seamless integration between frontend UI and Express server API routes
 */

(function () {
  const API_BASE = '/api';

  // Get or initialize persistent session ID for guest carts
  function getSessionId() {
    let sid = localStorage.getItem('fm_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('fm_session_id', sid);
    }
    return sid;
  }

  // Get authorization token if user is signed in
  function getToken() {
    return localStorage.getItem('fm_token') || '';
  }

  async function request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'x-session-id': getSessionId(),
      ...(options.headers || {})
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `API error: ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`[API] Error on ${endpoint}:`, err);
      throw err;
    }
  }

  window.API = {
    // Products
    async getProducts(params = {}) {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.set('category', params.category);
      if (params.search) query.set('search', params.search);
      if (params.sort && params.sort !== 'default') query.set('sort', params.sort);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/products${qs}`);
    },

    async getProductById(id) {
      return request(`/products/${encodeURIComponent(id)}`);
    },

    async addProductReview(id, reviewData) {
      return request(`/products/${encodeURIComponent(id)}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
    },

    async getFreshPicks() {
      return request('/picks');
    },

    async getCategories() {
      return request('/categories');
    },

    // Authentication
    async register(name, email, password, phone = '') {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone })
      });
      if (res.token) {
        localStorage.setItem('fm_token', res.token);
        localStorage.setItem('fm_user', JSON.stringify(res.user));
      }
      return res;
    },

    async login(email, password) {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.token) {
        localStorage.setItem('fm_token', res.token);
        localStorage.setItem('fm_user', JSON.stringify(res.user));
      }
      return res;
    },

    async getMe() {
      if (!getToken()) return null;
      try {
        const res = await request('/auth/me');
        if (res.user) {
          localStorage.setItem('fm_user', JSON.stringify(res.user));
          return res.user;
        }
      } catch (e) {
        localStorage.removeItem('fm_token');
        localStorage.removeItem('fm_user');
      }
      return null;
    },

    async logout() {
      try {
        await request('/auth/logout', { method: 'POST' });
      } catch (e) {
        // Ignore logout network errors
      }
      localStorage.removeItem('fm_token');
      localStorage.removeItem('fm_user');
      return true;
    },

    async updateProfile(profileData) {
      const res = await request('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      if (res.user) {
        localStorage.setItem('fm_user', JSON.stringify(res.user));
      }
      return res;
    },

    async getUserDashboard() {
      return request('/user/dashboard');
    },

    // Cart
    async getCart() {
      return request('/cart');
    },

    async addToCart(productId, quantity = 1) {
      return request('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
      });
    },

    async setCartQuantity(productId, quantity) {
      return request('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, setExact: true })
      });
    },

    async removeFromCart(productId) {
      return request(`/cart/${encodeURIComponent(productId)}`, {
        method: 'DELETE'
      });
    },

    async clearCart() {
      return request('/cart', {
        method: 'DELETE'
      });
    },

    // Wishlist
    async getWishlist() {
      return request('/wishlist');
    },

    async toggleWishlist(productId) {
      return request('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
    },

    // Delivery Address
    async saveAddress(addressData) {
      return request('/address', {
        method: 'POST',
        body: JSON.stringify(addressData)
      });
    },

    // Orders
    async placeOrder(orderData) {
      return request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    },

    async getOrders() {
      return request('/orders');
    },

    async getOrderById(id) {
      return request(`/orders/${encodeURIComponent(id)}`);
    },

    async trackOrder(orderId) {
      return request(`/orders/${encodeURIComponent(orderId)}/track`);
    },

    async reorderOrder(orderId) {
      return request(`/orders/${encodeURIComponent(orderId)}/reorder`, {
        method: 'POST'
      });
    },

    // 1-Click Recipe-to-Cart
    async getRecipes() {
      return request('/recipes');
    },

    async addRecipeToCart(recipeId) {
      return request(`/recipes/${encodeURIComponent(recipeId)}/add-to-cart`, {
        method: 'POST'
      });
    },

    // Localities & Express ETA
    async getLocalities() {
      return request('/localities');
    },

    // Budget Basket Builder
    async buildBudgetBasket(budget, autoAdd = false) {
      return request('/budget-basket', {
        method: 'POST',
        body: JSON.stringify({ budget, autoAdd })
      });
    },

    // Subscriptions
    async getSubscriptions() {
      return request('/subscriptions');
    },

    async createSubscription(productId, frequency, timeSlot) {
      return request('/subscriptions', {
        method: 'POST',
        body: JSON.stringify({ productId, frequency, timeSlot })
      });
    },

    async cancelSubscription(id) {
      return request(`/subscriptions/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    },

    // Admin Portal
    async getAdminDashboard() {
      return request('/admin/dashboard');
    },

    async updateOrderStatus(orderId, status) {
      return request(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    },

    async updateProductStock(productId, inStock) {
      return request(`/admin/products/${encodeURIComponent(productId)}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ inStock })
      });
    },

    async createProduct(productData) {
      return request('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    },

    async updateProduct(productId, productData) {
      return request(`/admin/products/${encodeURIComponent(productId)}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    },

    async deleteProduct(productId) {
      return request(`/admin/products/${encodeURIComponent(productId)}`, {
        method: 'DELETE'
      });
    }
  };

  // Provide mock alias for compatibility if referenced as api.mock.js
  window.MockAPI = window.API;
})();
