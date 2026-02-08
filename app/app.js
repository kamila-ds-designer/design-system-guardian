/**
 * Guardian — Design System Documentation & QA
 * Single-page app with hash routing
 */

import { COMPONENT_DOCS } from './component-docs.js';
import { AUDIT_ISSUES, EXPANDED_DETAILS } from './audit-data.js';

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;

// State
const state = {
  mode: 'docs', // 'docs' | 'qa'
  link: '',
  configComplete: false,
  sourceOfTruth: ['Accessibility standards.md', 'Modal', 'Button', 'Foundation'],
  onboardingStep: 0,
  showOnboarding: true,
  currentDoc: null,
  auditResults: null,
  theme: 'light', // 'light' | 'dark'
  auditFixedIds: [], // ids of issues user clicked Auto-fix on
  auditExpandedId: null, // id of expanded row
};

const ONBOARDING_STEPS = [
  { title: 'Welcome to DS Guardian', text: 'Guardian generates component docs in seconds, then catches UI violations before they ship.', primaryBtn: 'Get Started' },
  { title: 'New component created', text: 'Add a new design component to DS guardian', primaryBtn: 'Next' },
  { title: 'Document Generation', text: 'Guardian instantly generates technical as well as contextual documentation. Then, You review and publish it in one click - to Storybook, GitHub, or Figma.', primaryBtn: 'Next' },
  { title: 'Enforcement', text: 'Paste a Figma screen or GitHub UI link, and Guardian checks it against your documented system. It flags: incorrect component usage, token drift (padding, radius, color), accessibility gaps. With visual annotations and direct fix links.', primaryBtn: 'Next' },
  { title: 'Test + Auto-fix', text: "Guardian doesn't just report issues — it helps resolve them. See violations highlighted directly on the UI. Click Auto-Fix for safe corrections. Ship faster with less design debt.", primaryBtn: 'Configure' },
];

function getStorage(key, def = null) {
  try {
    const v = localStorage.getItem('guardian:' + key);
    return v ? JSON.parse(v) : def;
  } catch { return def; }
}
function setStorage(key, val) {
  localStorage.setItem('guardian:' + key, JSON.stringify(val));
}

// Router
function getRoute() {
  const hash = (location.hash.slice(1) || '/').replace(/^\/+|\/+$/g, '');
  const parts = hash ? hash.split('/') : [];
  const path = parts[0] || 'start';
  return { path, params: parts.slice(1) };
}

// Render helpers
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') e.className = v;
    else if (k === 'onclick') e.onclick = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'innerHTML') e.innerHTML = v;
    else if (v != null) e.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

function Header() {
  const logo = el('a', { href: '#/start', className: 'app-logo', style: 'text-decoration:none;color:inherit', onclick: (e) => { e.preventDefault(); navigate('/start'); } });
  logo.innerHTML = LOGO_SVG + ' Guardian';
  const themeBtn = el('button', { className: 'btn btn-ghost', onclick: toggleTheme, title: 'Toggle theme' });
  themeBtn.textContent = state.theme === 'dark' ? 'Dark' : 'Light';
  const settingsBtn = el('button', { className: 'btn btn-ghost', onclick: () => navigate('/config'), title: 'Settings' });
  settingsBtn.textContent = 'Settings';
  return el('header', { className: 'app-header' },
    logo,
    el('div', { style: 'display:flex;gap:0.25rem' }, themeBtn, settingsBtn)
  );
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  setStorage('theme', state.theme);
  render();
}

const DOC_COMPONENTS = ['button', 'input', 'tag', 'chips'];

function Sidebar(route) {
  const docsActive = route.path === 'docs' || route.path === 'doc-view';
  const qaActive = route.path === 'qa' || route.path === 'audit-results' || route.path === 'audit-loading';
  const activeId = route.path === 'doc-view' ? (route.params[0] || 'button') : null;
  return el('aside', { className: 'app-sidebar' },
    el('button', { className: 'btn btn-primary', style: 'width:100%', onclick: () => navigate('/docs') }, 'New'),
    el('button', { className: 'btn btn-primary', style: 'width:100%', onclick: () => navigate('/qa') }, 'New Test'),
    el('div', { className: 'sidebar-section' }, 'Doc Files'),
    ...DOC_COMPONENTS.map(id => {
      const doc = COMPONENT_DOCS[id];
      const name = doc ? doc.name : id;
      const isActive = activeId === id;
      return el('a', { className: 'sidebar-item' + (isActive ? ' active' : ''), href: `#/doc-view/${id}`, onclick: (e) => { e.preventDefault(); navigate(`/doc-view/${id}`); } }, '<> ', name);
    }),
    el('a', { className: 'sidebar-item' + (docsActive && !activeId ? ' active' : ''), href: '#/docs', onclick: (e) => { e.preventDefault(); navigate('/docs'); } }, 'All generated documents'),
    el('div', { className: 'sidebar-section' }, 'Test Audits'),
    el('a', { className: 'sidebar-item' + (qaActive ? ' active' : ''), href: '#/qa', onclick: (e) => { e.preventDefault(); navigate('/qa'); } }, 'QA audit'),
    el('div', { className: 'sidebar-section' }, 'More'),
    el('a', { className: 'sidebar-item' + (route.path === 'contact' ? ' active' : ''), href: '#/contact', onclick: (e) => { e.preventDefault(); navigate('/contact'); } }, 'Contact')
  );
}

// Screens
function StartScreen() {
  const container = el('div', { className: 'centered-screen' });
  const mode = state.mode || 'docs';
  const headline = mode === 'docs' ? 'What new component do you need doc for?' : 'What new UI do you want to test for?';
  const subhead = mode === 'docs'
    ? 'Generate design system documentation or QA UI screens with contextual fixes.'
    : 'Paste the design link and DS Guardian will test against your Documentation';

  const inputEl = el('input', { className: 'input', placeholder: 'Paste a Figma component, or GitHub link...', style: 'min-width:24rem' });
  inputEl.value = state.link;

  container.appendChild(el('div', { innerHTML: LOGO_SVG, style: 'margin-bottom:1rem' }));
  container.appendChild(el('h1', {}, 'Guardian'));

  const tg = el('div', { className: 'toggle-group' });
  const btnDocs = el('button', { className: 'btn ' + (mode === 'docs' ? 'active' : ''), onclick: () => { state.mode = 'docs'; render(); } }, 'Docs Generator');
  const btnQA = el('button', { className: 'btn ' + (mode === 'qa' ? 'active' : ''), onclick: () => { state.mode = 'qa'; render(); } }, 'QA Checker');
  tg.appendChild(btnDocs);
  tg.appendChild(btnQA);

  container.appendChild(tg);
  container.appendChild(el('h2', { style: 'font-size:1.25rem;margin:1.5rem 0 0.5rem' }, headline));
  container.appendChild(el('p', { style: 'margin-bottom:1rem' }, subhead));

  if (!state.configComplete) {
    const alert = el('div', { className: 'alert' });
    alert.innerHTML = `<span style="font-weight:600">i</span><div><strong>Configuration Settings needed</strong><br>First, set up your documentation templates and input your credentials.</div>`;
    const cfgBtn = el('button', { className: 'btn btn-primary', style: 'margin-left:auto', onclick: () => navigate('/config') }, 'Configure');
    alert.appendChild(cfgBtn);
    container.appendChild(alert);
  }

  const inputGroup = el('div', { className: 'input-group', style: 'margin-top:1rem' });
  inputGroup.appendChild(inputEl);
  const analyzeBtn = el('button', { className: 'btn btn-primary', onclick: () => runAnalysis(inputEl.value) }, 'Analyze →');
  inputGroup.appendChild(analyzeBtn);
  container.appendChild(inputGroup);

  inputEl.addEventListener('input', () => { state.link = inputEl.value; });
  return container;
}

function runAnalysis(link) {
  if (!link?.trim()) return;
  state.link = link.trim();
  if (state.mode === 'docs') {
    navigate('/docs-loading');
    setTimeout(() => navigate('/doc-view/button'), 3500);
  } else {
    navigate('/audit-loading');
    setTimeout(() => navigate('/audit-results'), 4500);
  }
}

let configTab = 'documentation';
function ConfigScreen() {
  const container = el('div', {});

  const gearIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  const titleEl = el('h1', { style: 'display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem' });
  titleEl.innerHTML = gearIcon + ' Configuration Settings';
  container.appendChild(titleEl);
  container.appendChild(el('p', { style: 'margin-bottom:1.5rem;color:hsl(var(--muted-foreground))' }, 'Manage your DS Guardian configuration and API integrations'));

  const tabs = el('div', { className: 'tabs' });
  ['Documentation', 'Claude API', 'Figma'].forEach(t => {
    const key = t.toLowerCase().replace(' ', '-');
    const isActive = configTab === key;
    tabs.appendChild(el('button', { className: 'tab' + (isActive ? ' active' : ''), onclick: () => { configTab = key; render(); } }, t));
  });
  container.appendChild(tabs);

  if (configTab === 'documentation') {
    const card = el('div', { className: 'card' });
    card.innerHTML = `
      <h3 style="margin-bottom:0.5rem">Documentation Template & Guidelines</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem">Upload your documentation template or provide context to guide AI generation</p>
      <input type="file" id="doc-file-input" multiple accept=".md,.txt,.pdf,.doc,.docx" style="display:none">
      <div class="upload-zone" id="doc-upload-zone" style="margin-bottom:1rem">
        <p style="margin:0;font-size:1.5rem">↑</p>
        <p style="margin:0.25rem 0 0">Click to upload or drag and drop</p>
        <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin:0.25rem 0 0">MD, TXT, PDF, DOC (max. 10MB)</p>
      </div>
      <p style="text-align:center;margin:0.5rem 0">OR</p>
      <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Paste Guidelines / Context</label>
      <textarea class="input" rows="4" placeholder="Enter your documentation guidelines, style guide, or any context that will help generate better documentation..."></textarea>
      <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin:0.25rem 0 0">Example: "Use sentence case for headings, include accessibility notes, focus on developer experience"</p>
      <button class="btn btn-primary" style="margin-top:1rem">Save Documentation Settings</button>
    `;
    container.appendChild(card);
    const uploadZone = card.querySelector('#doc-upload-zone');
    const fileInput = card.querySelector('#doc-file-input');
    if (uploadZone && fileInput) {
      uploadZone.onclick = () => fileInput.click();
      uploadZone.ondragover = (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); };
      uploadZone.ondragleave = () => uploadZone.classList.remove('dragover');
      uploadZone.ondrop = (e) => { e.preventDefault(); uploadZone.classList.remove('dragover'); };
    }
  } else if (configTab === 'claude-api') {
    const card = el('div', { className: 'card' });
    card.innerHTML = `
      <h3 style="margin-bottom:0.5rem">Claude API Credentials</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem">Configure your Claude API for AI-powered documentation generation.</p>
      <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">API Key</label>
      <input type="password" class="input" placeholder="sk-ant-..." style="margin-bottom:1rem">
      <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Model</label>
      <select class="input" style="margin-bottom:0.5rem"><option>Claude 3.5 Sonnet (Latest)</option></select>
      <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin-bottom:1rem">Recommended: Claude 3.5 Sonnet for best documentation quality</p>
      <div style="background:hsl(var(--muted));padding:0.75rem;border-radius:var(--radius);margin-bottom:1rem">
        <strong>How to get your API key</strong>
        <ul style="margin:0.5rem 0 0 1rem;padding:0">
          <li>Go to console.anthropic.com</li>
          <li>Navigate to API Keys section</li>
          <li>Create a new API key</li>
          <li>Copy and paste it above</li>
        </ul>
        <a href="https://console.anthropic.com" target="_blank" rel="noopener" style="color:hsl(217 91% 60%);margin-top:0.5rem;display:inline-block">Open Anthropic Console →</a>
      </div>
      <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin-bottom:1rem">Your API key is stored securely and only used to generate documentation</p>
      <button class="btn btn-secondary">Save Claude Settings</button>
    `;
    container.appendChild(card);
  } else {
    const card = el('div', { className: 'card' });
    card.innerHTML = `
      <h3 style="margin-bottom:0.5rem">Figma Access Token</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem">Connect to Figma to analyze and document design system components</p>
      <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Personal Access Token</label>
      <input type="password" class="input" placeholder="figd_..." style="margin-bottom:1rem">
      <div style="background:hsl(var(--muted));padding:0.75rem;border-radius:var(--radius);margin-bottom:1rem">
        <strong>How to get your access token:</strong>
        <ul style="margin:0.5rem 0 0 1rem;padding:0">
          <li>Go to Figma Settings → Account</li>
          <li>Scroll to Personal Access Tokens</li>
          <li>Click "Create a new personal access token"</li>
          <li>Copy and paste it above</li>
        </ul>
        <a href="https://www.figma.com/settings" target="_blank" rel="noopener" style="color:hsl(217 91% 60%);margin-top:0.5rem;display:inline-block">Open Figma Settings →</a>
      </div>
      <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin-bottom:1rem">Your token is encrypted and used only to access your Figma files</p>
      <button class="btn btn-primary">Save Figma Settings</button>
    `;
    container.appendChild(card);
  }

  const welcome = el('div', { className: 'alert', style: 'margin-top:1rem' });
  welcome.innerHTML = `
    <span style="font-weight:600">i</span>
    <div>
      <strong>Welcome to DS Guardian!</strong><br>
      It looks like this is your first time using DS Guardian. To get started, you'll need to configure your Claude API and Figma access token. These settings will help DS Guardian generate high-quality documentation and analyze your design system components.
    </div>
  `;
  container.appendChild(welcome);

  const nav = el('div', { style: 'display:flex;justify-content:space-between;margin-top:1.5rem' });
  if (configTab === 'documentation') {
    nav.appendChild(el('button', { className: 'btn btn-secondary', onclick: () => navigate('/start') }, 'Cancel'));
    nav.appendChild(el('button', { className: 'btn btn-primary', onclick: () => { configTab = 'claude-api'; render(); } }, 'next'));
  } else if (configTab === 'claude-api') {
    nav.appendChild(el('button', { className: 'btn btn-secondary', onclick: () => { configTab = 'documentation'; render(); } }, 'previous'));
    nav.appendChild(el('button', { className: 'btn btn-primary', onclick: () => { configTab = 'figma'; render(); } }, 'next'));
  } else {
    nav.appendChild(el('button', { className: 'btn btn-secondary', onclick: () => { configTab = 'claude-api'; render(); } }, 'previous'));
    nav.appendChild(el('button', { className: 'btn btn-primary', onclick: () => { state.configComplete = true; setStorage('configComplete', true); navigate('/start'); } }, 'save & exit'));
  }
  container.appendChild(nav);

  return container;
}

const LOADING_ILLUSTRATION = `<svg width="180" height="140" viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="load1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#a78bfa"/><stop offset="100%" style="stop-color:#f97316"/></linearGradient></defs><ellipse cx="90" cy="70" rx="50" ry="25" fill="url(#load1)" opacity="0.4"/><rect x="55" y="50" width="70" height="40" rx="4" fill="url(#load1)" opacity="0.6"/><path d="M70 60 L95 60 M70 68 L110 68 M70 76 L90 76" stroke="white" stroke-width="1.5" opacity="0.8"/></svg>`;

function DocsLoadingScreen() {
  const steps = ['Fetching design file...', 'Extracting UI components...', 'Running QA checks...', 'Generating report...'];
  const container = el('div', { className: 'centered-screen' });
  container.innerHTML = `
    <div style="margin-bottom:1.5rem">${LOADING_ILLUSTRATION}</div>
    <h1>Analyzing your design</h1>
    <p style="color:hsl(var(--muted-foreground));margin-bottom:1.5rem">This may take a few moments while we check your UI against documentation standards</p>
  `;
  const stepsEl = el('div', { style: 'max-width:24rem;margin:0 auto 1.5rem' });
  steps.forEach((s, i) => {
    const step = el('div', { className: 'progress-step' + (i < 2 ? (i === 1 ? ' active' : ' done') : '') });
    step.innerHTML = `<span>${i < 1 ? '✓' : i === 1 ? '⟳' : '○'}</span><span>${s}</span>`;
    stepsEl.appendChild(step);
  });
  container.appendChild(stepsEl);
  container.appendChild(el('button', { className: 'btn btn-secondary', onclick: () => navigate('/start') }, 'Cancel Analysis'));
  return container;
}

function AuditLoadingScreen() {
  const container = el('div', { className: 'centered-screen' });
  container.innerHTML = `
    <div style="margin-bottom:1.5rem">${LOADING_ILLUSTRATION}</div>
    <h1>Analyzing your design</h1>
    <p style="color:hsl(var(--muted-foreground));margin-bottom:1.5rem">This may take a few moments while we check your UI against documentation standards</p>
  `;
  const steps = ['Fetching design file...', 'Extracting UI components...', 'Running QA checks...', 'Generating report...'];
  const stepsEl = el('div', { style: 'max-width:24rem;margin:0 auto 1.5rem' });
  steps.forEach((s, i) => {
    const step = el('div', { className: 'progress-step' + (i < 2 ? (i === 1 ? ' active' : ' done') : '') });
    step.innerHTML = `<span>${i < 1 ? '✓' : i === 1 ? '⟳' : '○'}</span><span>${s}</span>`;
    stepsEl.appendChild(step);
  });
  container.appendChild(stepsEl);
  container.appendChild(el('button', { className: 'btn btn-secondary', onclick: () => navigate('/qa') }, 'Cancel Analysis'));
  return container;
}

function QAScreen() {
  const container = el('div', {});
  container.appendChild(el('h1', { style: 'margin-bottom:0.25rem' }, 'See a Live Audit'));
  container.appendChild(el('p', { style: 'color:hsl(var(--muted-foreground));margin-bottom:1.5rem' }, "Upload a team member's design and instantly see where it doesn't match your system"));

  const uploadCard = el('div', { className: 'card', style: 'margin-bottom:1.5rem' });
  uploadCard.innerHTML = `
    <h3 style="margin-bottom:0.5rem">Uploads Designs</h3>
    <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem">Your designers and developers upload their work to check if it matches the system.</p>
    <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Add link</label>
    <input class="input" placeholder="https://www.figma.com/design/..." value="${state.link || ''}">
    <div style="margin-top:1rem">
      <h4 style="margin-bottom:0.5rem;font-size:0.875rem">Your Source of Truth</h4>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:0.5rem">This is your Guardians source of truth. Any design you upload will be compared to these gold copy documents. You can choose as many files as you wish</p>
      <div id="source-tags" style="display:flex;flex-wrap:wrap;gap:0.5rem"></div>
    </div>
    <div style="margin-top:1rem">
      <h4 style="margin-bottom:0.5rem;font-size:0.875rem">Guardian will check for:</h4>
      <ul style="margin:0;padding-left:1.25rem;color:hsl(var(--muted-foreground));font-size:0.875rem">
        <li>Components that don't match your Storybook specs</li>
        <li>Colors and spacing not using your tokens</li>
        <li>Missing states (hover, focus, disabled)</li>
        <li>Accessibility violations (contrast, labels)</li>
      </ul>
    </div>
  `;
  container.appendChild(uploadCard);

  const tagsEl = uploadCard.querySelector('#source-tags');
  state.sourceOfTruth.forEach(t => {
    const chip = el('span', { className: 'chip', style: 'margin-right:0;margin-bottom:0' });
    chip.innerHTML = `${t} <span class="remove">×</span>`;
    chip.querySelector('.remove').onclick = () => { state.sourceOfTruth = state.sourceOfTruth.filter(x => x !== t); render(); };
    tagsEl.appendChild(chip);
  });

  const input = uploadCard.querySelector('input');
  input.addEventListener('input', () => { state.link = input.value; });
  container.appendChild(el('button', { className: 'btn btn-primary', style: 'width:100%;max-width:16rem;margin-top:0.5rem', onclick: () => runAnalysis(input.value) }, 'Run Audit'));

  return container;
}

function AuditResultsScreen() {
  const unfixedCount = AUDIT_ISSUES.filter(i => !state.auditFixedIds.includes(i.id)).length;
  const container = el('div', { className: 'audit-results' });

  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom:1.5rem">
      <div class="stat-card"><div class="value">7</div><div class="label">Violations Found</div></div>
      <div class="stat-card"><div class="value">3</div><div class="label">High Severity</div></div>
      <div class="stat-card"><div class="value">2</div><div class="label">Medium Severity</div></div>
      <div class="stat-card"><div class="value">2</div><div class="label">Low Severity</div></div>
    </div>

    <div class="card audit-preview-card" style="margin-bottom:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h3 style="margin:0">Visual Preview</h3>
        <button class="btn btn-primary" id="audit-auto-fix-all" ${unfixedCount === 0 ? 'disabled' : ''}>${unfixedCount === 0 ? 'All Fixed' : `Auto-fix All (${unfixedCount})`}</button>
      </div>
      <div class="audit-preview-area" id="audit-preview">
        <div class="audit-product-card" data-element="card">
          <div class="audit-product-image">
            <span class="audit-badge audit-badge-sale" data-element="badge">-25%</span>
            <span class="audit-badge audit-badge-new" data-element="badge">Neu</span>
            <span class="audit-favorite" data-element="favorite">&#9829;</span>
            <div class="audit-bike-placeholder"></div>
          </div>
          <div class="audit-product-dots">
            <span class="audit-dot"></span><span class="audit-dot audit-dot-active"></span>
          </div>
          <div class="audit-product-info">
            <span class="audit-category">City</span>
            <span class="audit-product-title" data-element="product-title" id="preview-product-title">FALTER C 3.0 Comfort</span>
            <span class="audit-price">ab 55,12 € mtl.</span>
            <span class="audit-price-old">1.500,00 €</span>
            <span class="audit-price-new">1.000,00 €</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:1.5rem">
      <h3 style="margin:0 0 1rem">Issues Report</h3>
      <div id="audit-issues-table"></div>
    </div>

    <div class="audit-ready-banner card" style="margin-bottom:1.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <div style="display:flex;align-items:center;gap:0.5rem">
          <span style="color:hsl(142 76% 36%);font-size:1.25rem">&#10003;</span>
          <span style="font-weight:500">Ready to fix these violations? Export this report or integrate with your workflow tools.</span>
        </div>
        <div style="display:flex;gap:0.5rem">
          <button class="btn btn-primary">Create Jira Tickets</button>
          <button class="btn btn-primary">Create GitHub Issues</button>
        </div>
      </div>
    </div>
  `;

  const issuesTable = container.querySelector('#audit-issues-table');
  const contextIssues = AUDIT_ISSUES.filter(i => i.category === 'Context');
  const technicalIssues = AUDIT_ISSUES.filter(i => i.category === 'Technical');

  function renderIssueRow(issue) {
    const isFixed = state.auditFixedIds.includes(issue.id);
    const isExpanded = state.auditExpandedId === issue.id;
    const severityClass = issue.severity === 'critical' ? 'badge-critical' : issue.severity === 'medium' ? 'badge-medium' : 'badge-low';
    const details = issue.details;
    const expandedData = EXPANDED_DETAILS[issue.id];

    let rowHtml = `
      <tr class="audit-row" data-issue-id="${issue.id}" data-element-id="${issue.elementId}">
        <td>${issue.type}</td>
        <td><span class="badge ${severityClass}">${issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}</span></td>
        <td>${issue.issue}</td>
        <td>${issue.expected}</td>
        <td>
          <button class="btn btn-ghost audit-auto-fix-btn" style="padding:0.25rem 0.5rem" data-issue-id="${issue.id}" ${isFixed ? 'disabled' : ''}>${isFixed ? 'Fixed' : 'Auto-fix'}</button>
          <button class="btn btn-ghost audit-expand-btn" style="padding:0.25rem 0.5rem" data-issue-id="${issue.id}">View correct usage ${isExpanded ? '&#9650;' : '&#9660;'}</button>
        </td>
      </tr>
    `;
    if (isExpanded && (details || expandedData)) {
      rowHtml += `<tr class="audit-expanded-row"><td colspan="5" class="audit-expanded-cell">`;
      if (details) {
        rowHtml += `<ul class="audit-details-list">${details.map(d => `<li><span style="color:hsl(0 84% 60%)">&#215;</span> ${d}</li>`).join('')}</ul>`;
      }
      if (expandedData) {
        rowHtml += `
          <div class="audit-expanded-section">
            <h4 style="margin:0.5rem 0 0.25rem;display:flex;align-items:center;gap:0.5rem">How to Fix in Figma</h4>
            <p style="margin:0;font-size:0.875rem;color:hsl(var(--muted-foreground))">${expandedData.figmaInstruction}</p>
            <p style="margin:0.5rem 0 0.25rem;font-size:0.875rem"><strong>Figma Resources:</strong> <a href="#">${expandedData.figmaLink}</a></p>
            <div style="display:flex;gap:0.5rem;margin-top:0.5rem">
              <button class="btn btn-secondary" style="font-size:0.8rem">${expandedData.quickActions[0]}</button>
              <button class="btn btn-secondary" style="font-size:0.8rem">${expandedData.quickActions[1]}</button>
            </div>
          </div>
          <div class="audit-expanded-section" style="margin-top:1rem">
            <h4 style="margin:0 0 0.5rem;font-size:0.875rem">Correct Implementation</h4>
            <pre class="doc-code" style="margin:0;padding:0.75rem"><code>${expandedData.codeExample}</code></pre>
          </div>
        `;
      }
      rowHtml += `</td></tr>`;
    }
    return rowHtml;
  }

  let tableHtml = '';
  if (contextIssues.length) {
    tableHtml += `<h4 style="margin:0 0 0.5rem;font-size:0.875rem;color:hsl(var(--muted-foreground))">Context</h4>`;
    tableHtml += `<table class="table audit-table"><thead><tr><th>Issue Type</th><th>Severity</th><th>Issue</th><th>Expected</th><th>Action</th></tr></thead><tbody>`;
    contextIssues.forEach(i => { tableHtml += renderIssueRow(i); });
    tableHtml += `</tbody></table>`;
  }
  if (technicalIssues.length) {
    tableHtml += `<h4 style="margin:1rem 0 0.5rem;font-size:0.875rem;color:hsl(var(--muted-foreground))">Technical</h4>`;
    tableHtml += `<table class="table audit-table"><thead><tr><th>Issue Type</th><th>Severity</th><th>Issue</th><th>Expected</th><th>Action</th></tr></thead><tbody>`;
    technicalIssues.forEach(i => { tableHtml += renderIssueRow(i); });
    tableHtml += `</tbody></table>`;
  }
  issuesTable.innerHTML = tableHtml;

  const preview = container.querySelector('#audit-preview');

  container.querySelectorAll('.audit-row').forEach(tr => {
    const elementId = tr.dataset.elementId;
    tr.addEventListener('mouseenter', () => {
      tr.classList.add('audit-row-hovered');
      preview?.querySelectorAll(`[data-element="${elementId}"]`).forEach(el => el.classList.add('audit-highlight'));
    });
    tr.addEventListener('mouseleave', () => {
      tr.classList.remove('audit-row-hovered');
      preview?.querySelectorAll(`[data-element="${elementId}"]`).forEach(el => el.classList.remove('audit-highlight'));
    });
  });

  container.querySelectorAll('.audit-auto-fix-btn').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.target.dataset.issueId;
      if (!state.auditFixedIds.includes(id)) {
        state.auditFixedIds.push(id);
        render();
      }
    };
  });

  container.querySelectorAll('.audit-expand-btn').forEach(btn => {
    btn.onclick = (e) => {
      const id = e.target.dataset.issueId;
      state.auditExpandedId = state.auditExpandedId === id ? null : id;
      render();
    };
  });

  const autoFixAllBtn = container.querySelector('#audit-auto-fix-all');
  if (autoFixAllBtn) {
    autoFixAllBtn.onclick = () => {
      AUDIT_ISSUES.forEach(i => { if (!state.auditFixedIds.includes(i.id)) state.auditFixedIds.push(i.id); });
      render();
    };
  }

  return container;
}

function DocViewScreen(componentId) {
  const doc = COMPONENT_DOCS[componentId] || COMPONENT_DOCS.button;
  const container = el('div', { className: 'doc-view' });

  const metaList = doc.meta.map(m => `<p style="margin:0.25rem 0;color:hsl(var(--muted-foreground));font-size:0.875rem">${m}</p>`).join('');
  const whenToUse = doc.whenToUse.map(u => `<li style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.25rem"><span style="color:hsl(142 76% 36%);flex-shrink:0">✓</span><span>${u}</span></li>`).join('');
  const whenNotToUse = doc.whenNotToUse.map(u => `<li style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.25rem"><span style="color:hsl(0 84% 60%);flex-shrink:0">✗</span><span>${u}</span></li>`).join('');
  const alternatives = doc.alternatives.map(a => `<li style="margin-bottom:0.25rem">${a}</li>`).join('');
  const mistakes = doc.mistakes.map(m => `<li style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.25rem"><span style="color:hsl(0 84% 60%);flex-shrink:0">✗</span><span>${m}</span></li>`).join('');
  const accessibility = doc.accessibility.map(a => `<li style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.25rem"><span style="color:hsl(142 76% 36%);flex-shrink:0">✓</span><span>${a}</span></li>`).join('');
  const doList = doc.doList.map(d => `<li style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.25rem"><span style="color:hsl(142 76% 36%);flex-shrink:0">✓</span><span>${d}</span></li>`).join('');
  const dontList = doc.dontList.map(d => `<li style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.25rem"><span style="color:hsl(0 84% 60%);flex-shrink:0">✗</span><span>${d}</span></li>`).join('');
  const resources = doc.resources.map(r => {
    const [title, desc] = r.includes(':') ? r.split(':').map(s => s.trim()) : [r, ''];
    return `<a href="#" class="doc-resource" style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.75rem;border:1px solid hsl(var(--border));border-radius:var(--radius);margin-bottom:0.5rem;text-decoration:none;color:inherit"><span style="color:hsl(var(--muted-foreground))">[</span><div><strong>${title}</strong>${desc ? ': ' + desc : ''}</div></a>`;
  }).join('');

  const liveDemo = getLiveDemo(componentId, doc);

  container.innerHTML = `
    <div class="doc-header" style="margin-bottom:1.5rem">
      <span class="doc-label">${doc.label}</span>
      <h1 class="doc-title">${doc.name}</h1>
      <div class="doc-meta">${metaList}</div>
      ${liveDemo}
    </div>

    <section class="doc-section card">
      <h3>Component Anatomy</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;line-height:1.6">${doc.anatomy}</p>
    </section>

    <section class="doc-section card">
      <h3>Variants and States</h3>
      <div class="doc-variants">${getVariantsHtml(componentId)}</div>
    </section>

    <section class="doc-section card">
      <h3>Overview</h3>
      <p style="margin-bottom:1rem;line-height:1.6"><strong>Purpose:</strong> ${doc.purpose}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1rem">
        <div>
          <h4 style="margin-bottom:0.5rem;font-size:0.875rem">When to Use</h4>
          <ul style="margin:0;padding-left:1rem;list-style:none">${whenToUse}</ul>
        </div>
        <div>
          <h4 style="margin-bottom:0.5rem;font-size:0.875rem">When Not to Use</h4>
          <ul style="margin:0;padding-left:1rem;list-style:none">${whenNotToUse}</ul>
        </div>
      </div>
      <h4 style="margin-bottom:0.5rem;font-size:0.875rem">When to Use Alternative Components</h4>
      <ul style="margin:0 0 1rem;padding-left:1.25rem">${alternatives}</ul>
      <h4 style="margin-bottom:0.5rem;font-size:0.875rem">Common Mistakes</h4>
      <ul style="margin:0;padding-left:1rem;list-style:none">${mistakes}</ul>
    </section>

    <section class="doc-section card">
      <h3>Behavior & Interactions</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem;line-height:1.6">${componentId === 'button' ? 'Buttons respond to user interactions through distinct visual states and can trigger various actions in the application.' : componentId === 'input' ? 'Input fields respond to user interactions through distinct visual states and provide real-time feedback during data entry.' : componentId === 'tag' ? 'Tags are primarily static, non-interactive elements. However, they can be part of larger interactive contexts, such as filtering systems or content organization.' : 'Chips respond to user interactions for selection, removal, or filter actions.'}</p>
      <div class="doc-journey">${getJourneyHtml(componentId)}</div>
    </section>

    <section class="doc-section card">
      <h3>Accessibility Guidelines</h3>
      <ul style="margin:0;padding-left:1rem;list-style:none">${accessibility}</ul>
    </section>

    <section class="doc-section card">
      <h3>Code Example</h3>
      <pre class="doc-code"><code>${escapeHtml(doc.codeExample)}</code></pre>
    </section>

    <section class="doc-section card">
      <h3>Best Practices</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
        <div style="border:1px solid hsl(142 76% 36% / 0.3);border-radius:var(--radius);padding:1rem">
          <h4 style="margin-bottom:0.5rem;font-size:0.875rem;display:flex;align-items:center;gap:0.5rem"><span style="color:hsl(142 76% 36%)">✓</span> Do</h4>
          <ul style="margin:0;padding-left:1rem;list-style:none">${doList}</ul>
        </div>
        <div style="border:1px solid hsl(0 84% 60% / 0.3);border-radius:var(--radius);padding:1rem">
          <h4 style="margin-bottom:0.5rem;font-size:0.875rem;display:flex;align-items:center;gap:0.5rem"><span style="color:hsl(0 84% 60%)">✗</span> Don't</h4>
          <ul style="margin:0;padding-left:1rem;list-style:none">${dontList}</ul>
        </div>
      </div>
    </section>

    <section class="doc-section card">
      <h3>Further Resources</h3>
      <div class="doc-resources">${resources}</div>
    </section>
  `;
  return container;
}

function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function getLiveDemo(componentId, doc) {
  if (componentId === 'button') {
    return `
      <div class="doc-demo card" style="margin-top:1rem">
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
          <button class="btn btn-primary">Primary Button</button>
          <button class="btn btn-secondary">Secondary</button>
          <button class="btn btn-secondary" style="background:transparent;border:1px solid hsl(var(--border))">Outline</button>
          <button class="btn btn-primary" style="background:hsl(0 84% 60%);color:white;border:none">Danger</button>
        </div>
      </div>`;
  }
  if (componentId === 'input') {
    return `
      <div class="doc-demo card" style="margin-top:1rem">
        <div style="display:flex;flex-direction:column;gap:1rem">
          <div><label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Email Address</label><input class="input" placeholder="Enter your email" type="email"></div>
          <div><label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Search</label><input class="input" placeholder="Search..." style="padding-left:2rem"></div>
          <div><label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Password*</label><input class="input" value="short" style="border-color:hsl(0 84% 60%)"><span style="font-size:0.75rem;color:hsl(0 84% 60%);display:flex;align-items:center;gap:0.25rem;margin-top:0.25rem">Password must be at least 8 characters</span></div>
        </div>
      </div>`;
  }
  if (componentId === 'tag') {
    return `
      <div class="doc-demo card" style="margin-top:1rem">
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center">
          <span class="chip">Default</span>
          <span class="chip" style="background:hsl(217 91% 60%);color:white">Primary</span>
          <span class="chip" style="background:hsl(142 76% 36%);color:white">Success</span>
          <span class="chip" style="background:hsl(48 96% 53%);color:black">Warning</span>
          <span class="chip" style="background:hsl(0 84% 60%);color:white">Danger</span>
          <span class="chip" style="background:hsl(199 89% 48%);color:white">Info</span>
        </div>
      </div>`;
  }
  if (componentId === 'chips') {
    return `
      <div class="doc-demo card" style="margin-top:1rem">
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center">
          <span class="chip">Option 1</span>
          <span class="chip" style="background:hsl(217 91% 60%);color:white">Selected</span>
          <span class="chip">Option 3</span>
          <span class="chip" style="background:hsl(217 91% 60%);color:white">A With Icon</span>
          <span class="chip" style="background:hsl(217 91% 60%);color:white">Removable x</span>
          <span class="chip" style="background:hsl(142 76% 36%);color:white">Success</span>
          <span class="chip" style="background:hsl(0 84% 60%);color:white">Error</span>
        </div>
      </div>`;
  }
  return '';
}

function getVariantsHtml(componentId) {
  if (componentId === 'button') {
    return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;font-size:0.75rem;text-align:center">
      <div><div style="margin-bottom:0.25rem">Default</div><button class="btn btn-primary" style="width:100%">Primary</button></div>
      <div><div style="margin-bottom:0.25rem">Hover</div><button class="btn btn-primary" style="width:100%;opacity:0.9">Primary</button></div>
      <div><div style="margin-bottom:0.25rem">Active</div><button class="btn btn-primary" style="width:100%">Primary</button></div>
      <div><div style="margin-bottom:0.25rem">Disabled</div><button class="btn btn-primary" style="width:100%" disabled>Primary</button></div>
    </div>`;
  }
  if (componentId === 'input') {
    return `<div style="display:flex;flex-direction:column;gap:1rem">
      <div><label style="font-size:0.75rem;color:hsl(var(--muted-foreground))">Default State</label><input class="input" placeholder="Enter text..." style="margin-top:0.25rem;display:block"></div>
      <div><label style="font-size:0.75rem;color:hsl(var(--muted-foreground))">Hover State</label><input class="input" placeholder="Enter text..." style="margin-top:0.25rem;display:block;border-color:hsl(217 91% 60%)"></div>
      <div><label style="font-size:0.75rem;color:hsl(var(--muted-foreground))">Disabled State</label><input class="input" value="Disabled input" disabled style="margin-top:0.25rem;display:block;opacity:0.6"></div>
      <div><label style="font-size:0.75rem;color:hsl(var(--muted-foreground))">Error State</label><input class="input" value="Invalid input" style="margin-top:0.25rem;display:block;border-color:hsl(0 84% 60%)"><span style="font-size:0.75rem;color:hsl(0 84% 60%);margin-top:0.25rem;display:block">This field contains an error</span></div>
    </div>`;
  }
  if (componentId === 'tag') {
    return `<div style="display:flex;flex-wrap:wrap;gap:0.5rem"><span class="chip">Default</span><span class="chip" style="background:hsl(217 91% 60%);color:white">Primary</span><span class="chip" style="background:hsl(142 76% 36%);color:white">Success</span><span class="chip" style="background:hsl(0 84% 60%);color:white">Danger</span></div>`;
  }
  if (componentId === 'chips') {
    return `<div style="display:flex;flex-wrap:wrap;gap:0.5rem"><span class="chip">Unselected</span><span class="chip" style="background:hsl(217 91% 60%);color:white">Selected</span><span class="chip" style="font-size:0.7rem">Small</span><span class="chip">Medium</span><span class="chip" style="font-size:0.9rem">Large</span></div>`;
  }
  return '';
}

function getJourneyHtml(componentId) {
  if (componentId === 'button') {
    return `<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <div style="flex:1;min-width:12rem"><strong>Primary Journey: Click Action</strong><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.5rem 0">Step 1: Default State - Button displays in its default state ready for user interaction.</p><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.25rem 0">Step 2: Click/Loading - User clicks button, triggering the action.</p><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.25rem 0">Step 3: Completion - Action completes successfully.</p></div>
      <div style="flex:1;min-width:12rem"><strong>Secondary Journey: Keyboard</strong><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.5rem 0">Step 1: Tab Navigation - User presses Tab key.</p><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.25rem 0">Step 2: Focus State - Button receives focus.</p><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.25rem 0">Step 3: Activation - User presses Enter or Space.</p></div>
    </div>`;
  }
  if (componentId === 'input') {
    return `<div><strong>Primary Journey: Form Completion</strong><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.5rem 0">Step 1: Focus - User clicks or tabs into the input field.</p><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.25rem 0">Step 2: Input - User types data. Real-time validation may occur.</p><p style="font-size:0.875rem;color:hsl(var(--muted-foreground));margin:0.25rem 0">Step 3: Validation - On blur or submit, validation runs.</p></div>`;
  }
  return `<p style="font-size:0.875rem;color:hsl(var(--muted-foreground))">See component behavior in context of parent containers and user flows.</p>`;
}

function DocsScreen() {
  return StartScreen();
}

function ContactFormScreen() {
  const container = el('div', { className: 'contact-form-screen' });
  container.innerHTML = `
    <div style="max-width:32rem">
      <h1 style="margin:0 0 0.25rem">Contact us</h1>
      <p style="color:hsl(var(--muted-foreground));margin-bottom:1.5rem">Send us a message and we'll get back to you as soon as possible.</p>
      <form class="card" id="contact-form" style="display:flex;flex-direction:column;gap:1rem">
        <div>
          <label class="form-label" for="contact-name">Name</label>
          <input class="input" id="contact-name" name="name" type="text" placeholder="Your name" required>
        </div>
        <div>
          <label class="form-label" for="contact-email">Email</label>
          <input class="input" id="contact-email" name="email" type="email" placeholder="you@example.com" required>
        </div>
        <div>
          <label class="form-label" for="contact-subject">Subject</label>
          <input class="input" id="contact-subject" name="subject" type="text" placeholder="How can we help?">
        </div>
        <div>
          <label class="form-label" for="contact-message">Message</label>
          <textarea class="textarea" id="contact-message" name="message" placeholder="Your message..." rows="4" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Send message</button>
      </form>
    </div>
  `;
  const form = container.querySelector('#contact-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const msg = el('div', { className: 'alert', style: 'margin-top:1rem;background:hsl(142 76% 36% / 0.15);border-color:hsl(142 76% 36% / 0.3)' });
    msg.innerHTML = '<span style="font-weight:600">✓</span><div><strong>Message sent</strong><br>Thanks for reaching out. We\'ll get back to you soon.</div>';
    container.appendChild(msg);
    form.reset();
  };
  return container;
}

// Main render
function render() {
  const route = getRoute();
  const app = document.getElementById('app');
  app.innerHTML = '';

  const isConfig = route.path === 'config';
  const isStart = route.path === 'start' || route.path === '';

  let main;
  switch (route.path) {
    case 'config':
      main = ConfigScreen();
      break;
    case 'docs-loading':
      main = DocsLoadingScreen();
      break;
    case 'audit-loading':
      main = AuditLoadingScreen();
      break;
    case 'audit-results':
      main = AuditResultsScreen();
      break;
    case 'qa':
      main = QAScreen();
      break;
    case 'doc-view':
      main = DocViewScreen(route.params[0] || 'button');
      break;
    case 'contact':
      main = ContactFormScreen();
      break;
    case 'docs':
    default:
      if (route.path === 'start' || !route.path) main = StartScreen();
      else main = StartScreen();
  }

  app.appendChild(Header());

  if (!isConfig && !isStart) {
    const layout = el('div', { className: 'app-layout' });
    layout.appendChild(Sidebar(route));
    const mainWrap = el('main', { className: 'app-main', style: 'display:flex;flex-direction:column;overflow:hidden' });
    const scrollArea = el('div', { style: 'flex:1;overflow-y:auto' });
    scrollArea.appendChild(main);
    mainWrap.appendChild(scrollArea);
    const chatBar = el('div', { style: 'padding:1rem;border-top:1px solid hsl(var(--border));background:hsl(var(--background));flex-shrink:0' });
    chatBar.innerHTML = `
      <div style="display:flex;gap:0.5rem">
        <input class="input" placeholder="Ask about your design system or request documentation..." style="flex:1">
        <button class="btn btn-primary">Submit</button>
      </div>
      <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin:0.5rem 0 0">Try: "Generate docs for Button component" or "Check this Figma frame for violations"</p>
    `;
    mainWrap.appendChild(chatBar);
    layout.appendChild(mainWrap);
    app.appendChild(layout);
  } else {
    const mainWrap = el('main', { className: 'app-main', style: 'max-width:42rem;margin:0 auto' });
    mainWrap.appendChild(main);
    app.appendChild(mainWrap);
  }
}

function navigate(path) {
  location.hash = '#' + (path.startsWith('/') ? path.slice(1) : path);
}

// Onboarding illustrations (design-matched)
const ONBOARDING_ILLUSTRATIONS = [
  '<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="w1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#93c5fd"/><stop offset="100%" style="stop-color:#a78bfa"/></linearGradient><linearGradient id="w2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#f9a8d4"/><stop offset="100%" style="stop-color:#c4b5fd"/></linearGradient><linearGradient id="sh" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#fcd34d"/><stop offset="100%" style="stop-color:#f59e0b"/></linearGradient></defs><path d="M20 120 Q50 80 100 100 Q150 120 180 90" fill="none" stroke="url(#w1)" stroke-width="8" opacity="0.6"/><path d="M10 130 Q60 100 100 115 Q140 130 190 105" fill="none" stroke="url(#w2)" stroke-width="6" opacity="0.5"/><circle cx="100" cy="95" r="35" fill="url(#w1)" opacity="0.3"/><path d="M100 55 L130 70 L130 105 Q130 130 100 145 Q70 130 70 105 L70 70 Z" fill="url(#sh)" stroke="#fbbf24" stroke-width="2"/><path d="M88 95 L95 102 L112 85" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>',
  '<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="c1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fbcfe8"/><stop offset="100%" style="stop-color:#f9a8d4"/></linearGradient><linearGradient id="c2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#bfdbfe"/><stop offset="100%" style="stop-color:#93c5fd"/></linearGradient><linearGradient id="c3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ddd6fe"/><stop offset="100%" style="stop-color:#c4b5fd"/></linearGradient></defs><g transform="translate(100,80)"><path d="M0,-35 L30,15 L30,65 L0,15 Z" fill="url(#c1)"/><path d="M30,15 L60,-25 L60,25 L30,65 Z" fill="url(#c2)"/><path d="M0,-35 L30,15 L60,-25 L30,-75 Z" fill="url(#c3)"/></g></svg>',
  '<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fde68a"/><stop offset="50%" style="stop-color:#fbbf24"/><stop offset="100%" style="stop-color:#d97706"/></linearGradient><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fbcfe8"/><stop offset="100%" style="stop-color:#c4b5fd"/></linearGradient></defs><rect width="200" height="160" fill="url(#bg)" opacity="0.3" rx="8"/><ellipse cx="100" cy="75" rx="45" ry="18" fill="url(#gc)"/></svg>',
  '<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="p1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e9d5ff"/><stop offset="100%" style="stop-color:#c4b5fd"/></linearGradient><linearGradient id="p2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#bfdbfe"/><stop offset="100%" style="stop-color:#93c5fd"/></linearGradient><linearGradient id="p3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fed7aa"/><stop offset="100%" style="stop-color:#fdba74"/></linearGradient></defs><rect x="30" y="40" width="80" height="60" rx="4" fill="url(#p1)" opacity="0.8"/><rect x="50" y="55" width="80" height="60" rx="4" fill="url(#p2)" opacity="0.7"/><rect x="70" y="70" width="80" height="60" rx="4" fill="url(#p3)" opacity="0.6"/><circle cx="150" cy="120" r="15" fill="#fde68a" opacity="0.9"/></svg>',
  '<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fde68a"/><stop offset="100%" style="stop-color:#f59e0b"/></linearGradient></defs><ellipse cx="100" cy="60" rx="12" ry="5" fill="url(#g5)"/><ellipse cx="100" cy="75" rx="12" ry="5" fill="url(#g5)"/><ellipse cx="100" cy="90" rx="12" ry="5" fill="url(#g5)"/><path d="M70 110 Q100 130 130 110 L120 140 Q100 155 80 140 Z" fill="#fde68a" stroke="#f59e0b" stroke-width="1"/></svg>',
];

function OnboardingModal() {
  if (!state.showOnboarding) return null;
  const steps = ONBOARDING_STEPS;
  const step = Math.min(state.onboardingStep, steps.length - 1);
  const s = steps[step];
  const isLast = step === steps.length - 1;

  const overlay = el('div', { className: 'modal-overlay', onclick: (e) => { if (e.target === overlay) close(); } });
  const modal = el('div', { className: 'modal', style: 'padding:1.5rem', onclick: e => e.stopPropagation() });
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
      <div>
        <h2 style="margin:0 0 0.25rem">${s.title}</h2>
        <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin:0">Let's get you set up in just a few steps.</p>
      </div>
      <button class="btn btn-ghost" id="close-onboarding" aria-label="Close">×</button>
    </div>
    <div style="display:flex;gap:0.375rem;margin-bottom:1rem">
      ${steps.map((_, i) => `<span style="width:8px;height:8px;border-radius:50%;background:${i <= step ? 'hsl(var(--foreground))' : 'hsl(var(--muted))'}"></span>`).join('')}
    </div>
    <p style="color:hsl(var(--muted-foreground));margin-bottom:1.5rem;line-height:1.5">${s.text}</p>
    <div style="height:180px;display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem">${ONBOARDING_ILLUSTRATIONS[step] || ''}</div>
    <div style="display:flex;justify-content:flex-end;gap:0.5rem">
      <button class="btn btn-secondary" id="skip-onboarding">Skip</button>
      <button class="btn btn-primary" id="next-onboarding">${s.primaryBtn}</button>
    </div>
  `;
  overlay.appendChild(modal);

  function close() {
    state.showOnboarding = false;
    setStorage('onboardingSeen', true);
    overlay.remove();
  }

  modal.querySelector('#close-onboarding').onclick = close;
  modal.querySelector('#skip-onboarding').onclick = close;
  modal.querySelector('#next-onboarding').onclick = () => {
    if (isLast) { close(); navigate('/config'); }
    else {
      state.onboardingStep++;
      overlay.remove();
      const next = OnboardingModal();
      if (next) document.body.appendChild(next);
    }
  };

  return overlay;
}

// Init
state.configComplete = getStorage('configComplete', false);
state.showOnboarding = !getStorage('onboardingSeen', false);
state.theme = getStorage('theme', 'light');

window.addEventListener('hashchange', render);
window.addEventListener('load', () => {
  document.documentElement.setAttribute('data-theme', state.theme);
  render();
  const modal = OnboardingModal();
  if (modal) document.body.appendChild(modal);
});
