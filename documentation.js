/**
 * Design System Guardian — Documentation creation flow
 * PRD references: Feature 1 (Setup), Feature 2 (Generation), Feature 3 (View/Edit/Export)
 */

const STORAGE_PREFIX = 'dsg:';
const STORAGE_KEYS = {
  AI_CONFIG: STORAGE_PREFIX + 'ai-config',
  FIGMA_TOKEN: STORAGE_PREFIX + 'figma-token',
  RECENT_LINKS: STORAGE_PREFIX + 'recent-links',
  DOC_CONTENT: STORAGE_PREFIX + 'doc-content',
  DOC_COMPONENT: STORAGE_PREFIX + 'doc-component',
};

const FIGMA_URL_PATTERN = /^https:\/\/(www\.)?figma\.com\/file\/[A-Za-z0-9_-]+\/[^?]*(\?[^#]*)?$/;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

const storage = {
  get(key) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    sessionStorage.removeItem(key);
  },
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isValidFigmaUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return FIGMA_URL_PATTERN.test(trimmed) || trimmed.includes('figma.com/file/');
}

// ---------------------------------------------------------------------------
// Fallback template (PRD § 2.6)
// ---------------------------------------------------------------------------

const FALLBACK_TEMPLATE = `# {{componentName}}

## Overview
{{componentName}} is a {{componentType}} component used for {{usage}}.

## When to Use
- Use when {{usage}}
- Avoid when {{avoidance}}

## Variants / States
| Variant | Description |
|---------|-------------|
| Default | Primary state |
| Hover | Interactive feedback |
| Disabled | Non-interactive state |

## Properties / Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | "default" | Visual variant |
| disabled | boolean | false | Disabled state |

## Accessibility Considerations
- Ensure sufficient color contrast (WCAG 2.1 AA)
- Support keyboard navigation
- Provide aria-label when needed

## Usage Examples
\`\`\`tsx
<{{componentName}} variant="default" />
\`\`\`

## Best Practices
- Follow the established design system patterns
- Test with screen readers

## Related Components
- See design system documentation for related components
`;

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// ---------------------------------------------------------------------------
// Mock generation (replace with real Figma MCP + LLM when ready)
// ---------------------------------------------------------------------------

function generateMockDoc(link, contextFiles = [], template = null) {
  const componentName = 'Button';
  const componentType = 'button';
  const usage = 'primary actions and CTAs';
  const avoidance = 'secondary or tertiary actions';

  let content = (template || FALLBACK_TEMPLATE)
    .replace(/\{\{componentName\}\}/g, componentName)
    .replace(/\{\{componentType\}\}/g, componentType)
    .replace(/\{\{usage\}\}/g, usage)
    .replace(/\{\{avoidance\}\}/g, avoidance);

  const contextNote = contextFiles.length > 0
    ? `\n\n---\n*Generated using ${contextFiles.length} context file(s).*\n`
    : '';
  return content + contextNote;
}

// ---------------------------------------------------------------------------
// Progress simulation
// ---------------------------------------------------------------------------

const STEPS = ['extract', 'identify', 'context', 'research', 'generate'];
const STEP_DURATION = 800;

function runGeneration(link, contextFiles, template, onStep, onComplete, onError) {
  let stepIndex = 0;

  function nextStep() {
    if (stepIndex >= STEPS.length) {
      onComplete();
      return;
    }
    const step = STEPS[stepIndex];
    onStep(step);
    stepIndex++;
    setTimeout(nextStep, STEP_DURATION);
  }

  try {
    nextStep();
  } catch (err) {
    onError(err.message);
  }
}

// ---------------------------------------------------------------------------
// Setup page init (documentation.html)
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  const setupSection = document.getElementById('doc-setup');
  const progressSection = document.getElementById('doc-progress');
  if (!setupSection) return;

  const fileInput = document.getElementById('file-input');
  const browseBtn = document.getElementById('browse-btn');
  const uploadZone = document.getElementById('upload-zone');
  const fileList = document.getElementById('file-list');
  const aiForm = document.getElementById('ai-config-form');
  const figmaForm = document.getElementById('figma-config-form');
  const linkForm = document.getElementById('link-form');
  const generateBtn = document.getElementById('generate-btn');
  const linkError = document.getElementById('link-error');
  const progressSteps = document.getElementById('progress-steps');
  const progressError = document.getElementById('progress-error');

  let contextFiles = [];

  // File upload
  function renderFileList() {
    fileList.innerHTML = contextFiles
      .map(
        (f, i) =>
          `<div class="FileList__item">
            <span class="FileList__name">${escapeHtml(f.name)}</span>
            <button type="button" class="FileList__remove" data-index="${i}" aria-label="Remove">×</button>
          </div>`
      )
      .join('');
    fileList.querySelectorAll('.FileList__remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        contextFiles.splice(parseInt(btn.dataset.index, 10), 1);
        renderFileList();
      });
    });
  }

  function handleFiles(files) {
    for (const file of Array.from(files || [])) {
      if (!file.name.endsWith('.md')) continue;
      if (file.size > MAX_FILE_SIZE) continue;
      contextFiles.push({ name: file.name, file });
    }
    renderFileList();
  }

  browseBtn?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => handleFiles(e.target.files));

  uploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('UploadZone--dragover');
  });
  uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('UploadZone--dragover'));
  uploadZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('UploadZone--dragover');
    handleFiles(e.dataTransfer.files);
  });

  // AI config
  aiForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const provider = document.getElementById('ai-provider')?.value || 'openai';
    const apiKey = document.getElementById('api-key')?.value?.trim();
    if (apiKey) {
      storage.set(STORAGE_KEYS.AI_CONFIG, { provider, apiKey });
      showToast('AI configuration saved.');
    }
  });

  // Figma config
  figmaForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const token = document.getElementById('figma-token')?.value?.trim();
    if (token) {
      storage.set(STORAGE_KEYS.FIGMA_TOKEN, token);
      const status = document.getElementById('figma-status');
      if (status) {
        status.textContent = 'Token saved.';
        status.className = 'ConnectionStatus ConnectionStatus--success';
      }
      showToast('Figma token saved.');
    }
  });

  // Link form & generate
  function updateGenerateButton() {
    const link = document.getElementById('figma-link')?.value?.trim();
    generateBtn.disabled = !isValidFigmaUrl(link);
  }

  document.getElementById('figma-link')?.addEventListener('input', updateGenerateButton);

  linkForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    linkError.textContent = '';
    const link = document.getElementById('figma-link')?.value?.trim();
    if (!isValidFigmaUrl(link)) {
      linkError.textContent = 'Please enter a valid Figma file URL.';
      linkError.hidden = false;
      return;
    }

    // Store recent link
    const recent = storage.get(STORAGE_KEYS.RECENT_LINKS) || [];
    if (!recent.includes(link)) {
      recent.unshift(link);
      storage.set(STORAGE_KEYS.RECENT_LINKS, recent.slice(0, 5));
    }

    // Show progress
    setupSection.hidden = true;
    progressSection.hidden = false;
    progressError.hidden = true;
    progressSteps?.querySelectorAll('.ProgressStep').forEach((el) => el.classList.remove('ProgressStep--active', 'ProgressStep--done'));

    const templateFile = contextFiles.find((f) => f.name.toLowerCase().includes('template'));
    const templateContent = templateFile ? null : FALLBACK_TEMPLATE;

    runGeneration(
      link,
      contextFiles,
      templateContent,
      (step) => {
        progressSteps?.querySelectorAll('.ProgressStep').forEach((el) => {
          const isActive = el.dataset.step === step;
          const isDone = STEPS.indexOf(el.dataset.step) < STEPS.indexOf(step);
          el.classList.toggle('ProgressStep--active', isActive);
          el.classList.toggle('ProgressStep--done', isDone);
        });
      },
      async () => {
        let template = FALLBACK_TEMPLATE;
        if (templateFile?.file) {
          try {
            template = await readFileAsText(templateFile.file);
          } catch {
            // keep fallback
          }
        }
        const doc = generateMockDoc(
          link,
          contextFiles.map((f) => f.name),
          template
        );
        storage.set(STORAGE_KEYS.DOC_CONTENT, doc);
        storage.set(STORAGE_KEYS.DOC_COMPONENT, { link, name: 'Button' });
        window.location.href = 'documentation-edit.html';
      },
      (err) => {
        progressError.textContent = err;
        progressError.hidden = false;
      }
    );
  });

  updateGenerateButton();
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'Toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('Toast--visible'));
  setTimeout(() => {
    toast.classList.remove('Toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
