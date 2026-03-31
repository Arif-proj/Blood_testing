/* ═══════════════════════════════════════════
   BLOODLINK TN — PATIENT DASHBOARD JS
   Features:
   1. Sidebar open/close (mobile)
   2. Section navigation
   3. Blood group selector
   4. Search logic (with mock data)
   5. Results rendering
   6. Sort results
   7. Alert system
   8. Request modal
   9. Requests section
   All marked with // BACKEND: comments where
   you replace mock data with real API calls
═══════════════════════════════════════════ */


/* ═══════════════════════════════════════════
   MOCK DATA
   This simulates what your backend API will
   return. Replace with real fetch() later.
═══════════════════════════════════════════ */
const MOCK_BANKS = [
  {
    id: 1,
    name: "Salem Government Blood Bank",
    district: "Salem",
    address: "Government Hospital Rd, Salem",
    phone: "+91 427 225 5000",
    stock: { "A+":8, "A-":2, "B+":15, "B-":0, "O+":20, "O-":3, "AB+":5, "AB-":1 },
    hours: "Open 24 hours",
    lastUpdated: "2 min ago"
  },
  {
    id: 2,
    name: "Apollo Blood Centre Salem",
    district: "Salem",
    address: "Apollo Hospital, Omalur Main Rd",
    phone: "+91 427 299 0000",
    stock: { "A+":3, "A-":0, "B+":2, "B-":0, "O+":7, "O-":0, "AB+":1, "AB-":0 },
    hours: "Mon–Sat 8AM–8PM",
    lastUpdated: "15 min ago"
  },
  {
    id: 3,
    name: "Red Cross Blood Bank, Coimbatore",
    district: "Coimbatore",
    address: "Red Cross Bhavan, Race Course Rd",
    phone: "+91 422 222 3456",
    stock: { "A+":12, "A-":4, "B+":9, "B-":2, "O+":18, "O-":6, "AB+":3, "AB-":0 },
    hours: "Open 24 hours",
    lastUpdated: "5 min ago"
  },
  {
    id: 4,
    name: "Coimbatore Medical College Blood Bank",
    district: "Coimbatore",
    address: "Trichy Road, Coimbatore",
    phone: "+91 422 230 1000",
    stock: { "A+":0, "A-":0, "B+":0, "B-":0, "O+":4, "O-":0, "AB+":0, "AB-":0 },
    hours: "Open 24 hours",
    lastUpdated: "1 hour ago"
  },
  {
    id: 5,
    name: "Madurai Rajaji Govt Blood Bank",
    district: "Madurai",
    address: "Panagal Rd, Madurai",
    phone: "+91 452 253 0000",
    stock: { "A+":22, "A-":5, "B+":18, "B-":3, "O+":30, "O-":8, "AB+":7, "AB-":2 },
    hours: "Open 24 hours",
    lastUpdated: "10 min ago"
  },
  {
    id: 6,
    name: "Vellore CMC Blood Bank",
    district: "Vellore",
    address: "Ida Scudder Road, Vellore",
    phone: "+91 416 228 2010",
    stock: { "A+":14, "A-":3, "B+":11, "B-":1, "O+":25, "O-":7, "AB+":4, "AB-":1 },
    hours: "Open 24 hours",
    lastUpdated: "8 min ago"
  },
  {
    id: 7,
    name: "Chennai BSNL Blood Bank",
    district: "Chennai",
    address: "Anna Salai, Chennai",
    phone: "+91 44 2345 6789",
    stock: { "A+":5, "A-":1, "B+":0, "B-":0, "O+":8, "O-":2, "AB+":2, "AB-":0 },
    hours: "Mon–Sat 8AM–6PM",
    lastUpdated: "30 min ago"
  },
  {
    id: 8,
    name: "Tiruchirappalli GH Blood Bank",
    district: "Tiruchirappalli",
    address: "Puthur, Tiruchirappalli",
    phone: "+91 431 241 5000",
    stock: { "A+":6, "A-":0, "B+":4, "B-":0, "O+":10, "O-":1, "AB+":2, "AB-":0 },
    hours: "Open 24 hours",
    lastUpdated: "20 min ago"
  }
];

/* Sample saved alerts */
let savedAlerts = [
  { id: 1, group: "B+",  district: "Salem",      active: true  },
  { id: 2, group: "O-",  district: "Coimbatore", active: false },
];

/* Sample requests */
const myRequests = [
  { id: 1, group: "B+", bank: "Salem Government Blood Bank", units: 2, date: "12 Jan 2024", status: "approved" },
  { id: 2, group: "O+", bank: "Apollo Blood Centre Salem",   units: 1, date: "8 Jan 2024",  status: "pending"  },
];


/* ═══════════════════════════════════════════
   1. SIDEBAR OPEN / CLOSE
═══════════════════════════════════════════ */
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('open');
});
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
}


/* ═══════════════════════════════════════════
   2. SECTION NAVIGATION
═══════════════════════════════════════════ */
const sectionMap = {
  search:   { sectionId: 'sectionSearch',   title: 'Search blood'   },
  alerts:   { sectionId: 'sectionAlerts',   title: 'My alerts'      },
  requests: { sectionId: 'sectionRequests', title: 'My requests'    },
  profile:  { sectionId: 'sectionProfile',  title: 'My profile'     },
};

function showSection(key) {
  // Hide all sections
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show the target section
  const { sectionId, title } = sectionMap[key];
  document.getElementById(sectionId).classList.add('active');
  document.getElementById('topbarTitle').textContent = title;

  // Mark the correct nav item active
  document.querySelector(`.nav-item[data-section="${key}"]`).classList.add('active');

  closeSidebar();

  // Load section data
  if (key === 'alerts')   renderAlerts();
  if (key === 'requests') renderRequests();
}

// Wire nav items
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    showSection(item.getAttribute('data-section'));
  });
});


/* ═══════════════════════════════════════════
   3. BLOOD GROUP SELECTOR
═══════════════════════════════════════════ */
let selectedGroup = null;

document.querySelectorAll('.bg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedGroup = btn.getAttribute('data-group');
  });
});


/* ═══════════════════════════════════════════
   4. SEARCH LOGIC
═══════════════════════════════════════════ */
function runSearch() {
  if (!selectedGroup) {
    // Highlight the blood group grid to show user they need to pick one
    const grid = document.getElementById('bloodGroupGrid');
    grid.style.outline = '2px solid var(--red)';
    grid.style.borderRadius = '8px';
    setTimeout(() => { grid.style.outline = 'none'; }, 1600);
    return;
  }

  const district = document.getElementById('searchDistrict').value;
  const btn      = document.getElementById('searchBtn');

  // Button loading state
  btn.innerHTML = '<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M10 3a7 7 0 100 14A7 7 0 0010 3z" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/></svg> Searching...';
  btn.disabled = true;

  // ─── BACKEND: Replace this setTimeout with a real fetch: ─────────
  // const res  = await fetch(`/api/blood?group=${selectedGroup}&district=${district}`);
  // const data = await res.json(); // array of bank objects
  // renderResults(data, selectedGroup, district);
  // ─────────────────────────────────────────────────────────────────

  setTimeout(() => {
    btn.innerHTML = '<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2"/><path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Search now';
    btn.disabled = false;

    // Filter mock data
    let results = MOCK_BANKS.filter(bank => {
      const hasGroup    = bank.stock[selectedGroup] !== undefined;
      const matchDist   = !district || bank.district === district;
      return hasGroup && matchDist;
    });

    renderResults(results, selectedGroup, district);
  }, 800);
}

// Allow pressing Enter on selects to trigger search
document.getElementById('searchDistrict').addEventListener('keydown', e => {
  if (e.key === 'Enter') runSearch();
});


/* ═══════════════════════════════════════════
   5. RENDER RESULTS
═══════════════════════════════════════════ */
let currentResults = []; // stored so we can re-sort

function renderResults(results, group, district) {
  currentResults = results;

  const area        = document.getElementById('resultsArea');
  const grid        = document.getElementById('resultsGrid');
  const emptyState  = document.getElementById('emptyState');
  const noResults   = document.getElementById('noResults');
  const alertOption = document.getElementById('alertOption');

  emptyState.style.display = 'none';

  if (results.length === 0) {
    area.style.display = 'none';
    noResults.style.display = 'flex';
    document.getElementById('noResultsGroup').textContent    = group;
    document.getElementById('noResultsDistrict').textContent = district || 'all districts';
    alertOption.style.display = 'block';
    updateAlertHint(group, district);
    return;
  }

  noResults.style.display = 'none';
  area.style.display = 'block';
  alertOption.style.display = 'block';
  updateAlertHint(group, district);

  // Sort by availability by default
  results.sort((a, b) => (b.stock[group] || 0) - (a.stock[group] || 0));

  document.getElementById('resultsCount').textContent =
    `${results.length} blood bank${results.length > 1 ? 's' : ''} found`;
  document.getElementById('resultsQuery').textContent =
    `${group} · ${district || 'All districts'}`;

  grid.innerHTML = '';
  results.forEach((bank, i) => {
    const units = bank.stock[group] || 0;
    grid.appendChild(buildCard(bank, group, units, i));
  });
}

function updateAlertHint(group, district) {
  document.getElementById('alertGroupName').textContent    = group;
  document.getElementById('alertDistrictName').textContent = district || 'all districts';
}

function buildCard(bank, group, units, index) {
  // Determine status
  let statusClass, statusLabel;
  if (units === 0)      { statusClass = 'unavailable'; statusLabel = 'Not available'; }
  else if (units <= 3)  { statusClass = 'critical';    statusLabel = 'Critical';       }
  else if (units <= 8)  { statusClass = 'low';         statusLabel = 'Low stock';      }
  else                  { statusClass = 'available';   statusLabel = 'Available';      }

  const badgeClass = {
    available: 'status-available', low: 'status-low',
    critical: 'status-critical', unavailable: 'status-unavailable'
  }[statusClass];

  const card = document.createElement('div');
  card.className = `result-card ${statusClass}`;
  card.style.animationDelay = `${index * 0.06}s`;

  card.innerHTML = `
    <div class="card-top">
      <div>
        <div class="card-bank-name">${bank.name}</div>
        <div class="card-district">${bank.district}</div>
      </div>
      <span class="card-status-badge ${badgeClass}">${statusLabel}</span>
    </div>

    <div class="card-units-row">
      <span class="card-units-num">${units}</span>
      <span class="card-units-label">unit${units !== 1 ? 's' : ''}<br/>available</span>
      <div class="card-group-tag">${group}</div>
    </div>

    <div class="card-meta">
      <div class="card-meta-row">
        <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5A4.5 4.5 0 0112.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 018 1.5z" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" stroke-width="1.4"/></svg>
        ${bank.address}
      </div>
      <div class="card-meta-row">
        <svg viewBox="0 0 16 16" fill="none"><path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" stroke-width="1.4"/><path d="M5 6h6M5 9h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        ${bank.hours}
      </div>
      <div class="card-meta-row">
        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        Updated ${bank.lastUpdated}
      </div>
    </div>

    <div class="card-actions">
      <button class="card-btn-primary" ${units === 0 ? 'disabled' : ''}
        onclick="openRequestModal(${bank.id}, '${bank.name}', '${group}', ${units})">
        ${units === 0 ? 'Not available' : 'Request blood'}
      </button>
      <button class="card-btn-secondary" onclick="callBank('${bank.phone}')">
        Call
      </button>
    </div>
  `;
  return card;
}

function callBank(phone) {
  // In mobile browser this opens the dialer
  window.location.href = `tel:${phone.replace(/\s/g, '')}`;
}


/* ═══════════════════════════════════════════
   6. SORT RESULTS
═══════════════════════════════════════════ */
function sortResults(method) {
  const group = selectedGroup;
  let sorted  = [...currentResults];

  if (method === 'availability') {
    sorted.sort((a, b) => (b.stock[group] || 0) - (a.stock[group] || 0));
  } else if (method === 'units') {
    sorted.sort((a, b) => (b.stock[group] || 0) - (a.stock[group] || 0));
  } else if (method === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';
  sorted.forEach((bank, i) => {
    const units = bank.stock[group] || 0;
    grid.appendChild(buildCard(bank, group, units, i));
  });
}


/* ═══════════════════════════════════════════
   7. ALERTS
═══════════════════════════════════════════ */
// When the "set alert" checkbox is checked, save the alert
document.getElementById('setAlertCheck').addEventListener('change', function() {
  if (!this.checked) return;
  if (!selectedGroup) return;

  const group    = selectedGroup;
  const district = document.getElementById('searchDistrict').value || 'All districts';

  // Check if alert already exists
  const exists = savedAlerts.find(a => a.group === group && a.district === district);
  if (exists) {
    alert(`Alert for ${group} in ${district} already set!`);
    return;
  }

  // ─── BACKEND: Replace with API call ─────
  // await fetch('/api/alerts', { method:'POST', body: JSON.stringify({group, district}) });
  // ─────────────────────────────────────────

  savedAlerts.push({ id: Date.now(), group, district, active: true });

  // Update badge
  document.getElementById('alertBadge').textContent = savedAlerts.filter(a => a.active).length;

  // Show confirmation
  this.parentElement.innerHTML = `
    <span style="font-size:0.85rem; color:#15803D; font-weight:600;">
      ✓ Alert set for ${group} in ${district}. You'll receive SMS when available.
    </span>`;
});

function renderAlerts() {
  const list = document.getElementById('alertsList');

  if (savedAlerts.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 48 48" fill="none" width="36" height="36"><path d="M24 6a14 14 0 0114 14c0 8-3.5 11.5-3.5 11.5H9.5S6 28 6 20A14 14 0 0124 6z" stroke="currentColor" stroke-width="2"/><path d="M19.5 38.5a4.5 4.5 0 009 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div><h3>No alerts set</h3><p>Search for blood and click "Set availability alert" to get notified.</p></div>`;
    return;
  }

  list.innerHTML = savedAlerts.map(alert => `
    <div class="alert-item" id="alertItem-${alert.id}">
      <div class="alert-group">${alert.group}</div>
      <div class="alert-info">
        <div class="alert-title">${alert.group} blood in ${alert.district}</div>
        <div class="alert-sub">SMS + Push notification when available</div>
      </div>
      <button class="alert-toggle ${alert.active ? '' : 'off'}"
        onclick="toggleAlert(${alert.id})"
        title="${alert.active ? 'Disable' : 'Enable'} alert">
      </button>
      <button class="alert-delete" onclick="deleteAlert(${alert.id})" title="Delete alert">&#10005;</button>
    </div>
  `).join('');
}

function toggleAlert(id) {
  const alert = savedAlerts.find(a => a.id === id);
  if (alert) {
    alert.active = !alert.active;
    // ─── BACKEND: PUT /api/alerts/:id { active: alert.active }
    renderAlerts();
    document.getElementById('alertBadge').textContent = savedAlerts.filter(a => a.active).length;
  }
}

function deleteAlert(id) {
  savedAlerts = savedAlerts.filter(a => a.id !== id);
  // ─── BACKEND: DELETE /api/alerts/:id
  renderAlerts();
  document.getElementById('alertBadge').textContent = savedAlerts.filter(a => a.active).length;
}


/* ═══════════════════════════════════════════
   8. REQUEST MODAL
═══════════════════════════════════════════ */
let activeModalBank = null;

function openRequestModal(bankId, bankName, group, units) {
  activeModalBank = { bankId, bankName, group, units };
  document.getElementById('modalBankName').textContent = bankName;
  document.getElementById('modalGroup').textContent    = group;
  document.getElementById('modalUnits').textContent    = `${units} unit${units !== 1 ? 's' : ''}`;
  document.getElementById('modalAlert').style.display  = 'none';
  document.getElementById('modalNote').value           = '';

  // Update units dropdown max
  const sel = document.getElementById('modalUnitsReq');
  sel.innerHTML = '';
  for (let i = 1; i <= Math.min(units, 4); i++) {
    sel.innerHTML += `<option value="${i}">${i} unit${i > 1 ? 's' : ''}</option>`;
  }

  document.getElementById('requestModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('requestModal').style.display = 'none';
  document.body.style.overflow = '';
  activeModalBank = null;
}

function submitRequest() {
  if (!activeModalBank) return;

  const units = document.getElementById('modalUnitsReq').value;
  const note  = document.getElementById('modalNote').value.trim();

  // ─── BACKEND: Replace with API call ─────
  // const res = await fetch('/api/requests', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  //   body: JSON.stringify({ bankId: activeModalBank.bankId, group: activeModalBank.group, units, note })
  // });
  // ─────────────────────────────────────────

  // Simulate success
  const alertEl = document.getElementById('modalAlert');
  alertEl.className = 'form-alert success';
  alertEl.textContent = `Request sent to ${activeModalBank.bankName} for ${units} unit(s) of ${activeModalBank.group}. They will contact you shortly.`;
  alertEl.style.display = 'block';

  // Add to requests list
  myRequests.unshift({
    id: Date.now(),
    group: activeModalBank.group,
    bank: activeModalBank.bankName,
    units: parseInt(units),
    date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    status: 'pending'
  });

  setTimeout(closeModal, 2000);
}

// Close modal on overlay click
document.getElementById('requestModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});


/* ═══════════════════════════════════════════
   9. REQUESTS SECTION
═══════════════════════════════════════════ */
function renderRequests() {
  const list = document.getElementById('requestsList');

  if (myRequests.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon"><svg viewBox="0 0 48 48" fill="none" width="36" height="36"><rect x="8" y="10" width="32" height="28" rx="4" stroke="currentColor" stroke-width="2"/><path d="M16 20h16M16 27h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div><h3>No requests yet</h3><p>Search for blood and click "Request blood" to send a request.</p></div>`;
    return;
  }

  const statusClass = { pending: 'req-pending', approved: 'req-approved', rejected: 'req-rejected' };
  const statusLabel = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };

  list.innerHTML = myRequests.map(req => `
    <div class="request-item">
      <div class="request-group">${req.group}</div>
      <div class="request-info">
        <div class="request-bank">${req.bank}</div>
        <div class="request-meta">${req.units} unit${req.units > 1 ? 's' : ''} &bull; ${req.date}</div>
      </div>
      <span class="request-status ${statusClass[req.status]}">${statusLabel[req.status]}</span>
    </div>
  `).join('');
}
