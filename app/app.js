/**
 * Guardian — Design System Documentation & QA
 * Single-page app with hash routing
 */

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;

// State
const state = {
  mode: 'docs', // 'docs' | 'qa'
  link: '',
  configComplete: false,
  sourceOfTruth: ['Accessibility standards.md'],
  onboardingStep: 0,
  showOnboarding: true,
  currentDoc: null,
  auditResults: null,
};

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
  return el('header', { className: 'app-header' },
    logo,
    el('button', { className: 'btn btn-ghost', onclick: () => navigate('/config') }, '⚙')
  );
}

function Sidebar(route) {
  const docsActive = route.path === 'docs' || route.path === 'doc-view';
  const qaActive = route.path === 'qa' || route.path === 'audit-results' || route.path === 'audit-loading';
  return el('aside', { className: 'app-sidebar' },
    el('button', { className: 'btn btn-primary', style: 'width:100%', onclick: () => navigate('/docs') }, 'Generate Doc'),
    el('button', { className: 'btn btn-primary', style: 'width:100%', onclick: () => navigate('/qa') }, 'New Test'),
    el('div', { className: 'sidebar-section' }, 'Doc files'),
    el('a', { className: 'sidebar-item' + (docsActive ? ' active' : ''), href: '#/doc-view/button', onclick: (e) => { e.preventDefault(); navigate('/doc-view/button'); } }, '⟨/⟩ ', 'Button'),
    el('a', { className: 'sidebar-item', href: '#/doc-view/input', onclick: (e) => { e.preventDefault(); navigate('/doc-view/input'); } }, '⟨/⟩ ', 'Input'),
    el('a', { className: 'sidebar-item', href: '#/docs', onclick: (e) => { e.preventDefault(); navigate('/docs'); } }, '📄', 'All generated documents'),
    el('div', { className: 'sidebar-section' }, 'Test Audits'),
    el('a', { className: 'sidebar-item' + (qaActive ? ' active' : ''), href: '#/qa', onclick: (e) => { e.preventDefault(); navigate('/qa'); } }, '📄', 'QA audit')
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
  const btnDocs = el('button', { className: 'btn ' + (mode === 'docs' ? 'active' : ''), onclick: () => { state.mode = 'docs'; render(); } }, '📄 Docs Generator');
  const btnQA = el('button', { className: 'btn ' + (mode === 'qa' ? 'active' : ''), onclick: () => { state.mode = 'qa'; render(); } }, '🛡 QA Checker');
  tg.appendChild(btnDocs);
  tg.appendChild(btnQA);

  container.appendChild(tg);
  container.appendChild(el('h2', { style: 'font-size:1.25rem;margin:1.5rem 0 0.5rem' }, headline));
  container.appendChild(el('p', { style: 'margin-bottom:1rem' }, subhead));

  if (!state.configComplete) {
    const alert = el('div', { className: 'alert' });
    alert.innerHTML = `<span>ℹ</span><div><strong>Configuration Settings needed</strong><br>First, set up your documentation templates and input your credentials.</div>`;
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

  container.appendChild(el('h1', { style: 'display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem' }, '⚙', 'Configuration Settings'));
  container.appendChild(el('p', { className: 'muted', style: 'margin-bottom:1.5rem;color:hsl(var(--muted-foreground))' }, 'Manage your DS Guardian configuration and API integrations'));

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
      <h3 style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">📄 Documentation Template & Guidelines</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem">Upload your documentation template or provide context to guide AI generation</p>
      <div class="upload-zone" style="margin-bottom:1rem">
        <p style="margin:0">Click to upload or drag and drop</p>
        <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin:0.25rem 0 0">MD, TXT, PDF, DOC (max. 10MB)</p>
      </div>
      <p style="text-align:center;margin:0.5rem 0">OR</p>
      <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Paste Guidelines / Context</label>
      <textarea class="input" rows="4" placeholder="Enter your documentation guidelines, style guide, or any context..."></textarea>
      <button class="btn btn-primary" style="margin-top:1rem">Save Documentation Settings</button>
    `;
    container.appendChild(card);
  } else if (configTab === 'claude-api') {
    const card = el('div', { className: 'card' });
    card.innerHTML = `
      <h3 style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">🔑 Claude API Credentials</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem">Configure your Claude API for AI-powered documentation generation.</p>
      <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">API Key</label>
      <input type="password" class="input" placeholder="sk-ant-..." style="margin-bottom:1rem">
      <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Model</label>
      <select class="input" style="margin-bottom:1rem"><option>Claude 3.5 Sonnet (Latest)</option></select>
      <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin-bottom:1rem">Recommended: Claude 3.5 Sonnet for best documentation quality</p>
      <div style="background:hsl(var(--muted));padding:0.75rem;border-radius:var(--radius);margin-bottom:1rem">
        <strong>How to get your API key</strong>
        <ul style="margin:0.5rem 0 0 1rem;padding:0">
          <li>Go to console.anthropic.com</li>
          <li>Navigate to API Keys section</li>
          <li>Create a new API key</li>
          <li>Copy and paste it above</li>
        </ul>
        <a href="https://console.anthropic.com" target="_blank" style="color:hsl(217 91% 60%);margin-top:0.5rem;display:inline-block">Open Anthropic Console →</a>
      </div>
      <p style="font-size:0.75rem;color:hsl(var(--muted-foreground));margin-bottom:1rem">✓ Your API key is stored securely and only used to generate documentation</p>
      <button class="btn btn-secondary">Save Claude Settings</button>
    `;
    container.appendChild(card);
  } else {
    const card = el('div', { className: 'card' });
    card.innerHTML = `
      <h3 style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">🎨 Figma</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem">Connect your Figma account for design extraction.</p>
      <label style="display:block;font-size:0.875rem;margin-bottom:0.25rem">Figma Access Token</label>
      <input type="password" class="input" placeholder="figd_..." style="margin-bottom:1rem">
      <button class="btn btn-primary">Save Figma Settings</button>
    `;
    container.appendChild(card);
  }

  const welcome = el('div', { className: 'alert', style: 'margin-top:1rem' });
  welcome.innerHTML = `
    <span>ℹ</span>
    <div>
      <strong>Welcome to DS Guardian!</strong><br>
      It looks like this is your first time. Configure Claude API and Figma access token to get started.
    </div>
  `;
  container.appendChild(welcome);

  const nav = el('div', { style: 'display:flex;justify-content:space-between;margin-top:1.5rem' });
  nav.appendChild(el('button', { className: 'btn btn-secondary', onclick: () => navigate('/start') }, 'Cancel'));
  nav.appendChild(el('button', { className: 'btn btn-primary', onclick: () => { state.configComplete = true; setStorage('configComplete', true); navigate('/start'); } }, 'Next'));
  container.appendChild(nav);

  return container;
}

function DocsLoadingScreen() {
  const steps = ['Fetching design file...', 'Extracting UI components...', 'Running QA checks...', 'Generating report...'];
  const container = el('div', { className: 'centered-screen' });
  container.innerHTML = `
    <div style="margin-bottom:1.5rem">📄</div>
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
    <div style="margin-bottom:1.5rem">🛡</div>
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
  `;
  container.appendChild(uploadCard);

  const sourceCard = el('div', { className: 'card', style: 'margin-bottom:1.5rem' });
  sourceCard.innerHTML = `
    <h3 style="margin-bottom:0.5rem">Your Source of Truth</h3>
    <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin-bottom:1rem">Any design you upload will be compared to these gold copy documents.</p>
    <div id="source-tags"></div>
  `;
  container.appendChild(sourceCard);
  const tagsEl = container.querySelector('#source-tags');
  state.sourceOfTruth.forEach(t => {
    const chip = el('span', { className: 'chip', style: 'margin-right:0.5rem;margin-bottom:0.5rem' });
    chip.innerHTML = `${t} <span class="remove">×</span>`;
    chip.querySelector('.remove').onclick = () => { state.sourceOfTruth = state.sourceOfTruth.filter(x => x !== t); render(); };
    tagsEl.appendChild(chip);
  });

  const checkCard = el('div', { className: 'card', style: 'margin-bottom:1.5rem' });
  checkCard.innerHTML = `
    <h3 style="margin-bottom:0.5rem">Guardian will check for:</h3>
    <ul style="margin:0;padding-left:1.25rem;color:hsl(var(--muted-foreground))">
      <li>Components that don't match your Storybook specs</li>
      <li>Colors and spacing not using your tokens</li>
      <li>Missing states (hover, focus, disabled)</li>
      <li>Accessibility violations (contrast, labels)</li>
    </ul>
  `;
  container.appendChild(checkCard);

  const input = uploadCard.querySelector('input');
  input.addEventListener('input', () => { state.link = input.value; });
  container.appendChild(el('button', { className: 'btn btn-primary', style: 'width:100%;max-width:16rem', onclick: () => runAnalysis(input.value) }, 'Run Audit'));

  return container;
}

function AuditResultsScreen() {
  const container = el('div', {});
  container.appendChild(el('h1', { style: 'margin-bottom:1rem' }, 'Audit Results'));

  const stats = el('div', { className: 'stats-grid' });
  stats.innerHTML = `
    <div class="stat-card"><div class="value">7</div><div class="label">Violations Found</div></div>
    <div class="stat-card"><div class="value">3</div><div class="label">High Severity</div></div>
    <div class="stat-card"><div class="value">2</div><div class="label">Medium Severity</div></div>
    <div class="stat-card"><div class="value">2</div><div class="label">Low Severity</div></div>
  `;
  container.appendChild(stats);

  const previewCard = el('div', { className: 'card', style: 'margin-bottom:1.5rem' });
  previewCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <h3>Visual Preview</h3>
      <button class="btn btn-primary">Auto-fix All (8)</button>
    </div>
    <div style="background:hsl(var(--muted));height:200px;border-radius:var(--radius);display:flex;align-items:center;justify-content:center;color:hsl(var(--muted-foreground))">
      [Design preview placeholder]
    </div>
  `;
  container.appendChild(previewCard);

  const tableCard = el('div', { className: 'card' });
  tableCard.innerHTML = `
    <h3 style="margin-bottom:1rem">Issues Report</h3>
    <table class="table">
      <thead><tr><th>Issue Type</th><th>Severity</th><th>Issue</th><th>Expected</th><th>Action</th></tr></thead>
      <tbody>
        <tr><td>Component</td><td><span class="badge badge-critical">Critical</span></td><td>Button uses wrong variant</td><td>Primary and Secondary supposed to be next...</td><td><button class="btn btn-secondary btn-ghost" style="padding:0.25rem">Auto-fix</button> <button class="btn btn-ghost" style="padding:0.25rem">View correct usage</button></td></tr>
        <tr><td>Variable</td><td><span class="badge badge-medium">Medium</span></td><td>Color/style variables not linking...</td><td>Color contrast issue</td><td><button class="btn btn-ghost" style="padding:0.25rem">Auto-fix</button></td></tr>
        <tr><td>Typography</td><td><span class="badge badge-medium">Medium</span></td><td>Text style mismatch</td><td>Should be Body/Medium</td><td><button class="btn btn-ghost" style="padding:0.25rem">Auto-fix</button></td></tr>
        <tr><td>Spacing</td><td><span class="badge badge-low">Low</span></td><td>Incorrect padding on card</td><td>Should use spacing-4 token</td><td><button class="btn btn-ghost" style="padding:0.25rem">Auto-fix</button></td></tr>
      </tbody>
    </table>
  `;
  container.appendChild(tableCard);

  return container;
}

function DocViewScreen(componentId) {
  const components = {
    button: { name: 'Button', type: 'Button | Action | Primary' },
    input: { name: 'Input', type: 'Input | Form | Text' },
    tag: { name: 'Tag', type: 'Label | Status | Categorization' },
    chips: { name: 'Chips', type: 'Chips | Selection | Filter' },
  };
  const comp = components[componentId] || components.button;
  const container = el('div', {});
  container.innerHTML = `
    <div style="margin-bottom:1rem">
      <span style="font-size:0.75rem;color:hsl(var(--muted-foreground));text-transform:uppercase">Component</span>
      <h1 style="margin:0.25rem 0">${comp.name}</h1>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem">Component Type: ${comp.type}</p>
    </div>
    <div class="card" style="margin-bottom:1.5rem">
      <h3 style="margin-bottom:0.5rem">Overview</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem">${comp.name} is a reusable component for user interfaces. Follow the design system guidelines for proper usage.</p>
    </div>
    <div class="card" style="margin-bottom:1.5rem">
      <h3 style="margin-bottom:0.5rem">Variants and States</h3>
      <p style="color:hsl(var(--muted-foreground));font-size:0.875rem">Default, Hover, Active, Disabled</p>
    </div>
    <div class="card" style="margin-bottom:1.5rem">
      <h3 style="margin-bottom:0.5rem">Code Example</h3>
      <pre style="background:hsl(var(--muted));padding:1rem;border-radius:var(--radius);overflow-x:auto;font-size:0.8rem"><code>&lt;${comp.name} variant="default" /&gt;</code></pre>
    </div>
  `;
  return container;
}

function DocsScreen() {
  return StartScreen();
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
        <button class="btn btn-primary">→</button>
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

// Onboarding modal
function OnboardingModal() {
  if (!state.showOnboarding) return null;
  const steps = [
    { title: 'Welcome to DS Guardian', subtitle: "Let's get you set up in just a few steps.", text: 'Guardian generates component docs in seconds, then catches UI violations before they ship.' },
    { title: 'New component created', subtitle: "Let's get you set up in just a few steps.", text: 'Add a new design component to DS guardian' },
    { title: 'Enforcement', subtitle: "Let's get you set up in just a few steps.", text: "Paste a Figma screen or GitHub UI link, and Guardian checks it against your documented system. It flags: incorrect component usage, token drift, accessibility gaps. With visual annotations and direct fix links." },
    { title: 'Test + Auto-fix', subtitle: "Let's get you set up in just a few steps.", text: "Guardian doesn't just report issues — it helps resolve them. See violations highlighted directly on the UI. Click Auto-Fix for safe corrections. Ship faster with less design debt." },
  ];
  const step = Math.min(state.onboardingStep, steps.length - 1);
  const s = steps[step];
  const isLast = step === steps.length - 1;

  const overlay = el('div', { className: 'modal-overlay', onclick: (e) => { if (e.target === overlay) close(); } });
  const modal = el('div', { className: 'modal', style: 'padding:1.5rem', onclick: e => e.stopPropagation() });
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
      <div>
        <h2 style="margin:0 0 0.25rem">${s.title}</h2>
        <p style="color:hsl(var(--muted-foreground));font-size:0.875rem;margin:0">${s.subtitle}</p>
      </div>
      <button class="btn btn-ghost" id="close-onboarding">×</button>
    </div>
    <div style="display:flex;gap:0.25rem;margin-bottom:1rem">
      ${steps.map((_, i) => `<span style="width:8px;height:8px;border-radius:50%;background:${i <= step ? 'hsl(var(--foreground))' : 'hsl(var(--muted))'}"></span>`).join('')}
    </div>
    <p style="color:hsl(var(--muted-foreground));margin-bottom:1.5rem">${s.text}</p>
    <div style="display:flex;justify-content:flex-end;gap:0.5rem">
      <button class="btn btn-secondary" id="skip-onboarding">Skip</button>
      <button class="btn btn-primary" id="next-onboarding">${isLast ? 'Configure' : 'Next'}</button>
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

window.addEventListener('hashchange', render);
window.addEventListener('load', () => {
  render();
  const modal = OnboardingModal();
  if (modal) document.body.appendChild(modal);
});
