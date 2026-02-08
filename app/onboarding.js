/**
 * DS Guardian — Welcome screen and onboarding
 * 5 steps with exact copy from design
 */

const STEPS = [
  {
    title: 'Welcome to DS Guardian',
    text: 'Guardian generates component docs in seconds, then catches UI violations before they ship.',
    primaryBtn: 'Get Started',
  },
  {
    title: 'New component created',
    text: 'Add a new design component to DS guardian',
    primaryBtn: 'Next',
  },
  {
    title: 'Document Generation',
    text: 'Guardian instantly generates technical as well as contextual documentation. Then, You review and publish it in one click - to Storybook, GitHub, or Figma.',
    primaryBtn: 'Next',
  },
  {
    title: 'Enforcement',
    text: 'Paste a Figma screen or GitHub UI link, and Guardian checks it against your documented system. It flags: incorrect component usage, token drift (padding, radius, color), accessibility gaps. With visual annotations and direct fix links.',
    primaryBtn: 'Next',
  },
  {
    title: 'Test + Auto-fix',
    text: "Guardian doesn't just report issues — it helps resolve them. See violations highlighted directly on the UI. Click Auto-Fix for safe corrections. Ship faster with less design debt.",
    primaryBtn: 'Configure',
  },
];

const ILLUSTRATIONS = {
  step1: `<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#93c5fd"/><stop offset="100%" style="stop-color:#a78bfa"/></linearGradient>
      <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#f9a8d4"/><stop offset="100%" style="stop-color:#c4b5fd"/></linearGradient>
      <linearGradient id="shield" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#fcd34d"/><stop offset="100%" style="stop-color:#f59e0b"/></linearGradient>
    </defs>
    <path d="M20 120 Q50 80 100 100 Q150 120 180 90" fill="none" stroke="url(#wave1)" stroke-width="8" opacity="0.6"/>
    <path d="M10 130 Q60 100 100 115 Q140 130 190 105" fill="none" stroke="url(#wave2)" stroke-width="6" opacity="0.5"/>
    <circle cx="100" cy="95" r="35" fill="url(#wave1)" opacity="0.3"/>
    <path d="M100 55 L130 70 L130 105 Q130 130 100 145 Q70 130 70 105 L70 70 Z" fill="url(#shield)" stroke="#fbbf24" stroke-width="2"/>
    <path d="M88 95 L95 102 L112 85" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <circle cx="100" cy="95" r="2" fill="white" opacity="0.8"/>
  </svg>`,
  step2: `<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cube1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fbcfe8"/><stop offset="100%" style="stop-color:#f9a8d4"/></linearGradient>
      <linearGradient id="cube2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#bfdbfe"/><stop offset="100%" style="stop-color:#93c5fd"/></linearGradient>
      <linearGradient id="cube3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ddd6fe"/><stop offset="100%" style="stop-color:#c4b5fd"/></linearGradient>
    </defs>
    <g transform="translate(100,80)">
      <path d="M0,-35 L30,15 L30,65 L0,15 Z" fill="url(#cube1)"/>
      <path d="M30,15 L60,-25 L60,25 L30,65 Z" fill="url(#cube2)"/>
      <path d="M0,-35 L30,15 L60,-25 L30,-75 Z" fill="url(#cube3)"/>
    </g>
  </svg>`,
  step3: `<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="coin" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fde68a"/><stop offset="50%" style="stop-color:#fbbf24"/><stop offset="100%" style="stop-color:#d97706"/></linearGradient>
      <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fbcfe8"/><stop offset="100%" style="stop-color:#c4b5fd"/></linearGradient>
    </defs>
    <rect width="200" height="160" fill="url(#bg3)" opacity="0.3" rx="8"/>
    <ellipse cx="100" cy="75" rx="45" ry="18" fill="url(#coin)"/>
    <ellipse cx="100" cy="72" rx="40" ry="15" fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.5"/>
  </svg>`,
  step4: `<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="panel1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e9d5ff"/><stop offset="100%" style="stop-color:#c4b5fd"/></linearGradient>
      <linearGradient id="panel2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#bfdbfe"/><stop offset="100%" style="stop-color:#93c5fd"/></linearGradient>
      <linearGradient id="panel3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fed7aa"/><stop offset="100%" style="stop-color:#fdba74"/></linearGradient>
    </defs>
    <rect x="30" y="40" width="80" height="60" rx="4" fill="url(#panel1)" opacity="0.8"/>
    <rect x="50" y="55" width="80" height="60" rx="4" fill="url(#panel2)" opacity="0.7"/>
    <rect x="70" y="70" width="80" height="60" rx="4" fill="url(#panel3)" opacity="0.6"/>
    <circle cx="150" cy="120" r="15" fill="#fde68a" opacity="0.9"/>
  </svg>`,
  step5: `<svg width="200" height="160" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="coin5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fde68a"/><stop offset="100%" style="stop-color:#f59e0b"/></linearGradient>
    </defs>
    <ellipse cx="100" cy="60" rx="12" ry="5" fill="url(#coin5)"/>
    <ellipse cx="100" cy="75" rx="12" ry="5" fill="url(#coin5)"/>
    <ellipse cx="100" cy="90" rx="12" ry="5" fill="url(#coin5)"/>
    <path d="M70 110 Q100 130 130 110 L120 140 Q100 155 80 140 Z" fill="#fde68a" stroke="#f59e0b" stroke-width="1"/>
    <path d="M90 115 L95 128 L108 128 L98 137 L102 150 L90 142 L78 150 L82 137 L72 128 L85 128 Z" fill="none" stroke="#fbbf24" stroke-width="2"/>
  </svg>`,
};

let currentStep = 0;

function renderStep() {
  const step = STEPS[currentStep];
  document.getElementById('step-title').textContent = step.title;
  document.getElementById('step-text').textContent = step.text;
  document.getElementById('next-btn').textContent = step.primaryBtn;

  const dots = document.getElementById('progress-dots');
  dots.innerHTML = '';
  for (let i = 0; i < STEPS.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'onboarding-dot' + (i <= currentStep ? ' active' : '');
    dots.appendChild(dot);
  }

  const ill = document.getElementById('step-illustration');
  ill.innerHTML = ILLUSTRATIONS['step' + (currentStep + 1)];
}

function close() {
  if (window.opener) window.close();
  else window.location.href = '../index.html';
}

function next() {
  if (currentStep === STEPS.length - 1) {
    close();
    return;
  }
  currentStep++;
  renderStep();
}

document.getElementById('close-btn').onclick = close;
document.getElementById('skip-btn').onclick = close;
document.getElementById('next-btn').onclick = next;

document.getElementById('theme-toggle').onclick = () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-toggle').textContent = isDark ? 'Light' : 'Dark';
};

renderStep();
