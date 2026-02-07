/**
 * Design System Guardian — Documentation edit & export
 * PRD § 3.1 Display, § 3.2 Editor, § 3.3 Export
 */

(function () {
  const DOC_CONTENT = 'dsg:doc-content';
  const DOC_COMPONENT = 'dsg:doc-component';

  function getStoredDoc() {
    try {
      return sessionStorage.getItem(DOC_CONTENT);
    } catch {
      return null;
    }
  }

  function getStoredComponent() {
    try {
      const raw = sessionStorage.getItem(DOC_COMPONENT);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setStoredDoc(content) {
    sessionStorage.setItem(DOC_CONTENT, content);
  }

  function markdownToHtml(md) {
    if (!md) return '';
    if (typeof marked !== 'undefined') {
      return marked.parse(md);
    }
    return escapeHtml(md).replace(/\n/g, '<br>');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'documentation.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const viewEl = document.getElementById('doc-view');
    const editEl = document.getElementById('doc-edit');
    const renderedEl = document.getElementById('doc-rendered');
    const editorEl = document.getElementById('doc-editor');
    const titleEl = document.getElementById('doc-title');
    const modeToggle = document.getElementById('view-mode-toggle');
    const copyBtn = document.getElementById('copy-btn');
    const exportBtn = document.getElementById('export-btn');

    let content = getStoredDoc();
    const component = getStoredComponent();

    if (!content) {
      content = '*No documentation loaded. [Generate documentation](documentation.html) first.*';
    }

    if (component?.name) {
      titleEl.textContent = component.name + ' — Documentation';
    }

    let isEditMode = false;

    function renderView() {
      renderedEl.innerHTML = markdownToHtml(content);
    }

    function setMode(edit) {
      isEditMode = edit;
      viewEl.hidden = edit;
      editEl.hidden = !edit;
      modeToggle.textContent = edit ? 'View mode' : 'Edit mode';
      if (edit) {
        editorEl.value = content;
        editorEl.focus();
      } else {
        content = editorEl.value;
        setStoredDoc(content);
        renderView();
      }
    }

    modeToggle?.addEventListener('click', () => setMode(!isEditMode));

    editorEl?.addEventListener('input', () => {
      content = editorEl.value;
    });

    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(content || editorEl?.value || '').then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
      });
    });

    exportBtn?.addEventListener('click', () => {
      const text = isEditMode ? editorEl.value : content;
      const name = component?.name ? component.name.toLowerCase().replace(/\s+/g, '-') + '.md' : 'documentation.md';
      downloadMarkdown(text, name);
    });

    renderView();
  });
})();
