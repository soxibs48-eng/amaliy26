/**
 * Crisp Store - Shopping Cart & Wishlist State Engine
 * Handles LocalStorage persistence, drawer interactions, and pricing calculations
 */

const CrispCart = {
  STORAGE_KEY: 'crisp_cart_items_v1',
  WISHLIST_KEY: 'crisp_wishlist_items_v1',
  PROMO_KEY: 'crisp_applied_promo',
  FREE_SHIPPING_THRESHOLD: 75.00,

  items: [],
  wishlist: [],
  appliedPromo: null,

  init() {
    this.loadCart();
    this.loadWishlist();
    this.updateCounters();
    this.renderCartDrawer();
    this.renderWishlistDrawer();
    this.bindEvents();
  },

  loadCart() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      this.items = data ? JSON.parse(data) : [
        // Pre-populate with two sample items so user immediately sees crisp cart interface
        {
          id: 1,
          productId: 1,
          name: "Floral Print Summer Slip Dress",
          price: 68.00,
          color: "Vanilla Floral",
          size: "S",
          quantity: 1,
          image: "assets/images/prod-1.jpg"
        },
        {
          id: 9,
          productId: 9,
          name: "Handwoven Straw Boater Hat",
          price: 49.00,
          color: "Natural Wheat",
          size: "One Size",
          quantity: 1,
          image: "assets/images/prod-9.jpg"
        }
      ];
      const promo = localStorage.getItem(this.PROMO_KEY);
      if (promo) this.appliedPromo = JSON.parse(promo);
    } catch (e) {
      this.items = [];
    }
  },

  saveCart() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    if (this.appliedPromo) {
      localStorage.setItem(this.PROMO_KEY, JSON.stringify(this.appliedPromo));
    } else {
      localStorage.removeItem(this.PROMO_KEY);
    }
    this.updateCounters();
    this.renderCartDrawer();
  },

  loadWishlist() {
    try {
      const data = localStorage.getItem(this.WISHLIST_KEY);
      this.wishlist = data ? JSON.parse(data) : [2, 6];
    } catch (e) {
      this.wishlist = [];
    }
  },

  saveWishlist() {
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(this.wishlist));
    this.updateCounters();
    this.renderWishlistDrawer();
    this.updateHeartIcons();
  },

  addItem(productId, size = "M", color = null, quantity = 1) {
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;
    if (!product) return;

    const chosenColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Standard");
    const chosenSize = size || (product.sizes && product.sizes[0] ? product.sizes[0] : "One Size");

    // Look for exact match in cart
    const existingIndex = this.items.findIndex(
      item => item.productId === product.id && item.size === chosenSize && item.color === chosenColor
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        color: chosenColor,
        size: chosenSize,
        quantity: quantity,
        image: product.image
      });
    }

    this.saveCart();
    this.showToast(`"${product.name}" added to your bag`, "bag");
    this.openCart();
  },

  removeItem(cartItemId) {
    this.items = this.items.filter(item => item.id !== cartItemId);
    this.saveCart();
    this.showToast("Item removed from bag");
  },

  updateQuantity(cartItemId, delta) {
    const item = this.items.find(i => i.id === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(cartItemId);
    } else {
      this.saveCart();
    }
  },

  toggleWishlist(productId) {
    const pId = parseInt(productId, 10);
    const index = this.wishlist.indexOf(pId);
    const product = typeof getProductById === 'function' ? getProductById(pId) : null;
    const name = product ? product.name : "Item";

    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast(`"${name}" removed from wishlist`);
    } else {
      this.wishlist.push(pId);
      this.showToast(`"${name}" saved to wishlist`, "heart");
    }
    this.saveWishlist();
  },

  isWishlisted(productId) {
    return this.wishlist.includes(parseInt(productId, 10));
  },

  applyPromo(code) {
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed === 'CRISP20' || trimmed === 'CRISP') {
      this.appliedPromo = { code: 'CRISP20', discountPercent: 20 };
      this.saveCart();
      this.showToast("Promo code CRISP20 applied (20% OFF)!", "check");
      return { success: true, message: "20% discount applied!" };
    } else {
      this.showToast("Invalid promo code. Try 'CRISP20'", "error");
      return { success: false, message: "Invalid promo code" };
    }
  },

  removePromo() {
    this.appliedPromo = null;
    this.saveCart();
    this.showToast("Promo code removed");
  },

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getDiscount() {
    if (!this.appliedPromo) return 0;
    return (this.getSubtotal() * this.appliedPromo.discountPercent) / 100;
  },

  getShippingCost() {
    if (this.items.length === 0) return 0;
    return this.getSubtotal() >= this.FREE_SHIPPING_THRESHOLD ? 0 : 9.00;
  },

  getTotal() {
    const sub = this.getSubtotal();
    const discount = this.getDiscount();
    const shipping = this.getShippingCost();
    return Math.max(0, sub - discount + shipping);
  },

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  updateCounters() {
    const count = this.getItemCount();
    document.querySelectorAll('.js-cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    const wishCount = this.wishlist.length;
    document.querySelectorAll('.js-wishlist-count').forEach(el => {
      el.textContent = wishCount;
      el.style.display = wishCount > 0 ? 'inline-flex' : 'none';
    });
  },

  updateHeartIcons() {
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const pId = parseInt(btn.getAttribute('data-wishlist-id'), 10);
      if (this.isWishlisted(pId)) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
      } else {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-label', 'Add to wishlist');
      }
    });
  },

  renderCartDrawer() {
    const container = document.getElementById('cartDrawerItems');
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h4>Your Bag is Empty</h4>
          <p>Discover our Summer 2026 Collection and find pieces designed to inspire.</p>
          <a href="shop.html" class="btn btn-primary" onclick="CrispCart.closeCart()">Start Shopping</a>
        </div>
      `;
    } else {
      container.innerHTML = this.items.map(item => `
        <div class="cart-drawer-item" data-cart-id="${item.id}">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-head">
              <h5 class="cart-item-title">${item.name}</h5>
              <button class="cart-item-remove" onclick="CrispCart.removeItem(${item.id})" title="Remove item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="cart-item-meta">
              <span>Size: <strong>${item.size}</strong></span>
              <span class="meta-dot">•</span>
              <span>Color: <strong>${item.color}</strong></span>
            </div>
            <div class="cart-item-foot">
              <div class="quantity-stepper">
                <button type="button" onclick="CrispCart.updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="CrispCart.updateQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
              </div>
              <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Update Shipping threshold indicator
    const subtotal = this.getSubtotal();
    const threshold = this.FREE_SHIPPING_THRESHOLD;
    const progressEl = document.getElementById('cartShippingProgress');
    const msgEl = document.getElementById('cartShippingMsg');

    if (progressEl && msgEl) {
      if (subtotal >= threshold) {
        progressEl.style.width = '100%';
        progressEl.classList.add('is-unlocked');
        msgEl.innerHTML = `<strong>Free Worldwide Delivery Unlocked!</strong> 🎉`;
      } else {
        const percent = Math.min(100, Math.round((subtotal / threshold) * 100));
        const diff = (threshold - subtotal).toFixed(2);
        progressEl.style.width = `${percent}%`;
        progressEl.classList.remove('is-unlocked');
        msgEl.innerHTML = `Add <strong>$${diff}</strong> more to unlock <strong>Free Worldwide Shipping</strong>`;
      }
    }

    // Update Totals
    const discount = this.getDiscount();
    const total = this.getTotal();

    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    const discountRow = document.getElementById('cartDrawerDiscountRow');
    const discountEl = document.getElementById('cartDrawerDiscount');
    if (discountRow && discountEl) {
      if (discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-$${discount.toFixed(2)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    const totalEl = document.getElementById('cartDrawerTotal');
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  },

  renderWishlistDrawer() {
    const container = document.getElementById('wishlistDrawerItems');
    if (!container) return;

    if (this.wishlist.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h4>Your Wishlist is Empty</h4>
          <p>Tap the heart icon on any piece to save your favorite styles for later.</p>
          <a href="shop.html" class="btn btn-primary" onclick="CrispCart.closeWishlist()">Explore Catalog</a>
        </div>
      `;
    } else {
      const products = this.wishlist
        .map(id => typeof getProductById === 'function' ? getProductById(id) : null)
        .filter(Boolean);

      container.innerHTML = products.map(p => `
        <div class="cart-drawer-item">
          <div class="cart-item-thumb">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-head">
              <h5 class="cart-item-title">${p.name}</h5>
              <button class="cart-item-remove" onclick="CrispCart.toggleWishlist(${p.id})" title="Remove from wishlist">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="cart-item-meta">
              <span>Category: <strong>${p.categoryLabel}</strong></span>
            </div>
            <div class="cart-item-foot">
              <div class="cart-item-price">$${p.price.toFixed(2)}</div>
              <button class="btn btn-sm btn-primary" onclick="CrispCart.addItem(${p.id}); CrispCart.toggleWishlist(${p.id})">
                Move to Bag
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  },

  openCart() {
    this.closeWishlist();
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.classList.add('drawer-locked');
  },

  closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) drawer.classList.remove('is-open');
    if (overlay && !document.getElementById('wishlistDrawer')?.classList.contains('is-open')) {
      overlay.classList.remove('is-open');
      document.body.classList.remove('drawer-locked');
    }
  },

  openWishlist() {
    this.closeCart();
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.classList.add('drawer-locked');
  },

  closeWishlist() {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) drawer.classList.remove('is-open');
    if (overlay && !document.getElementById('cartDrawer')?.classList.contains('is-open')) {
      overlay.classList.remove('is-open');
      document.body.classList.remove('drawer-locked');
    }
  },

  showToast(message, type = "info") {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'crisp-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `crisp-toast crisp-toast-${type}`;
    
    let icon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;
    if (type === 'check') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'heart') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    } else if (type === 'bag') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`;
    }

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('is-visible'), 10);
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  bindEvents() {
    // Cart open buttons
    document.querySelectorAll('.js-cart-open').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.openCart();
      });
    });

    // Wishlist open buttons
    document.querySelectorAll('.js-wishlist-open').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.openWishlist();
      });
    });

    // Close buttons
    document.querySelectorAll('.js-drawer-close').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeCart();
        this.closeWishlist();
      });
    });

    // Overlay click
    const overlay = document.getElementById('drawerOverlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeCart();
        this.closeWishlist();
      });
    }

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeCart();
        this.closeWishlist();
      }
    });

    // Promo code form in drawer
    const promoForm = document.getElementById('cartDrawerPromoForm');
    if (promoForm) {
      promoForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = promoForm.querySelector('input');
        if (input && input.value) {
          this.applyPromo(input.value);
          input.value = '';
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CrispCart.init();
});
