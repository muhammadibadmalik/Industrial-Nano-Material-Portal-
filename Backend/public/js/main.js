// ============================================================
//  NanoCal CaCl₂ — main.js
//  Connects your HTML frontend to the Express/MongoDB backend
//  Place this file in your public/js/ folder
// ============================================================

const API = 'https://nodejs-production-b8d01.up.railway.app';   // change to your deployed URL in production

// ── Utility: show / hide loading spinner ───────────────────────────────────
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

// ── Build a product card (same structure as your existing HTML cards) ────────
function buildProductCard(product) {
  const categoryLabel = {
    desiccant:  'Desiccant',
    industrial: 'Industrial',
    deicing:    'De-Icing',
    laboratory: 'Laboratory',
  }[product.category] || product.category;

  return `
    <div class="product-card" data-category="${product.category}">
      <div class="product-image">
        <img src="/images/${product.image}"
             alt="${product.name}"
             onerror="this.src='/images/placeholder.png'"/>
      </div>
      <div class="product-info">
        <span class="product-category">${categoryLabel}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-specs">
          <span>Purity: ${product.specs.purity}</span>
          <span>Particle Size: ${product.specs.particleSize}</span>
        </div>
        <div class="product-actions">
          <a href="product-details.html?id=${product._id}" class="btn btn-primary">View Details</a>
          <a href="contact.html" class="btn btn-outline">Get Quote</a>
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════
//  PAGE: products.html
//  Loads all products, wires up the category filter buttons
// ═══════════════════════════════════════════════════════════════
async function initProductsPage() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;   // not on products page — skip

  let allProducts = [];

  // ── Fetch products from API ──────────────────────────────────
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

  // ── Render all products ───────────────────────────────────────
  function renderProducts(category) {
    const filtered = category === 'all'
      ? allProducts
      : allProducts.filter(p => p.category === category);

    if (filtered.length === 0) {
      grid.innerHTML = `<p style="text-align:center;padding:40px;color:#888;">No products found in this category.</p>`;
      return;
    }

    grid.innerHTML = filtered.map(buildProductCard).join('');
  }

  renderProducts('all');

  // ── Wire up filter buttons ────────────────────────────────────
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
//  Reads ?id= from URL, fetches product, renders all tabs
// ═══════════════════════════════════════════════════════════════
async function initProductDetailsPage() {
  const container = document.getElementById('product-details-container');
  if (!container) return;   // not on details page — skip

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p style="text-align:center;padding:60px;">No product selected.</p>';
    return;
  }

  // ── Fetch single product ─────────────────────────────────────
  try {
    const res = await fetch(`${API}/products/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    const p = json.data;
    const related = json.related || [];

    // Update page <title>
    document.title = `${p.name} — NanoCal Industries`;

    // ── Breadcrumb ───────────────────────────────────────────────
    const breadcrumb = document.getElementById('product-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = p.name;

    // ── Main image ───────────────────────────────────────────────
    const mainImg = document.getElementById('product-main-image');
    if (mainImg) {
      mainImg.src = `/images/${p.image}`;
      mainImg.alt = p.name;
    }

    // ── Product name & category ──────────────────────────────────
    const nameEl = document.getElementById('product-name');
    if (nameEl) nameEl.textContent = p.name;

    const catEl = document.getElementById('product-category');
    if (catEl) catEl.textContent = p.category.charAt(0).toUpperCase() + p.category.slice(1);

    // ── Short description ────────────────────────────────────────
    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = p.description;

    // ── Quick specs row (purity / particle size / absorption) ────
    const specsRow = document.getElementById('product-specs-row');
    if (specsRow) {
      specsRow.innerHTML = `
        <div class="spec-item"><span class="spec-label">Purity</span><span class="spec-value">${p.specs.purity}</span></div>
        <div class="spec-item"><span class="spec-label">Particle Size</span><span class="spec-value">${p.specs.particleSize}</span></div>
        <div class="spec-item"><span class="spec-label">Moisture Absorption</span><span class="spec-value">${p.specs.moistureAbsorption}</span></div>
        <div class="spec-item"><span class="spec-label">Packaging</span><span class="spec-value">${p.specs.packaging}</span></div>`;
    }

    // ── Tab: Description (full description + benefits list) ──────
    const tabDesc = document.getElementById('tab-description');
    if (tabDesc) {
      tabDesc.innerHTML = `
        <p>${p.fullDescription || p.description}</p>
        ${p.benefits && p.benefits.length ? `
          <h4 style="margin-top:20px;">Key Benefits</h4>
          <ul>${p.benefits.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}`;
    }

    // ── Tab: Specifications (full specs table) ───────────────────
    const tabSpecs = document.getElementById('tab-specifications');
    if (tabSpecs) {
      const rows = [
        ['Chemical Formula',    p.specs.chemicalFormula],
        ['Purity',              p.specs.purity],
        ['Molecular Weight',    p.specs.molecularWeight],
        ['Particle Size',       p.specs.particleSize],
        ['Bulk Density',        p.specs.bulkDensity],
        ['Moisture Content',    p.specs.moistureContent],
        ['Appearance',          p.specs.appearance],
        ['Form',                p.specs.form],
        ['Packaging',           p.specs.packaging],
        ['Shelf Life',          p.specs.shelfLife],
      ];
      tabSpecs.innerHTML = `
        <table class="specs-table">
          <tbody>
            ${rows.map(([label, val]) => `
              <tr>
                <td class="spec-label">${label}</td>
                <td>${val || '—'}</td>
              </tr>`).join('')}
          </tbody>
        </table>`;
    }

    // ── Related products ─────────────────────────────────────────
    const relatedGrid = document.getElementById('related-products-grid');
    if (relatedGrid && related.length > 0) {
      relatedGrid.innerHTML = related.map(buildProductCard).join('');
    }

  } catch (err) {
    container.innerHTML = `<p style="text-align:center;padding:60px;color:#c0392b;">Product not found.</p>`;
    console.error(err);
  }
}

// ═══════════════════════════════════════════════════════════════
//  PAGE: contact.html
//  Handles form submission → POST /api/inquiries
// ═══════════════════════════════════════════════════════════════
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;   // not on contact page — skip

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Clear previous messages
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const body = {
      firstName:  form.querySelector('#firstName')?.value.trim(),
      lastName:   form.querySelector('#lastName')?.value.trim(),
      email:      form.querySelector('#email')?.value.trim(),
      phone:      form.querySelector('#phone')?.value.trim(),
      company:    form.querySelector('#company')?.value.trim(),
      subject:    form.querySelector('#subject')?.value,
      product:    form.querySelector('#product')?.value,
      message:    form.querySelector('#message')?.value.trim(),
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

    } catch (err) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'form-message';
      msgDiv.style.cssText = 'background:#f8d7da;color:#721c24;border:1px solid #f5c6cb;border-radius:6px;padding:14px 18px;margin-top:16px;';
      msgDiv.textContent = '⚠️ Network error. Please check your connection and try again.';
      form.appendChild(msgDiv);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//  INIT — runs on every page
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initProductsPage();
  initProductDetailsPage();
  initContactPage();
});