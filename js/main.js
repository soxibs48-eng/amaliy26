/**
 * Crisp Store - Main Interactive Engine
 * Handles Quick View Modal, Product Cards, Mobile Nav, Filters, and Navigation
 */

const CrispApp = {
  activeCurrency: 'USD',
  currencyRates: {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 }
  },

  init() {
    this.renderHomeSections();
    this.bindQuickView();
    this.bindMobileNav();
    this.bindSearch();
    this.bindCurrencySwitcher();
    this.bindNewsletter();
    this.bindTabs();
  },

  formatPrice(amount) {
    const info = this.currencyRates[this.activeCurrency] || this.currencyRates.USD;
    const converted = amount * info.rate;
    return `${info.symbol}${converted.toFixed(2)}`;
  },

  createProductCardHTML(product) {
    const isWished = typeof CrispCart !== 'undefined' && CrispCart.isWishlisted(product.id);
    const badgeHTML = product.badge
      ? `<span class="product-badge badge-${product.badgeType || 'default'}">${product.badge}</span>`
      : '';

    const colorsHTML = product.colors && product.colors.length > 0
      ? `<div class="product-card-colors">
          ${product.colors.map((c, i) => `
            <span class="color-swatch ${i === 0 ? 'is-active' : ''}" style="background-color: ${c.hex};" title="${c.name}"></span>
          `).join('')}
         </div>`
      : '';

    const originalPriceHTML = product.originalPrice
      ? `<span class="price-original">${this.formatPrice(product.originalPrice)}</span>`
      : '';

    return `
      <article class="product-card" data-product-id="${product.id}" data-category="${product.category}">
        <div class="product-card-media">
          ${badgeHTML}
          <button class="wishlist-btn ${isWished ? 'is-active' : ''}" 
                  data-wishlist-id="${product.id}" 
                  onclick="CrispCart.toggleWishlist(${product.id})"
                  aria-label="${isWished ? 'Remove from wishlist' : 'Add to wishlist'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
          <a href="product.html?id=${product.id}" class="product-card-img-link">
            <img class="product-img-main" src="${product.image}" alt="${product.name}" loading="lazy">
            <img class="product-img-hover" src="${product.altImage || product.image}" alt="${product.name}" loading="lazy">
          </a>

          <div class="product-card-actions">
            <button class="btn-quick-view" onclick="CrispApp.openQuickView(${product.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Quick View
            </button>
            <button class="btn-add-bag" onclick="CrispCart.addItem(${product.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
              </svg>
              Add to Bag
            </button>
          </div>
        </div>

        <div class="product-card-body">
          <div class="product-card-cat">${product.categoryLabel}</div>
          <h4 class="product-card-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h4>
          <div class="product-card-rating">
            <div class="stars">
              ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span class="rating-count">(${product.reviewsCount})</span>
          </div>
          <div class="product-card-price">
            <span class="price-current">${this.formatPrice(product.price)}</span>
            ${originalPriceHTML}
          </div>
          ${colorsHTML}
        </div>
      </article>
    `;
  },

  renderHomeSections() {
    // 1. New Arrivals section (8 items)
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    if (newArrivalsGrid && typeof CRISP_PRODUCTS !== 'undefined') {
      const items = CRISP_PRODUCTS.slice(0, 8);
      newArrivalsGrid.innerHTML = items.map(p => this.createProductCardHTML(p)).join('');
    }

    // 2. Popular & Trending section (4 items)
    const popularGrid = document.getElementById('popularGrid');
    if (popularGrid && typeof CRISP_PRODUCTS !== 'undefined') {
      const populars = CRISP_PRODUCTS.filter(p => p.isPopular).slice(0, 4);
      popularGrid.innerHTML = populars.map(p => this.createProductCardHTML(p)).join('');
    }
  },

  bindTabs() {
    const tabButtons = document.querySelectorAll('.js-filter-tab');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const cat = btn.getAttribute('data-filter') || 'all';
        const targetGrid = document.getElementById('newArrivalsGrid');
        if (!targetGrid || typeof CRISP_PRODUCTS === 'undefined') return;

        let filtered = CRISP_PRODUCTS;
        if (cat !== 'all') {
          filtered = CRISP_PRODUCTS.filter(p => p.category === cat);
        }

        targetGrid.style.opacity = '0.4';
        setTimeout(() => {
          targetGrid.innerHTML = filtered.slice(0, 8).map(p => this.createProductCardHTML(p)).join('');
          targetGrid.style.opacity = '1';
        }, 150);
      });
    });
  },

  openQuickView(productId) {
    const product = typeof getProductById === 'function' ? getProductById(productId) : null;
    if (!product) return;

    let modal = document.getElementById('quickViewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quickViewModal';
      modal.className = 'crisp-modal';
      document.body.appendChild(modal);
    }

    const originalPriceHTML = product.originalPrice
      ? `<span class="price-original">${this.formatPrice(product.originalPrice)}</span>`
      : '';

    modal.innerHTML = `
      <div class="modal-backdrop" onclick="CrispApp.closeQuickView()"></div>
      <div class="modal-dialog quick-view-dialog">
        <button class="modal-close-btn" onclick="CrispApp.closeQuickView()" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="quick-view-grid">
          <div class="quick-view-gallery">
            <div class="qv-main-image">
              <img id="qvMainImg" src="${product.image}" alt="${product.name}">
            </div>
            <div class="qv-thumbs">
              <button class="qv-thumb is-active" onclick="document.getElementById('qvMainImg').src='${product.image}'">
                <img src="${product.image}" alt="Thumb 1">
              </button>
              <button class="qv-thumb" onclick="document.getElementById('qvMainImg').src='${product.altImage || product.image}'">
                <img src="${product.altImage || product.image}" alt="Thumb 2">
              </button>
            </div>
          </div>

          <div class="quick-view-details">
            <div class="qv-category">${product.categoryLabel}</div>
            <h3 class="qv-title">${product.name}</h3>
            <div class="qv-meta">
              <div class="stars">${'★'.repeat(Math.floor(product.rating))}</div>
              <span class="rating-text">${product.rating} (${product.reviewsCount} verified reviews)</span>
              <span class="meta-dot">•</span>
              <span class="stock-status in-stock">● In Stock</span>
            </div>

            <div class="qv-price">
              <span class="price-current">${this.formatPrice(product.price)}</span>
              ${originalPriceHTML}
            </div>

            <p class="qv-desc">${product.shortDesc}</p>

            <!-- Color selection -->
            <div class="qv-option-group">
              <label class="qv-option-label">Color: <strong id="qvSelectedColor">${product.colors[0]?.name || 'Standard'}</strong></label>
              <div class="qv-colors">
                ${product.colors.map((c, i) => `
                  <button type="button" class="color-swatch-btn ${i === 0 ? 'is-selected' : ''}" 
                          style="background-color: ${c.hex};" 
                          onclick="CrispApp.selectQVColor(this, '${c.name}')" 
                          title="${c.name}"></button>
                `).join('')}
              </div>
            </div>

            <!-- Size selection -->
            <div class="qv-option-group">
              <div class="qv-label-split">
                <label class="qv-option-label">Size: <strong id="qvSelectedSize">${product.sizes[0]}</strong></label>
                <a href="#sizeGuide" class="size-guide-link" onclick="CrispCart.showToast('Model is 5\\'9\\\" wearing size S')">Size Guide</a>
              </div>
              <div class="qv-sizes">
                ${product.sizes.map((s, i) => `
                  <button type="button" class="size-pill-btn ${i === 0 ? 'is-selected' : ''}" 
                          onclick="CrispApp.selectQVSize(this, '${s}')">${s}</button>
                `).join('')}
              </div>
            </div>

            <!-- Quantity & Actions -->
            <div class="qv-actions">
              <div class="quantity-stepper">
                <button type="button" onclick="CrispApp.stepQVQty(-1)">−</button>
                <span id="qvQtyVal">1</span>
                <button type="button" onclick="CrispApp.stepQVQty(1)">+</button>
              </div>

              <button class="btn btn-primary btn-add-qv" onclick="CrispApp.submitQuickView(${product.id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Add to Bag
              </button>

              <button class="btn btn-outline btn-qv-wishlist" onclick="CrispCart.toggleWishlist(${product.id}); CrispApp.closeQuickView();">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <div class="qv-footer-link">
              <a href="product.html?id=${product.id}">View full product details →</a>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.classList.add('modal-locked');
  },

  selectQVColor(btn, name) {
    document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    const label = document.getElementById('qvSelectedColor');
    if (label) label.textContent = name;
  },

  selectQVSize(btn, size) {
    document.querySelectorAll('.size-pill-btn').forEach(b => b.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    const label = document.getElementById('qvSelectedSize');
    if (label) label.textContent = size;
  },

  stepQVQty(delta) {
    const el = document.getElementById('qvQtyVal');
    if (!el) return;
    let val = parseInt(el.textContent, 10) + delta;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    el.textContent = val;
  },

  submitQuickView(productId) {
    const size = document.getElementById('qvSelectedSize')?.textContent || 'M';
    const color = document.getElementById('qvSelectedColor')?.textContent || 'Standard';
    const qty = parseInt(document.getElementById('qvQtyVal')?.textContent || '1', 10);

    CrispCart.addItem(productId, size, color, qty);
    this.closeQuickView();
  },

  closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) modal.classList.remove('is-open');
    document.body.classList.remove('modal-locked');
  },

  bindQuickView() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeQuickView();
    });
  },

  bindMobileNav() {
    const toggle = document.querySelector('.js-mobile-toggle');
    const drawer = document.getElementById('mobileNavDrawer');
    const closeBtn = document.querySelector('.js-mobile-nav-close');
    const overlay = document.getElementById('mobileNavOverlay');

    if (toggle && drawer) {
      toggle.addEventListener('click', () => {
        drawer.classList.add('is-open');
        if (overlay) overlay.classList.add('is-open');
        document.body.classList.add('nav-locked');
      });
    }

    const closeNav = () => {
      if (drawer) drawer.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.classList.remove('nav-locked');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay) overlay.addEventListener('click', closeNav);
  },

  bindSearch() {
    const searchToggles = document.querySelectorAll('.js-search-toggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.querySelector('.js-search-close');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchToggles.length && searchOverlay) {
      searchToggles.forEach(t => {
        t.addEventListener('click', e => {
          e.preventDefault();
          searchOverlay.classList.add('is-open');
          setTimeout(() => searchInput?.focus(), 100);
        });
      });
    }

    if (searchClose && searchOverlay) {
      searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('is-open');
      });
    }

    if (searchInput && searchResults && typeof CRISP_PRODUCTS !== 'undefined') {
      searchInput.addEventListener('input', e => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) {
          searchResults.innerHTML = `
            <div class="search-hint">Type at least 2 characters to search dresses, tops, or accessories...</div>
          `;
          return;
        }

        const matches = CRISP_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query) ||
          p.shortDesc.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          searchResults.innerHTML = `
            <div class="search-no-results">
              <p>No products found for "<strong>${e.target.value}</strong>".</p>
              <a href="shop.html" class="btn btn-outline btn-sm">Browse All Products</a>
            </div>
          `;
        } else {
          searchResults.innerHTML = `
            <div class="search-results-grid">
              ${matches.map(p => `
                <a href="product.html?id=${p.id}" class="search-result-item">
                  <img src="${p.image}" alt="${p.name}">
                  <div class="search-result-info">
                    <h6>${p.name}</h6>
                    <span>${CrispApp.formatPrice(p.price)}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          `;
        }
      });
    }
  },

  bindCurrencySwitcher() {
    const selector = document.getElementById('currencySelector');
    if (selector) {
      selector.addEventListener('change', e => {
        this.activeCurrency = e.target.value;
        this.renderHomeSections();
        if (typeof CrispCart !== 'undefined') {
          CrispCart.renderCartDrawer();
        }
        CrispCart.showToast(`Currency changed to ${this.activeCurrency}`);
      });
    }
  },

  bindNewsletter() {
    const forms = document.querySelectorAll('.js-newsletter-form');
    forms.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value) {
          CrispCart.showToast(`Thank you! Code CRISP20 sent to ${input.value}`, "check");
          input.value = '';
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CrispApp.init();
});
