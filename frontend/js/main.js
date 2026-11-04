import { api } from './api.js';

const page = document.body.dataset.page || 'home';
const fromPages = location.pathname.includes('/pages/');
const root = document.querySelector('#app');
const path = (name) => name === 'home' ? (fromPages ? '../index.html' : './index.html') : (fromPages ? './' : './pages/') + name + '.html';
const e = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const link = (name, text, cls = '') => `<a class="${cls}" href="${path(name)}">${text}</a>`;
const dashboardFor = (user) => {
  if (user.role === "Customer") return "client";
  if (user.role === "Technician") return "technician";
  return "admin";
};
const icon = (name, size = 18) => {
  const paths = {
    tool: '<path d="M14.7 6.3a5 5 0 0 1-6.4 6.4l-4.9 4.9a2 2 0 0 0 2.8 2.8l4.9-4.9a5 5 0 0 0 6.4-6.4l-3 3-3-3 3.2-2.8Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    moon: '<path d="M20.8 14.1A9 9 0 0 1 9.9 3.2 9 9 0 1 0 20.8 14.1Z"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5m4-1v5l3 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m14-13a4 4 0 1 1 0 8m6 5v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
    logout: '<path d="M10 17l5-5-5-5m5 5H3m9-9h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
    laptop: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M2 20h20"/>',
    monitor: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6m-6 4h6"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m19.4 15 .2.2 1.5 1.2-1.5 2.6-1.9-.7a8 8 0 0 1-1.5.9l-.4 2h-3l-.4-2a8 8 0 0 1-1.5-.9l-1.9.7-1.5-2.6 1.5-1.2a8 8 0 0 1 0-1.8l-1.5-1.2 1.5-2.6 1.9.7a8 8 0 0 1 1.5-.9l.4-2h3l.4 2a8 8 0 0 1 1.5.9l1.9-.7 1.5 2.6-1.5 1.2a8 8 0 0 1 0 1.8Z"/>',
  };
  return `<svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] ?? paths.grid}</svg>`;
};
const logo = () => `
    <span class="brand-mark">
        ${icon('monitor', 20)}
    </span>
    <span>Dovhopolskiy-IT</span>`;
const themeSwitch = () => `<button class="theme-toggle" data-theme-toggle type="button" aria-label="Toggle color theme"><span class="sun-icon">${icon('sun', 17)}</span><span class="moon-icon">${icon('moon', 17)}</span></button>`;
const todayDate = (str) => { const date = new Date(str + 'T12:00:00'); return isNaN(date) ? e(str) : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date); };
const statusBadge = (status) => `<span class="badge badge-${e(status.toLowerCase().replace(/\s+/g, '-'))}"><span class="badge-dot"></span>${e(status)}</span>`;
function toast(message, error = false) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div'); el.className = 'toast' + (error ? ' toast-error' : ''); el.setAttribute('role', 'status'); el.textContent = message; document.body.append(el); setTimeout(() => el.remove(), 4500);
}
function initTheme() {
  const stored = localStorage.getItem('serwis_it_theme');
  document.documentElement.dataset.theme = stored === 'dark' ? 'dark' : 'light';
  document.addEventListener('click', ev => {
    if (!ev.target.closest('[data-theme-toggle]')) return;
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; localStorage.setItem('serwis_it_theme', next);
  });
}
function landing(user) {
  const destination = user ? dashboardFor(user) : "register";
  const topText = user
    ? icon("users", 16) + " Account"
    : "Get Started";
  const ctaText = user
    ? "Go to Dashboard"
    : "Get Started";
  return `
  <header class="site-header"><div class="container header-inner"><a class="brand" href="${path('home')}">${logo()}</a><div class="header-actions">${themeSwitch()}${link(destination, topText, 'btn btn-primary btn-sm')}</div></div></header>
  <main>
    <section class="hero" aria-labelledby="hero-title"><div class="container hero-inner">
      <span class="eyebrow"><span class="eyebrow-dot"></span>IT repair service management</span>
      <h1 id="hero-title">Your IT Repairs, Simplified.</h1>
      <p class="hero-subtitle">Submit repair requests, track progress, and stay informed — all in one simple platform.</p>
      <div class="hero-actions">${link(destination, ctaText, 'btn btn-primary')}<a class="btn btn-secondary" href="#how-it-works">How It Works</a></div>
      <div class="dashboard-preview" aria-label="Non-interactive example of the Serwis IT customer dashboard">
        <aside class="preview-sidebar"><div class="preview-brand">${logo()}</div><div class="preview-nav active">${icon('grid', 14)} Dashboard</div><div class="preview-nav">${icon('plus', 14)} New Request</div><div class="preview-nav">${icon('clipboard', 14)} My Requests</div><div class="preview-nav">${icon('history', 14)} Repair History</div></aside>
        <div class="preview-content"><div class="preview-welcome"><div><strong>Welcome back, Anna</strong><small>Here is the latest on your repair requests.</small></div><span class="preview-button">Create New Request</span></div>
        <div class="preview-stats"><div><small>Total Requests</small><b>12</b></div><div><small>New</small><b class="text-blue">2</b></div><div><small>In Progress</small><b class="text-amber">3</b></div><div><small>Completed</small><b class="text-green">7</b></div></div>
        <div class="preview-ticket">${icon('laptop', 17)}<span><strong>Laptop — screen flickering</strong><small>REQ-1042 · Sample data</small></span>${statusBadge('In Progress')}</div>
        <div class="preview-ticket">${icon('monitor', 17)}<span><strong>Desktop — will not boot</strong><small>REQ-1041 · Sample data</small></span>${statusBadge('New')}</div>
        <div class="preview-ticket">${icon('phone', 17)}<span><strong>Tablet — battery drain</strong><small>REQ-1038 · Sample data</small></span>${statusBadge('Completed')}</div>
        </div>
      </div>
    </div></section>
    <section class="section features" id="features"><div class="container"><div class="section-heading"><span class="kicker">FEATURES</span><h2>Why Choose Serwis IT?</h2><p>Everything you need to keep repair requests organized.</p></div><div class="feature-grid">
      <article class="feature-card"><div class="feature-icon">${icon('clipboard')}</div><h3>Easy Repair Requests</h3><p>Quickly describe your device issue.</p></article>
      <article class="feature-card"><div class="feature-icon">${icon('activity')}</div><h3>Real-Time Status Visibility</h3><p>Check the latest recorded repair status.</p></article>
      <article class="feature-card"><div class="feature-icon">${icon('history')}</div><h3>Repair History</h3><p>Keep your previous requests organized.</p></article>
      <article class="feature-card"><div class="feature-icon">${icon('settings')}</div><h3>Simple Management</h3><p>Convenient tools for repair technicians.</p></article>
    </div></div></section>
    <section class="section section-tinted" id="how-it-works"><div class="container"><div class="section-heading"><span class="kicker">PROCESS</span><h2>How It Works</h2><p>Three simple steps to stay on top of your repairs.</p></div><div class="steps-grid">
      <article class="step-card"><span class="step-number">01</span><div class="step-icon">${icon('users', 24)}</div><h3>Create Your Account</h3><p>Register to securely manage your repair requests.</p></article>
      <article class="step-card"><span class="step-number">02</span><div class="step-icon">${icon('plus', 24)}</div><h3>Submit a Repair Request</h3><p>Select a device type and tell us what went wrong.</p></article>
      <article class="step-card"><span class="step-number">03</span><div class="step-icon">${icon('check', 24)}</div><h3>Track Your Repair</h3><p>Follow its progress from new to completed.</p></article>
    </div></div></section>
    <section class="section"><div class="container"><div class="section-heading"><span class="kicker">DEVICES</span><h2>What We Help You Manage</h2><p>Illustrative device types you can create repair requests for.</p></div><div class="devices-grid"><div class="device-card">${icon('monitor', 25)}<strong>Desktop computers</strong></div><div class="device-card">${icon('laptop', 25)}<strong>Laptops</strong></div><div class="device-card">${icon('phone', 25)}<strong>Other electronic devices</strong></div></div></div></section>
    <section class="section section-tinted"><div class="container"><div class="section-heading"><span class="kicker"></span><h2>What Our Customers Say</h2><p>Customer reviews, they go round in circles</p></div><div class="reviews-grid"><article class="review-card"><p>“Submitting a request was straightforward, and I could see the status at a glance.”</p><div class="review-author"><span class="avatar">SK</span><span><strong>Sarah K.</strong><small></small></span></div></article><article class="review-card"><p>“The request history keeps every repair organized in one place.”</p><div class="review-author"><span class="avatar">JM</span><span><strong>James M.</strong><small></small></span></div></article><article class="review-card"><p>“The dashboard makes it easier to find which devices need attention.”</p><div class="review-author"><span class="avatar">AL</span><span><strong>Alex L.</strong><small></small></span></div></article></div></div></section>
    <section class="section"><div class="container faq-container"><div class="section-heading"><span class="kicker">FAQ</span><h2>Frequently Asked Questions</h2><p></p></div><div class="faq-list">
      <details><summary>How do I submit a repair request?</summary><p>Create an account, sign in, and choose New Request. Select your device type and describe the issue.</p></details>
      <details><summary>Can I check my repair status?</summary><p>Yes. Sign in to view whether a request is New, In Progress, or Completed.</p></details>
      <details><summary>Do I need an account?</summary><p>Yes. An account is required to submit and view your repair requests.</p></details>
      <details><summary>Can I view my previous repairs?</summary><p>Yes. The Repair History page lists your earlier requests and their statuses.</p></details>
      <details><summary>How are repair statuses updated?</summary><p>Authorized service technicians update statuses in their dashboard.</p></details>
    </div></div></section>
    <section class="section cta-section"><div class="container"><div class="cta-panel"><h2>Ready to Get Started?</h2><p>Create your account and keep your IT repair requests in one place.</p>${link(destination, user ? 'Go to Dashboard ' + icon('arrow', 17) : 'Create an Account ' + icon('arrow', 17), 'btn btn-primary')}</div></div></section>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><div class="brand">${logo()}</div><span>Simple IT repair request management.</span><span>© 2026 Dovhopolskiy-IT.</span></div></footer>`;
}
function authPage(type) {
  const register = type === 'register';
  return `<header class="site-header"><div class="container header-inner"><a class="brand" href="${path('home')}" aria-label="Back to home">${logo()}</a>${themeSwitch()}</div></header><main class="auth-outer"><div class="auth-card">
    <div class="auth-head"><span class="auth-icon">${icon(register ? 'users' : 'shield', 24)}</span><h1>${register ? 'Create your account' : 'Welcome back'}</h1><p>${register ? 'Register as a customer to submit and track your repair requests.' : 'Sign in to manage your repair requests.'}</p></div>
    <div id="form-error" class="form-error" role="alert" hidden></div>
    <form id="auth-form" class="form-stack" novalidate>
      ${register ? `<div class="form-two"><div class="field"><label for="firstName">First Name</label><input id="firstName" name="firstName" autocomplete="given-name" placeholder="Anna" required maxlength="80"></div><div class="field"><label for="lastName">Last Name</label><input id="lastName" name="lastName" autocomplete="family-name" placeholder="Kowalska" required maxlength="80"></div></div>` : ''}
      <div class="field"><label for="email">Email Address</label><input id="email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required></div>
      <div class="field"><label for="password">Password</label><div class="input-action"><input id="password" type="password" name="password" autocomplete="${register ? 'new-password' : 'current-password'}" placeholder="Enter password" minlength="8" required><button class="reveal-password" type="button" data-reveal="password">Show</button></div></div>
      ${register ? `<div class="field"><label for="confirmPassword">Confirm Password</label><div class="input-action"><input id="confirmPassword" type="password" name="confirmPassword" autocomplete="new-password" placeholder="Repeat password" minlength="8" required><button class="reveal-password" type="button" data-reveal="confirmPassword">Show</button></div></div>` : ''}
      <button class="btn btn-primary btn-full" type="submit">${register ? 'Create Account' : 'Sign In'} ${icon('arrow', 17)}</button>
    </form>
    <div id="form-success" class="success-panel" hidden></div>
    <div class="auth-foot">${register ? `Already have an account? ${link('login', 'Sign In', 'text-link')}` : `New to Serwis IT? ${link('register', 'Create an Account', 'text-link')}`}</div>
    ${!register ? `<div class="demo-info"><div class="demo-roles"><button type="button" class="btn btn-outline btn-sm" data-demo="customer@demo.test">Customer</button><button type="button" class="btn btn-outline btn-sm" data-demo="technician@demo.test">Technician</button><button type="button" class="btn btn-outline btn-sm" data-demo="admin@demo.test">Admin</button></div></div>` : ''}
  </div></main>`;
}
function navItems(role) {
  if (role === 'Customer') return [['client', 'Dashboard', 'grid'], ['new-request', 'New Request', 'plus'], ['requests', 'My Requests', 'clipboard'], ['history', 'Repair History', 'history']];
  if (role === 'Technician') return [['technician', 'Dashboard', 'grid'], ['requests', 'Repair Requests', 'clipboard']];
  return [['admin', 'Dashboard', 'grid'], ['requests', 'All Requests', 'clipboard'], ['users', 'User Management', 'users']];
}
function shell(user, content, title, subtitle = '') {
  return `<div class="app-shell"><aside class="app-sidebar" id="app-sidebar"><a class="sidebar-brand brand" href="${path('home')}" aria-label="Back to home">${logo()}</a>  <p class="sidebar-label">WORKSPACE</p><nav aria-label="Workspace navigation">${navItems(user.role).map(([key, label, ic]) => `${link(key, icon(ic, 18) + `<span>${label}</span>`, 'sidebar-link' + (page === key ? ' sidebar-link-active' : ''))}`).join('')}</nav><div class="sidebar-bottom"><div class="profile"><span class="avatar">${e(user.firstName[0] + user.lastName[0])}</span><div><strong>${e(user.firstName + ' ' + user.lastName)}</strong><small>${e(user.role)}</small></div></div><button class="sidebar-link signout" type="button" data-signout>${icon('logout', 18)} <span>Log Out</span></button></div></aside>
  <div class="app-main"><header class="app-topbar"><button type="button" class="nav-toggle" data-nav-toggle aria-label="Open navigation">${icon('menu')}</button><span class="topbar-title">Serwis IT <span class="topbar-sep">/</span> ${e(title)}</span><div class="topbar-actions">${themeSwitch()}<span class="topbar-avatar">${e(user.firstName[0] + user.lastName[0])}</span></div></header>
  <main class="workspace"><div class="page-heading"><div><h1>${e(title)}</h1>${subtitle ? `<p>${e(subtitle)}</p>` : ''}</div>${page === 'client' ? link('new-request', icon('plus', 17) + ' Create New Request', 'btn btn-primary') : ''}</div>${content}</main></div><div class="sidebar-overlay" data-nav-close></div></div>`;
}
function metrics(records, admin = false, users = []) {
  const values = [['Total Requests', records.length, 'total'], ['New', records.filter(x => x.status === 'New').length, 'new'], ['In Progress', records.filter(x => x.status === 'In Progress').length, 'progress'], ['Completed', records.filter(x => x.status === 'Completed').length, 'completed']];
  if (admin) values.unshift(['Total Users', users.length, 'total']);
  return `<div class="metric-grid ${admin ? 'metric-five' : ''}">${values.map(([label, value, kind]) => `<div class="metric-card"><span>${e(label)}</span><strong class="metric-${kind}">${value}</strong><small>${kind === 'total' ? 'Overview' : 'Repair status'}</small></div>`).join('')}</div>`;
}
function requestRows(records, users, role) {
  if (!records.length) return '<div class="empty-state">No requests found. Try a different status filter.</div>';
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Request ID</th>${role === 'Customer' ? '' : '<th>Customer</th>'}<th>Device Type</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>${records.map(r => `<tr><td><strong>${e(r.id)}</strong></td>${role === 'Customer' ? '' : `<td>${e((users.find(u => u.id === r.userId) || {}).firstName || 'Unknown')} ${e((users.find(u => u.id === r.userId) || {}).lastName || '')}</td>`}<td>${e(r.device)}</td><td>${todayDate(r.createdAt)}</td><td>${statusBadge(r.status)}</td><td>${link('request-details', 'View ' + icon('chevron', 15), 'table-link').replace('href="' + path('request-details') + '"', 'href="' + path('request-details') + '?id=' + encodeURIComponent(r.id) + '"')}</td></tr>`).join('')}</tbody></table></div>`;
}
function tableCard(records, users, role, title = 'Recent Requests', filters = false) {
  const filtersMarkup = filters ? `<div class="table-tools"><label class="search-wrap"><span class="sr-only">Search requests</span>${icon('search', 16)}<input id="request-search" type="search" placeholder="Search requests" autocomplete="off"></label><label class="filter-wrap"><span class="sr-only">Filter by status</span><select id="status-filter" aria-label="Filter requests by status"><option value="">All statuses</option><option>New</option><option>In Progress</option><option>Completed</option></select></label></div>` : '';
  return `<section class="panel"><div class="panel-header"><div><h2>${e(title)}</h2><p>${records.length} request${records.length === 1 ? '' : 's'} displayed · Sample mock data</p></div>${filtersMarkup || (role === 'Customer' ? link('requests', 'View all ' + icon('arrow', 16), 'text-link') : '')}</div><div id="requests-table">${requestRows(records, users, role)}</div></section>`;
}
function technicianDashboard(user, requests, users) {
  const statuses = ['New', 'In Progress', 'Completed'];
  const counts = `<div class="metric-grid metric-three">${statuses.map((status, i) => `<div class="metric-card"><span>${i === 0 ? 'New Requests' : e(status)}</span><strong class="metric-${['new', 'progress', 'completed'][i]}">${requests.filter(r => r.status === status).length}</strong><small>Repair status</small></div>`).join('')}</div>`;
  const chosen = requests[0]; const owner = users.find(u => u.id === chosen?.userId);
  const details = chosen ? `<section class="panel technician-detail"><div class="panel-header"><div><h2>Request Details — ${e(chosen.id)}</h2><p>${owner ? e(owner.firstName + ' ' + owner.lastName + ' · ' + owner.email) : 'Customer'} · ${e(chosen.device)}</p></div>${statusBadge(chosen.status)}</div><div class="panel-body tech-detail-grid"><div><span class="detail-label">Problem Description</span><p class="tech-description">${e(chosen.description)}</p><a class="text-link" href="${path('request-details')}?id=${encodeURIComponent(chosen.id)}">View full details ${icon('arrow', 15)}</a></div><form id="status-form" data-request-id="${e(chosen.id)}" class="status-form"><label for="status">Status</label><select id="status" name="status">${statuses.map(st => `<option ${st === chosen.status ? 'selected' : ''}>${st}</option>`).join('')}</select><button class="btn btn-primary" type="submit">Save Changes</button></form></div></section>` : '';
  return shell(user, counts + tableCard(requests.slice(0, 7), users, 'Technician', 'Repair Requests', true) + details, 'Technician Dashboard', 'Review incoming repair requests and update their status.');
}
function adminDashboard(user, requests, users) {
  const overview = metrics(requests, true, users) + tableCard(requests.slice(0, 7), users, 'Administrator', 'Requests Overview', true);
  const miniUsers = `<section class="panel users-overview"><div class="panel-header"><div><h2>User Management</h2><p>Customer and staff accounts · Sample mock data</p></div>${link('users', 'View all ' + icon('arrow', 16), 'text-link')}</div><div class="table-wrap"><table class="data-table"><thead><tr><th>User Name</th><th>Email</th><th>Role</th><th>Manage</th></tr></thead><tbody>${users.slice(0, 5).map(u => `<tr><td><strong>${e(u.firstName + ' ' + u.lastName)}</strong></td><td>${e(u.email)}</td><td><span class="role-pill">${e(u.role)}</span></td><td>${link('users', 'View', 'table-link')}</td></tr>`).join('')}</tbody></table></div></section>`;
  const placeholder = `<section class="panel admin-placeholder"><div class="panel-header"><div><h2>User Detail — placeholder</h2><p>Select a user to view their profile and available management options. Operations will be defined once backend roles and permissions are agreed.</p></div></div><div class="panel-body"><label class="field">Role (placeholder)<select disabled><option>Customer</option></select></label><button class="btn btn-secondary btn-sm" type="button" disabled>Save (disabled)</button></div></section>`;
  return shell(user, overview + miniUsers + placeholder, 'Administrator Dashboard', 'Overview of users and repair requests across the service.');
}
function roleHome(user, requests, users) {
  if (user.role === 'Technician') return technicianDashboard(user, requests, users);
  if (user.role === 'Administrator') return adminDashboard(user, requests, users);
  const records = requests.filter(r => r.userId === user.id);
  const title = 'Dashboard';
  const hero = `<section class="welcome-banner"><div><span class="welcome-kicker">YOUR WORKSPACE</span><h2>Welcome back, ${e(user.firstName)}</h2><p>Here is the latest on your repair requests.</p></div>${link('new-request', 'New Request ' + icon('arrow', 17), 'btn btn-primary')}</section>`;
  return shell(user, hero + metrics(records) + tableCard(records.slice(0, 6), users, 'Customer', 'Recent Requests'), 'Dashboard', 'Keep track of every repair in one place.');
}
function newRequestPage(user) {
  return shell(user, `<div class="form-panel panel"><div class="panel-header"><div><h2>Device Information</h2><p>Tell us what device needs attention.</p></div></div><form class="form-stack panel-body" id="request-form" novalidate><div id="form-error" class="form-error" role="alert" hidden></div><div class="field"><label for="phone">Phone Number *</label><input type="tel" id="phone" name="phone" placeholder="+48 123 456 789" autocomplete="tel" required></div><div class="field"><label for="device">Device Type</label><select id="device" name="device" required><option value="">Select a device</option><option>Laptop</option><option>Desktop</option><option>Tablet</option><option>Smartphone</option><option>Other Electronics</option></select></div><div class="field"><label for="description">Problem Description</label><textarea id="description" name="description" rows="6" placeholder="Describe the problem with your device..." required maxlength="2000" minlength="10"></textarea><small>Provide at least 10 characters to help the technician understand the issue.</small></div><div class="form-actions"><button type="submit" class="btn btn-primary">Submit Request ${icon('arrow', 17)}</button>${link('client', 'Cancel', 'btn btn-secondary')}</div></form><div id="request-success" class="success-panel panel-body" hidden></div></div>`, 'New Repair Request', 'Describe the issue and submit a service request.');
}
function requestListPage(user, requests, users) {
  const records = user.role === 'Customer' ? requests.filter(r => r.userId === user.id) : requests;
  const title = page === 'history' ? 'Repair History' : user.role === 'Customer' ? 'My Requests' : user.role === 'Technician' ? 'Repair Requests' : 'All Requests';
  return shell(user, tableCard(records, users, user.role, title, true), title, 'Search and review service requests.');
}
function detailsPage(user, requests, users) {
  const id = new URLSearchParams(location.search).get('id'); const request = requests.find(r => r.id === id && (user.role !== 'Customer' || r.userId === user.id));
  if (!request) return shell(user, `<div class="panel panel-body"><p>Request not found or access is not allowed.</p>${link(user.role === 'Customer' ? 'requests' : 'requests', 'Back to Requests', 'btn btn-secondary')}</div>`, 'Request Details');
  const customer = users.find(u => u.id === request.userId);
  const steps = ['New', 'In Progress', 'Completed']; const current = steps.indexOf(request.status);
  const statusEdit = user.role === 'Technician' ? `<div class="panel"><div class="panel-header"><div><h2>Update Repair Status</h2><p>Set the latest repair status for this request.</p></div></div><form class="panel-body status-form" id="status-form"><label for="status">Repair Status</label><div class="form-actions"><select id="status" name="status">${steps.map(s => `<option ${s === request.status ? 'selected' : ''}>${s}</option>`).join('')}</select><button class="btn btn-primary" type="submit">Save Changes</button></div></form></div>` : '';
  return shell(user, `<div class="detail-grid"><section class="panel"><div class="panel-header"><div><span class="kicker">${e(request.id)}</span><h2>${e(request.device)} Repair</h2></div>${statusBadge(request.status)}</div><div class="panel-body detail-body"><div><span class="detail-label">Problem Description</span><p>${e(request.description)}</p></div><div class="detail-pair"></div>${request.phone ? `<div><span class="detail-label">Contact Phone</span><p>${e(request.phone)}</p></div>` : ""}<div class="detail-pair"><div><span class="detail-label">Submitted</span><strong>${todayDate(request.createdAt)}</strong></div><div><span class="detail-label">Device Type</span><strong>${e(request.device)}</strong></div>${user.role !== 'Customer' ? `<div><span class="detail-label">Customer</span><strong>${e(customer ? customer.firstName + ' ' + customer.lastName : 'Unknown')}</strong></div>` : ''}</div><hr><h3>Repair Progress</h3><div class="progress-steps">${steps.map((s, i) => `<div class="progress-step ${i <= current ? 'progress-step-active' : ''}"><span class="progress-circle">${i < current ? icon('check', 15) : i + 1}</span><strong>${s}</strong></div>`).join('')}</div></div></section>${statusEdit}</div><div class="under-panel">${link('requests', '← Back to Requests', 'text-link')}</div>`, 'Request Details', 'Review the information and latest repair status.');
}
function usersPage(user, users) { return shell(user, `<section class="panel"><div class="panel-header"><div><h2>All Users</h2><p></p></div><span class="count-pill">${users.length} users</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>${users.map(u => `<tr><td><strong>${e(u.firstName)} ${e(u.lastName)}</strong></td><td>${e(u.email)}</td><td><span class="role-pill">${e(u.role)}</span></td></tr>`).join('')}</tbody></table></div></section><p class="helper-note">Editing, deleting users and role assignment require backend authorization rules. This demo shows a read-only user list.</p>`, 'User Management', 'View the application accounts.'); }
function showError(message) { const el = document.getElementById('form-error'); if (el) { el.textContent = message; el.hidden = false; } else toast(message, true); }
function hookAuth(type) {
  document.querySelectorAll('[data-reveal]').forEach(btn => btn.addEventListener('click', () => { const inp = document.getElementById(btn.dataset.reveal); inp.type = inp.type === 'password' ? 'text' : 'password'; btn.textContent = inp.type === 'password' ? 'Show' : 'Hide'; }));
  document.querySelectorAll('[data-demo]').forEach(btn => btn.addEventListener('click', () => { document.getElementById('email').value = btn.dataset.demo; document.getElementById('password').value = 'demo12345'; }));
  document.querySelector('#auth-form')?.addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form));
    document.getElementById('form-error').hidden = true;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    try {
      if (type === 'register') {
        if (values.password !== values.confirmPassword) throw new Error('Passwords do not match.');
        await api.register(values);
        form.hidden = true;
        const success = document.getElementById('form-success'); success.hidden = false;
        success.innerHTML = `<span class="success-icon">${icon('check', 24)}</span><h2>Account created</h2><p>Your customer account is ready. Sign in to continue.</p>${link('login', 'Go to Sign In ' + icon('arrow', 17), 'btn btn-primary')}`;
      } else {
        const user = await api.signIn(values.email, values.password);
        location.href = path(user.role === 'Customer' ? 'client' : user.role === 'Technician' ? 'technician' : 'admin');
      }
    } catch (err) { showError(err.message); }
  });
}
function hookWorkspace(user, requests, users) {
  document.querySelector('[data-signout]')?.addEventListener('click', async () => { await api.signOut(); location.href = path('login'); });
  document.querySelector('[data-nav-toggle]')?.addEventListener('click', () => document.body.classList.add('nav-open'));
  document.querySelector('[data-nav-close]')?.addEventListener('click', () => document.body.classList.remove('nav-open'));
  const filter = document.querySelector('#status-filter');
  const search = document.querySelector('#request-search');
  if (filter || search) {
    const records = user.role === 'Customer' ? requests.filter(r => r.userId === user.id) : requests;
    const refresh = () => {
      const query = (search?.value || '').trim().toLowerCase();
      const matching = records.filter(r => {
        const owner = users.find(u => u.id === r.userId);
        const values = [r.id, r.device, r.status, r.description, owner?.firstName, owner?.lastName].join(' ').toLowerCase();
        return (!filter?.value || r.status === filter.value) && values.includes(query);
      });
      document.getElementById('requests-table').innerHTML = requestRows(matching, users, user.role);
    };
    filter?.addEventListener('change', refresh);
    search?.addEventListener('input', refresh);
  }
  document.querySelector('#request-form')?.addEventListener('submit', async event => {

    event.preventDefault();

    const form = event.currentTarget;

    const phoneInput = form.elements.namedItem("phone");

    const phone = phoneInput.value.trim();

    const digits = phone.replace(/\D/g, "");

    const validFormat = /^\+?[0-9 ()-]+$/.test(phone);

    const validPhone =
      validFormat &&
      digits.length >= 7 &&
      digits.length <= 15;

    phoneInput.setCustomValidity(
      validPhone ? "" : "Enter a valid phone number (7–15 digits)."
    );

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const values = Object.fromEntries(new FormData(form));
    try {
      const record = await api.createRequest(user, values.device, values.description, phone); form.hidden = true; const success = document.querySelector('#request-success'); success.hidden = false; success.innerHTML = `<span class="success-icon">${icon('check', 24)}</span><h2>Request submitted</h2><p>Your request <strong>${e(record.id)}</strong> was created successfully.</p><div class="form-actions">${link('request-details', 'View Request ' + icon('arrow', 17), 'btn btn-primary').replace('href="' + path('request-details') + '"', 'href="' + path('request-details') + '?id=' + encodeURIComponent(record.id) + '"')}${link('client', 'Dashboard', 'btn btn-secondary')}</div>`;
    } catch (err) { showError(err.message); }
  });
  document.querySelector('#status-form')?.addEventListener('submit', async event => {
    event.preventDefault(); try { await api.updateRequest(event.currentTarget.dataset.requestId || new URLSearchParams(location.search).get('id'), document.querySelector('#status').value); toast('Repair status updated.'); setTimeout(() => location.reload(), 500); } catch (err) { toast(err.message, true); }
  });
}
async function run() {
  initTheme();
  if (page === "home") { const user = await api.getCurrentUser(); root.innerHTML = landing(user); return; }
  if (page === 'register' || page === 'login') { root.innerHTML = authPage(page); hookAuth(page); return; }
  let user; try { user = await api.getCurrentUser(); } catch (err) { root.innerHTML = '<p class="fatal-error">' + e(err.message) + '</p>'; return; }
  if (!user) { location.replace(path('login')); return; }
  const requiredRole = { client: 'Customer', 'new-request': 'Customer', history: 'Customer', technician: 'Technician', admin: 'Administrator', users: 'Administrator' }[page];
  if (requiredRole && user.role !== requiredRole) { location.replace(path(user.role === 'Customer' ? 'client' : user.role === 'Technician' ? 'technician' : 'admin')); return; }
  const [requests, users] = await Promise.all([api.getRequests(), api.getUsers()]);
  if (['client', 'technician', 'admin'].includes(page)) root.innerHTML = roleHome(user, requests, users);
  else if (page === 'new-request') root.innerHTML = newRequestPage(user);
  else if (page === 'requests' || page === 'history') root.innerHTML = requestListPage(user, requests, users);
  else if (page === 'request-details') root.innerHTML = detailsPage(user, requests, users);
  else if (page === 'users') root.innerHTML = usersPage(user, users);
  hookWorkspace(user, requests, users);
}
run().catch(err => { root.textContent = 'Unable to load page: ' + err.message; });
