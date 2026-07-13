// ============================================================
//  admin-login.js  — include this in every HTML page
//  It adds the "Admin" button to the top-right of your navbar
//  and handles the login modal + token storage
// ============================================================

(function () {

  // ── 1. Inject CSS ────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #admin-float-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: #1a3c2e;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,.25);
  transition: background .2s, transform .1s;
  font-family: 'Segoe UI', Arial, sans-serif;
}
@media (max-width: 768px) {
  #admin-float-btn {
    bottom: 15px;
    right: 15px;
    padding: 8px 14px;
    font-size: 12px;
  }
}  
    #admin-float-btn:hover { background: #24523e; transform: translateY(-1px); }

    #admin-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
      z-index: 10000;
      align-items: center;
      justify-content: center;
    }
    #admin-modal-overlay.open { display: flex; }

    #admin-modal {
      background: #fff;
      border-radius: 14px;
      width: 360px;
      max-width: 95vw;
      box-shadow: 0 10px 50px rgba(0,0,0,.25);
      overflow: hidden;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    #admin-modal .am-header {
      background: #1a3c2e;
      color: #fff;
      padding: 22px 24px 18px;
    }
    #admin-modal .am-header h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 2px;
    }
    #admin-modal .am-header p {
      font-size: 12px;
      opacity: .7;
    }
    #admin-modal .am-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    #admin-modal .am-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    #admin-modal .am-field label {
      font-size: 11px;
      font-weight: 700;
      color: #555;
      text-transform: uppercase;
      letter-spacing: .5px;
    }
    #admin-modal .am-field input {
      border: 1.5px solid #ddd;
      border-radius: 7px;
      padding: 10px 14px;
      font-size: 14px;
      font-family: inherit;
      transition: border .2s;
    }
    #admin-modal .am-field input:focus {
      outline: none;
      border-color: #1a3c2e;
    }
    #admin-modal .am-error {
      font-size: 12px;
      color: #c0392b;
      background: #fde8e8;
      border-radius: 6px;
      padding: 8px 12px;
      display: none;
    }
    #admin-modal .am-error.show { display: block; }
    #admin-modal .am-footer {
      padding: 0 24px 24px;
      display: flex;
      gap: 10px;
    }
    #admin-modal .am-cancel {
      flex: 1;
      background: #f0f0f0;
      border: none;
      padding: 11px;
      border-radius: 7px;
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
    }
    #admin-modal .am-login {
      flex: 2;
      background: #1a3c2e;
      color: #fff;
      border: none;
      padding: 11px;
      border-radius: 7px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      transition: background .2s;
    }
    #admin-modal .am-login:hover   { background: #24523e; }
    #admin-modal .am-login:disabled{ opacity: .6; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  // ── 2. Inject HTML ───────────────────────────────────────────────────────
  const html = `
    <button id="admin-float-btn">🔐 Admin</button>

    <div id="admin-modal-overlay">
      <div id="admin-modal">
        <div class="am-header">
          <h2>Admin Login</h2>
          <p>NanoCal Industries — Restricted Access</p>
        </div>
        <div class="am-body">
          <div class="am-field">
            <label>Username</label>
            <input id="am-username" type="text" placeholder="admin" autocomplete="username"/>
          </div>
          <div class="am-field">
            <label>Password</label>
            <input id="am-password" type="password" placeholder="••••••••" autocomplete="current-password"/>
          </div>
          <div class="am-error" id="am-error">Invalid username or password.</div>
        </div>
        <div class="am-footer">
          <button class="am-cancel" id="am-cancel">Cancel</button>
          <button class="am-login"  id="am-login-btn">Login →</button>
        </div>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // ── 3. Wire up events ────────────────────────────────────────────────────
  const overlay  = document.getElementById('admin-modal-overlay');
  const floatBtn = document.getElementById('admin-float-btn');
  const cancelBtn= document.getElementById('am-cancel');
  const loginBtn = document.getElementById('am-login-btn');
  const errorBox = document.getElementById('am-error');
  const userInput= document.getElementById('am-username');
  const passInput= document.getElementById('am-password');

  // If already logged in, button goes straight to panel
  if (localStorage.getItem('admin_token')) {
    floatBtn.textContent = '⚙️ Admin Panel';
    floatBtn.onclick = () => window.location.href = '/admin/';
  } else {
    floatBtn.onclick = openModal;
  }

  cancelBtn.onclick = closeModal;

  overlay.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // Allow Enter key to submit
  passInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  userInput.addEventListener('keydown', e => { if (e.key === 'Enter') passInput.focus(); });

  loginBtn.onclick = doLogin;

  function openModal() {
    errorBox.classList.remove('show');
    userInput.value = '';
    passInput.value = '';
    overlay.classList.add('open');
    setTimeout(() => userInput.focus(), 100);
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  async function doLogin() {
    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username || !password) {
      errorBox.textContent = 'Please enter both username and password.';
      errorBox.classList.add('show');
      return;
    }

    loginBtn.disabled    = true;
    loginBtn.textContent = 'Logging in...';
    errorBox.classList.remove('show');

    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });
      const json = await res.json();

      if (json.success && json.token) {
        localStorage.setItem('admin_token', json.token);
        closeModal();
        window.location.href = '/admin/';
      } else {
        errorBox.textContent = json.message || 'Invalid credentials.';
        errorBox.classList.add('show');
        passInput.value = '';
      }
    } catch {
      errorBox.textContent = 'Could not connect to server. Is it running?';
      errorBox.classList.add('show');
    } finally {
      loginBtn.disabled    = false;
      loginBtn.textContent = 'Login →';
    }
  }

})();
