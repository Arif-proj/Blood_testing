/* ═══════════════════════════════════════════
   BLOODLINK TN — AUTH JAVASCRIPT
   Features:
   1. Tab switching (Login / Register)
   2. Role selection (show/hide org name field)
   3. Password show/hide toggle
   4. Password strength meter
   5. Form validation (front-end)
   6. Simulated login/register (ready for backend)
   7. Auto-tab from URL param (?tab=login)
═══════════════════════════════════════════ */

/* ─── 1. TAB SWITCHING ─────────────────── */
function showTab(tab) {
  const formLogin    = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');
  const tabLogin     = document.getElementById('tabLogin');
  const tabRegister  = document.getElementById('tabRegister');

  if (tab === 'login') {
    formLogin.style.display    = 'block';
    formRegister.style.display = 'none';
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    formLogin.style.display    = 'none';
    formRegister.style.display = 'block';
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

// Check URL param: register.html?tab=login
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('tab') === 'login') showTab('login');

// Check URL param: register.html?role=bloodbank
const roleParam = urlParams.get('role');
if (roleParam) {
  showTab('register');
  const roleInput = document.querySelector(`input[name="role"][value="${roleParam}"]`);
  if (roleInput) {
    roleInput.checked = true;
    handleRoleChange(roleParam);
  }
}

/* ─── 2. ROLE SELECTION ────────────────── */
function handleRoleChange(role) {
  const orgGroup = document.getElementById('orgNameGroup');
  // Show "Organisation name" only for blood bank and hospital
  if (role === 'bloodbank' || role === 'hospital') {
    orgGroup.style.display = 'block';
    document.getElementById('regOrgName').placeholder =
      role === 'bloodbank' ? 'Salem Government Blood Bank' : 'Apollo Hospitals Salem';
  } else {
    orgGroup.style.display = 'none';
  }
}

// Listen for role radio changes
document.querySelectorAll('input[name="role"]').forEach(radio => {
  radio.addEventListener('change', () => handleRoleChange(radio.value));
});

/* ─── 3. PASSWORD SHOW/HIDE ─────────────── */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}

/* ─── 4. PASSWORD STRENGTH METER ───────── */
const regPasswordInput = document.getElementById('regPassword');
if (regPasswordInput) {
  regPasswordInput.addEventListener('input', () => {
    const val    = regPasswordInput.value;
    const meter  = document.getElementById('pwStrength');
    const fill   = document.getElementById('strengthFill');
    const label  = document.getElementById('strengthLabel');

    if (!val) { meter.style.display = 'none'; return; }
    meter.style.display = 'flex';

    // Check criteria
    let score = 0;
    if (val.length >= 8)               score++;
    if (/[A-Z]/.test(val))             score++;
    if (/[0-9]/.test(val))             score++;
    if (/[^A-Za-z0-9]/.test(val))     score++;

    const levels = [
      { width: '25%', color: '#EF4444', text: 'Weak' },
      { width: '50%', color: '#F97316', text: 'Fair' },
      { width: '75%', color: '#EAB308', text: 'Good' },
      { width: '100%', color: '#22C55E', text: 'Strong' },
    ];
    const level = levels[score - 1] || levels[0];
    fill.style.width      = level.width;
    fill.style.background = level.color;
    label.textContent     = level.text;
    label.style.color     = level.color;
  });
}

/* ─── 5. VALIDATION HELPERS ────────────── */
function showError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.add('error');
  if (err)   err.textContent = msg;
  return false;
}
function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.remove('error');
  if (err)   err.textContent = '';
}
function clearAll(ids) {
  ids.forEach(([f, e]) => clearError(f, e));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
  return /^\d{10}$/.test(phone.replace(/\s/g, ''));
}

/* ─── 6a. LOGIN FORM SUBMISSION ─────────── */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAll([['loginEmail','loginEmailErr'],['loginPassword','loginPasswordErr']]);

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  let valid = true;

  if (!email)               valid = showError('loginEmail', 'loginEmailErr', 'Email is required');
  else if (!isValidEmail(email)) valid = showError('loginEmail', 'loginEmailErr', 'Enter a valid email address');

  if (!password)            valid = showError('loginPassword', 'loginPasswordErr', 'Password is required');
  else if (password.length < 6) valid = showError('loginPassword', 'loginPasswordErr', 'Password must be at least 6 characters');

  if (!valid) return;

  // Show loading state
  setLoading('loginBtn', true);

  // ─── BACKEND INTEGRATION POINT ───────────
  // Replace the setTimeout below with a real fetch() call:
  //
  // try {
  //   const res = await fetch('/api/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password })
  //   });
  //   const data = await res.json();
  //   if (!res.ok) throw new Error(data.msg || 'Login failed');
  //   localStorage.setItem('token', data.token);
  //   localStorage.setItem('role', data.role);
  //   window.location.href = getDashboardUrl(data.role);
  // } catch (err) {
  //   showFormAlert('loginAlert', 'error', err.message);
  //   setLoading('loginBtn', false);
  // }
  // ─────────────────────────────────────────

  // Simulated login (frontend only — replace with real API later)
  setTimeout(() => {
    setLoading('loginBtn', false);
    showFormAlert('loginAlert', 'success', 'Login successful! (Backend not connected yet — this is the frontend demo)');
  }, 1400);
});

/* ─── 6b. REGISTER FORM SUBMISSION ──────── */
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fields = [
    ['regFirstName','regFirstNameErr'],['regLastName','regLastNameErr'],
    ['regEmail','regEmailErr'],['regPhone','regPhoneErr'],
    ['regDistrict','regDistrictErr'],['regPassword','regPasswordErr'],['regTerms','regTermsErr']
  ];
  clearAll(fields);

  const role      = document.querySelector('input[name="role"]:checked').value;
  const firstName = document.getElementById('regFirstName').value.trim();
  const lastName  = document.getElementById('regLastName').value.trim();
  const orgName   = document.getElementById('regOrgName').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const phone     = document.getElementById('regPhone').value.trim();
  const district  = document.getElementById('regDistrict').value;
  const password  = document.getElementById('regPassword').value;
  const terms     = document.getElementById('regTerms').checked;
  let valid       = true;

  if (!firstName) valid = showError('regFirstName','regFirstNameErr','First name is required');
  if (!lastName)  valid = showError('regLastName','regLastNameErr','Last name is required');

  if ((role === 'bloodbank' || role === 'hospital') && !orgName)
    valid = showError('regOrgName','regOrgNameErr','Organisation name is required');

  if (!email)               valid = showError('regEmail','regEmailErr','Email is required');
  else if (!isValidEmail(email)) valid = showError('regEmail','regEmailErr','Enter a valid email address');

  if (!phone)               valid = showError('regPhone','regPhoneErr','Phone number is required');
  else if (!isValidPhone(phone)) valid = showError('regPhone','regPhoneErr','Enter a valid 10-digit number');

  if (!district) valid = showError('regDistrict','regDistrictErr','Please select your district');

  if (!password)               valid = showError('regPassword','regPasswordErr','Password is required');
  else if (password.length < 8) valid = showError('regPassword','regPasswordErr','Password must be at least 8 characters');

  if (!terms) {
    document.getElementById('regTermsErr').textContent = 'You must accept the terms';
    valid = false;
  }

  if (!valid) return;

  setLoading('registerBtn', true);

  // ─── BACKEND INTEGRATION POINT ───────────
  // Replace the setTimeout below with a real fetch() call:
  //
  // try {
  //   const res = await fetch('/api/register', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ firstName, lastName, orgName, email, phone, district, password, role })
  //   });
  //   const data = await res.json();
  //   if (!res.ok) throw new Error(data.msg || 'Registration failed');
  //   localStorage.setItem('token', data.token);
  //   window.location.href = getDashboardUrl(role);
  // } catch (err) {
  //   showFormAlert('registerAlert', 'error', err.message);
  //   setLoading('registerBtn', false);
  // }
  // ─────────────────────────────────────────

  // Simulated register
  setTimeout(() => {
    setLoading('registerBtn', false);
    showFormAlert('registerAlert', 'success',
      `Account created for ${firstName} as ${role}! (Backend not connected yet — frontend demo)`);
  }, 1600);
});

/* ─── HELPERS ──────────────────────────── */
function setLoading(btnId, isLoading) {
  const btn    = document.getElementById(btnId);
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled       = isLoading;
  text.style.display = isLoading ? 'none' : 'inline';
  loader.style.display = isLoading ? 'inline' : 'none';
}

function showFormAlert(alertId, type, message) {
  const el = document.getElementById(alertId);
  el.className = `form-alert ${type}`;
  el.textContent = message;
  el.style.display = 'block';
  // Scroll to alert
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getDashboardUrl(role) {
  const urls = {
    patient:   '../pages/dashboard-patient.html',
    bloodbank: '../pages/dashboard-bank.html',
    hospital:  '../pages/dashboard-hospital.html',
    admin:     '../pages/dashboard-admin.html',
  };
  return urls[role] || '../index.html';
}
