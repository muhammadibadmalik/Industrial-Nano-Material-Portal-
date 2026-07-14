// ============================================================
//  NanoCal CaCl₂ — main.js  (single merged file — use ONLY this one)
//  Place in public/js/main.js and delete every other main.js
// ============================================================

const API = 'https://nodejs-production-b8d01.up.railway.app/api'; // change for production if needed

// ── Utility: loading / error states ─────────────────────────────────────
function showLoading(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `
    <div style="text-align:center; padding:60px 0; color:#888;">
      <div style="font-size:2rem; margin-bottom:12px;">⏳</div>
      <p>Loading products...</p>
    </div>`;
}

function showError(containerId, msg) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `
    <div style="text-align:center; padding:60px 0; color:#c0392b;">
      <div style="font-size:2rem; margin-bottom:12px;">⚠️</div>
      <p>${msg}</p>
    </div>`;
}

// ── Build a product card — MUST match your real CSS classes ─────────────
// (product-card > img.product-img + div.product-info > h3, p, .product-meta > .product-tag + .product-link)
function buildProductCard(product) {
  const categoryLabel = {
    desiccant:  'Desiccant',
    industrial: 'Industrial',
    deicing:    'De-Icing',
    laboratory: 'Laboratory',
  }[product.category] || product.category;

  return `
    <div class="product-card" data-category="${product.category}">
      <img src="Images/${product.image}" alt="${product.name}" class="product-img"
           onerror="this.src='Images/placeholder.png'">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          <span class="product-tag">${categoryLabel}</span>
          <a href="product-details.html?id=${product._id}" class="product-link">Learn More →</a>
        </div>
      </div>
    </div>`;
}

// ── Attach hover-zoom to a product card's image (called after every render) ─
function attachCardHoverEffects() {
  document.querySelectorAll('.product-card').forEach(card => {
    const img = card.querySelector('.product-img');
    if (!img || card.dataset.hoverBound) return;
    card.dataset.hoverBound = 'true';
    card.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
    card.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
  });
}

// ═══════════════════════════════════════════════════════════════
//  PAGE: products.html
// ═══════════════════════════════════════════════════════════════
async function initProductsPage() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let allProducts = [];

  showLoading('products-grid');
  try {
    const res = await fetch(`${API}/products`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    allProducts = json.data;
  } catch (err) {
    showError('products-grid', 'Could not load products. Please try again later.');
    console.error(err);
    return;
  }

  function renderProducts(category) {
    const filtered = category === 'all'
      ? allProducts
      : allProducts.filter(p => p.category === category);

    if (filtered.length === 0) {
      grid.innerHTML = `<p style="text-align:center;padding:40px;color:#888;">No products found in this category.</p>`;
      return;
    }
    grid.innerHTML = filtered.map(buildProductCard).join('');
    attachCardHoverEffects();
  }

  renderProducts('all');

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.category);
    });
  });
}

// ═══════════════════════════════════════════════════════════════
//  PAGE: product-details.html
// ═══════════════════════════════════════════════════════════════
async function initProductDetailsPage() {
  const container = document.getElementById('product-details-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p style="text-align:center;padding:60px;">No product selected.</p>';
    return;
  }

  try {
    const res = await fetch(`${API}/products/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    const p = json.data;
    const related = json.related || [];

    document.title = `${p.name} — NanoCal Industries`;

    const breadcrumb = document.getElementById('product-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = p.name;

    const mainImg = document.getElementById('product-main-image');
    if (mainImg) {
      mainImg.src = `Images/${p.image}`;
      mainImg.alt = p.name;
    }

    const nameEl = document.getElementById('product-name');
    if (nameEl) nameEl.textContent = p.name;

    const catEl = document.getElementById('product-category');
    if (catEl) catEl.textContent = p.category.charAt(0).toUpperCase() + p.category.slice(1);

    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = p.description;

    const specsRow = document.getElementById('product-specs-row');
    if (specsRow) {
      specsRow.innerHTML = `
        <div class="spec-item"><span>Purity</span><strong>${p.specs.purity}</strong></div>
        <div class="spec-item"><span>Particle Size</span><strong>${p.specs.particleSize}</strong></div>
        <div class="spec-item"><span>Moisture Absorption</span><strong>${p.specs.moistureAbsorption}</strong></div>
        <div class="spec-item"><span>Packaging</span><strong>${p.specs.packaging}</strong></div>`;
    }

    const tabDesc = document.getElementById('tab-description-content');
    if (tabDesc) {
      tabDesc.innerHTML = `
        <p>${p.fullDescription || p.description}</p>
        ${p.benefits && p.benefits.length ? `
          <h4 style="margin-top:20px;">Key Benefits</h4>
          <ul>${p.benefits.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}`;
    }

    const tabSpecs = document.getElementById('tab-specifications-content');
    if (tabSpecs) {
      const rows = [
        ['Chemical Formula', p.specs.chemicalFormula],
        ['Purity', p.specs.purity],
        ['Molecular Weight', p.specs.molecularWeight],
        ['Particle Size', p.specs.particleSize],
        ['Bulk Density', p.specs.bulkDensity],
        ['Moisture Content', p.specs.moistureContent],
        ['Appearance', p.specs.appearance],
        ['Form', p.specs.form],
        ['Packaging', p.specs.packaging],
        ['Shelf Life', p.specs.shelfLife],
      ];
      tabSpecs.innerHTML = `
        <table style="width:100%;margin-top:16px;border-collapse:collapse;">
          <tbody>
            ${rows.map(([label, val]) => `
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:12px 0;font-weight:600;">${label}</td>
                <td style="padding:12px 0;">${val || '—'}</td>
              </tr>`).join('')}
          </tbody>
        </table>`;
    }

    const relatedGrid = document.getElementById('related-products-grid');
    if (relatedGrid && related.length > 0) {
      relatedGrid.innerHTML = related.map(buildProductCard).join('');
      attachCardHoverEffects();
    }

  } catch (err) {
    container.innerHTML = `<p style="text-align:center;padding:60px;color:#c0392b;">Product not found.</p>`;
    console.error(err);
  }
}

// ═══════════════════════════════════════════════════════════════
//  PAGE: contact.html  (form must have id="contact-form")
// ═══════════════════════════════════════════════════════════════
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const body = {
      firstName: form.querySelector('#firstName')?.value.trim(),
      lastName:  form.querySelector('#lastName')?.value.trim(),
      email:     form.querySelector('#email')?.value.trim(),
      phone:     form.querySelector('#phone')?.value.trim(),
      company:   form.querySelector('#company')?.value.trim(),
      subject:   form.querySelector('#subject')?.value,
      product:   form.querySelector('#product')?.value,
      message:   form.querySelector('#message')?.value.trim(),
    };

    try {
      const res = await fetch(`${API}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      const msgDiv = document.createElement('div');
      msgDiv.className = 'form-message';

      if (json.success) {
        form.reset();
        msgDiv.style.cssText = 'background:#d4edda;color:#155724;border:1px solid #c3e6cb;border-radius:6px;padding:14px 18px;margin-top:16px;';
        msgDiv.textContent = '✅ ' + json.message;
      } else {
        msgDiv.style.cssText = 'background:#f8d7da;color:#721c24;border:1px solid #f5c6cb;border-radius:6px;padding:14px 18px;margin-top:16px;';
        msgDiv.textContent = '⚠️ ' + (json.message || 'Something went wrong. Please try again.');
      }
      form.appendChild(msgDiv);
      if (window.showNotification) showNotification(json.success ? 'Message sent successfully!' : (json.message || 'Submission failed.'), json.success ? 'success' : 'error');

    } catch (err) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'form-message';
      msgDiv.style.cssText = 'background:#f8d7da;color:#721c24;border:1px solid #f5c6cb;border-radius:6px;padding:14px 18px;margin-top:16px;';
      msgDiv.textContent = '⚠️ Network error. Please check your connection and try again.';
      form.appendChild(msgDiv);
      if (window.showNotification) showNotification('Could not connect to server.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//  Notification system (used site-wide)
// ═══════════════════════════════════════════════════════════════
function showNotification(message, type) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">&times;</button>`;
  notification.style.cssText = `
    position: fixed; top: 100px; right: 20px; padding: 16px 24px;
    background: ${type === 'success' ? '#7dcfb6' : '#e74c3c'};
    color: white; border-radius: 12px; display: flex; align-items: center;
    gap: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 10000;
    animation: slideIn 0.3s ease-out;`;

  if (!document.getElementById('notification-keyframes')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-keyframes';
    styleSheet.textContent = `
      @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
      .notification button { background: none; border: none; color: white; font-size: 1.25rem; cursor: pointer; padding: 0; line-height: 1; }
    `;
    document.head.appendChild(styleSheet);
  }

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}
window.showNotification = showNotification;

// ═══════════════════════════════════════════════════════════════
//  Site-wide UX: nav, scroll, animations, counters
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.querySelectorAll('span').forEach(span => span.classList.toggle('active'));
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Header shadow on scroll
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.pageYOffset > 100
        ? '0 4px 20px rgba(0,0,0,0.1)'
        : '0 2px 20px rgba(0,0,0,0.05)';
    });
  }

  // Fade-in-on-scroll for static elements present at load
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.1 });

  document.querySelectorAll('.feature-card, .application-card, .about-stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });

  if (!document.getElementById('animate-in-style')) {
    const style = document.createElement('style');
    style.id = 'animate-in-style';
    style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
  }

  // Stat counters
  function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target + (element.dataset.suffix || '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (element.dataset.suffix || '');
      }
    }, 16);
  }
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const h3 = entry.target.querySelector('h3');
        if (h3 && !h3.classList.contains('counted')) {
          h3.classList.add('counted');
          animateCounter(h3);
        }
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-item, .about-stat').forEach(el => statObserver.observe(el));

  // Admin dashboard (only runs on admin.html)
  if (document.querySelector('.admin-content')) {
    highlightActivePage();
  }

  // Page-specific dynamic content
  initProductsPage();
  initProductDetailsPage();
  initContactPage();
});

// ═══════════════════════════════════════════════════════════════
//  Admin dashboard functions
// ═══════════════════════════════════════════════════════════════
function adminAction(action) {
  switch (action) {
    case 'addProduct':
      showNotification('Opening Add Product form...', 'success');
      break;
    case 'newOrder':
      showNotification('Opening New Order form...', 'success');
      break;
    case 'viewInquiries':
      showNotification('Loading inquiries...', 'success');
      document.querySelector('.admin-table')?.scrollIntoView({ behavior: 'smooth' });
      break;
    case 'generateReport':
      showNotification('Generating monthly report...', 'success');
      setTimeout(() => showNotification('Report generated successfully! Downloading...', 'success'), 1500);
      break;
    default:
      showNotification('Loading...', 'success');
  }
}

function highlightActivePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'admin.html';
  document.querySelectorAll('.admin-nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
}

function adminNavigate(section, event) {
  document.querySelectorAll('.admin-nav a').forEach(link => link.classList.remove('active'));
  event?.target?.classList.add('active');

  const sectionNames = {
    overview: 'Dashboard Overview', products: 'Products Management', orders: 'Orders',
    customers: 'Customers', analytics: 'Analytics', inquiries: 'Customer Inquiries',
    categories: 'Categories', content: 'Content Management', settings: 'Settings'
  };
  const title = document.querySelector('.admin-content h1');
  if (title) title.textContent = sectionNames[section] || 'Dashboard';
  showNotification(`Navigating to ${sectionNames[section]}...`, 'success');
}

function searchAdmin(query) {
  const searchTerm = query.toLowerCase();
  document.querySelectorAll('.admin-table tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
  });
}

function exportToCSV(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const csv = [];
  table.querySelectorAll('tr').forEach(row => {
    const rowData = [];
    row.querySelectorAll('td, th').forEach(col => rowData.push(col.textContent.trim()));
    csv.push(rowData.join(','));
  });
  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'export.csv';
  a.click();
}

// ═══════════════════════════════════════════════════════════════
//  Product Details page: tabs + quantity selector
// ═══════════════════════════════════════════════════════════════
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
  document.getElementById(`${tabId}-content`)?.classList.add('active');
}

function updateQuantity(change) {
  const input = document.querySelector('.quantity-input');
  if (input) {
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    if (value > 100) value = 100;
    input.value = value;
  }
}