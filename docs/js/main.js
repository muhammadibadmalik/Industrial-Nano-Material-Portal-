// ── Backend API base URL ──────────────────────────────────────────────────
const API_BASE = 'https://nodejs-production-b8d01.up.railway.app';

// ===== Mobile Navigation Toggle =====
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      // Animate hamburger
      const spans = mobileToggle.querySelectorAll('span');
      spans.forEach((span, index) => {
        span.classList.toggle('active');
      });
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ===== Header Scroll Effect =====
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
  });

  // ===== Animate on Scroll =====
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.feature-card, .product-card, .application-card, .about-stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ===== Form Validation =====
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Basic validation
      let isValid = true;
      const inputs = this.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#e74c3c';
        } else {
          input.style.borderColor = '#eee';
        }
      });

      // Email validation
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          isValid = false;
          emailInput.style.borderColor = '#e74c3c';
        }
      }

      if (isValid) {
  try {
    const response = await fetch(`${API_BASE}/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      showNotification(
        'Message sent successfully! We will contact you soon.',
        'success'
      );
      this.reset();
    } else {
      showNotification(
        result.message || 'Submission failed.',
        'error'
      );
    }
  } catch (err) {
    console.error(err);
    showNotification(
      'Could not connect to server.',
      'error'
    );
  }
} else {  
        showNotification('Please fill in all required fields correctly.', 'error');
      }
    });
  }

  // ===== Notification System =====
  function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#7dcfb6' : '#e74c3c'};
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
    `;
    document.head.appendChild(styleSheet);

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Make showNotification globally accessible
  window.showNotification = showNotification;

  // ===== Counter Animation =====
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

  // Observe stat numbers
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

  document.querySelectorAll('.stat-item, .about-stat').forEach(el => {
    statObserver.observe(el);
  });

  // ===== Product Card Hover Effects =====
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.querySelector('.product-image').style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.querySelector('.product-image').style.transform = 'scale(1)';
    });
  });

  // ===== Admin Dashboard Charts (if on admin page) =====
  if (document.querySelector('.admin-content')) {
    initAdminCharts();
    highlightActivePage();
  }
});

// ===== Admin Dashboard Functions =====
function initAdminCharts() {
  // Simple chart simulation
  const chartContainer = document.querySelector('.chart-container');
  if (chartContainer) {
    // You can integrate Chart.js here for real charts
    console.log('Admin charts initialized');
  }
}

// ===== Admin Button Actions =====
function adminAction(action) {
  console.log('[v0] Admin action triggered:', action);
  
  switch(action) {
    case 'addProduct':
      showNotification('Opening Add Product form...', 'success');
      break;
    case 'newOrder':
      showNotification('Opening New Order form...', 'success');
      break;
    case 'viewInquiries':
      showNotification('Loading inquiries...', 'success');
      const inquiriesTable = document.querySelector('.admin-table');
      if (inquiriesTable) {
        inquiriesTable.scrollIntoView({ behavior: 'smooth' });
      }
      break;
    case 'generateReport':
      showNotification('Generating monthly report...', 'success');
      setTimeout(() => {
        showNotification('Report generated successfully! Downloading...', 'success');
      }, 1500);
      break;
    default:
      showNotification('Loading...', 'success');
  }
}

// ===== Admin Navigation - Highlight Active Page =====
function highlightActivePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'admin.html';
  console.log('[v0] Current page:', currentPage);
  
  // Remove active class from all navigation links
  document.querySelectorAll('.admin-nav a').forEach(link => {
    link.classList.remove('active');
    
    // Check if this link matches the current page
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      console.log('[v0] Highlighted:', href);
    }
  });
}

// ===== Admin Navigation =====
function adminNavigate(section) {
  console.log('[v0] Admin section:', section);
  
  // Update active state
  document.querySelectorAll('.admin-nav a').forEach(link => {
    link.classList.remove('active');
  });
  event.target.classList.add('active');
  
  const sectionNames = {
    'overview': 'Dashboard Overview',
    'products': 'Products Management',
    'orders': 'Orders',
    'customers': 'Customers',
    'analytics': 'Analytics',
    'inquiries': 'Customer Inquiries',
    'categories': 'Categories',
    'content': 'Content Management',
    'settings': 'Settings'
  };
  
  const title = document.querySelector('.admin-content h1');
  if (title) {
    title.textContent = sectionNames[section] || 'Dashboard';
  }
  
  showNotification(`Navigating to ${sectionNames[section]}...`, 'success');
}

// ===== Product Filtering (Products Page) =====
function filterProducts(category) {
  const products = document.querySelectorAll('.product-card');
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  products.forEach(product => {
    if (category === 'all' || product.dataset.category === category) {
      product.style.display = 'block';
      setTimeout(() => {
        product.style.opacity = '1';
        product.style.transform = 'translateY(0)';
      }, 100);
    } else {
      product.style.opacity = '0';
      product.style.transform = 'translateY(20px)';
      setTimeout(() => {
        product.style.display = 'none';
      }, 300);
    }
  });
}

// ===== Tab Switching (Product Details) =====
function switchTab(tabId) {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => tab.classList.remove('active'));
  panels.forEach(panel => panel.classList.remove('active'));

  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// ===== Quantity Selector =====
function updateQuantity(change) {
  const input = document.querySelector('.quantity-input');
  if (input) {
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    if (value > 100) value = 100;
    input.value = value;
  }
}

// ===== Admin Search =====
function searchAdmin(query) {
  const rows = document.querySelectorAll('.admin-table tbody tr');
  const searchTerm = query.toLowerCase();

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

// ===== Export to CSV (Admin) =====
function exportToCSV(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  let csv = [];
  const rows = table.querySelectorAll('tr');

  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    const rowData = [];
    cols.forEach(col => rowData.push(col.textContent.trim()));
    csv.push(rowData.join(','));
  });

  const csvContent = csv.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.csv';
  a.click();
}