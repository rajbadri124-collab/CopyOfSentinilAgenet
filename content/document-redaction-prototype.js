(() => {
  if (window.__privacyGuardDocumentRedactorPrototype) {
    return;
  }
  window.__privacyGuardDocumentRedactorPrototype = true;

  const STYLE = `
    .pg-doc-redactor-btn {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;
      background: #111827;
      color: #ffffff;
      border: none;
      border-radius: 999px;
      padding: 12px 18px;
      font: 600 14px/1.2 Arial, sans-serif;
      box-shadow: 0 10px 24px rgba(17,24,39,0.22);
      cursor: pointer;
    }
    .pg-doc-redactor-btn:hover {
      background: #1f2937;
    }
    .pg-doc-redactor-modal {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: rgba(15, 23, 42, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .pg-doc-redactor-panel {
      width: min(820px, 92vw);
      max-height: 86vh;
      overflow: auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 18px 44px rgba(15, 23, 42, 0.3);
      padding: 20px;
      font-family: Arial, sans-serif;
      color: #0f172a;
    }
    .pg-doc-redactor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }
    .pg-doc-redactor-title {
      margin: 0;
      font-size: 20px;
    }
    .pg-doc-redactor-close {
      border: none;
      background: transparent;
      font-size: 28px;
      cursor: pointer;
    }
    .pg-doc-redactor-preview {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      white-space: pre-wrap;
      line-height: 1.6;
      min-height: 160px;
      overflow: auto;
    }
    .pg-doc-redactor-actions {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .pg-doc-redactor-actions button {
      border: none;
      border-radius: 10px;
      padding: 10px 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .pg-doc-redactor-secondary {
      background: #e2e8f0;
      color: #0f172a;
    }
    .pg-doc-redactor-primary {
      background: #111827;
      color: white;
    }
  `;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pg-doc-redactor-btn';
  button.textContent = 'Redact sensitive content';
  button.addEventListener('click', openFilePicker);

  const styleNode = document.createElement('style');
  styleNode.textContent = STYLE;
  document.head.appendChild(styleNode);

  if (document.body) {
    document.body.appendChild(button);
  } else {
    window.addEventListener('load', () => {
      document.body && document.body.appendChild(button);
    }, { once: true });
  }

  registerUploadInputs();

  function openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.txt';
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      if (!file) {
        return;
      }
      await processFile(file);
    }, { once: true });
    input.click();
  }

  function registerUploadInputs() {
    const attachInput = (input) => {
      if (!input || input.dataset.pgRedactorBound === 'true') {
        return;
      }
      input.dataset.pgRedactorBound = 'true';
      input.addEventListener('change', async () => {
        const file = input.files && input.files[0];
        if (!file) {
          return;
        }
        await processFile(file);
      });
    };

    document.querySelectorAll('input[type="file"]').forEach(attachInput);

    const observer = new MutationObserver(() => {
      document.querySelectorAll('input[type="file"]').forEach(attachInput);
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
  }

  async function processFile(file) {
    const kind = guessFileKind(file);
    const text = await readTextPreview(file, kind);
    const redactedText = redactSensitiveText(text);
    showPreviewDialog(file.name, redactedText, kind);
  }

  function guessFileKind(file) {
    if (file.type.startsWith('image/')) {
      return 'image';
    }
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return 'pdf';
    }
    if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.txt')) {
      return 'document';
    }
    return 'text';
  }

  async function readTextPreview(file, kind) {
    if (kind === 'image') {
      return 'Image content detected. This prototype will redact obvious personal data in the extracted visible text layer. For a production implementation, the OCR pipeline in the main project should be used here.';
    }

    if (kind === 'pdf') {
      return await readPdfText(file);
    }

    if (kind === 'document') {
      return await readAsText(file);
    }

    return await readAsText(file);
  }

  function readAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const value = typeof reader.result === 'string' ? reader.result : '';
        resolve(value || 'No readable text found in the uploaded file.');
      };
      reader.onerror = () => reject(new Error('Unable to read file.'));
      reader.readAsText(file);
    });
  }

  function readPdfText(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const bytes = new Uint8Array(reader.result || []);
          const decoded = Array.from(bytes)
            .map((value) => String.fromCharCode(value))
            .join('')
            .replace(/[\u0000-\u001F\u007F]/g, ' ');
          const sanitized = decoded.length ? decoded : 'PDF content detected; no readable text payload was extracted.';
          resolve(sanitized || 'No readable text found in the uploaded PDF.');
        } catch (error) {
          resolve('PDF content detected. Sensitive patterns will be flagged in the preview layer, but a full PDF parser is required for browser-native page redaction.');
        }
      };
      reader.onerror = () => {
        resolve('PDF content detected. Sensitive patterns will be flagged in the preview layer, but a full PDF parser is required for browser-native page redaction.');
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function redactSensitiveText(input) {
    const replacements = [
      { pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, replacement: '[EMAIL]' },
      { pattern: /\b(?:\+?\d[\d\s().-]{7,}\d)\b/g, replacement: '[PHONE]' },
      { pattern: /\b(?:\d{4}[- ]?){3}\d{4}\b/g, replacement: '[CARD]' },
      { pattern: /\b(?:\d{3}-\d{2}-\d{4})\b/g, replacement: '[SSN]' },
      { pattern: /\b(?:[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g, replacement: '[PERSON]' },
      { pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replacement: '[IP]' },
      { pattern: /\b(?:[A-Z]\d[A-Z] ?\d[A-Z]\d)\b/g, replacement: '[ADDRESS]' }
    ];

    let output = input;
    for (const entry of replacements) {
      output = output.replace(entry.pattern, entry.replacement);
    }

    return output;
  }

  function showPreviewDialog(name, redactedText, kind) {
    const modal = document.createElement('div');
    modal.className = 'pg-doc-redactor-modal';

    const panel = document.createElement('div');
    panel.className = 'pg-doc-redactor-panel';

    const header = document.createElement('div');
    header.className = 'pg-doc-redactor-header';

    const title = document.createElement('h3');
    title.className = 'pg-doc-redactor-title';
    title.textContent = 'Sensitive content redaction preview';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'pg-doc-redactor-close';
    close.textContent = '×';
    close.addEventListener('click', () => modal.remove());

    const meta = document.createElement('p');
    meta.style.margin = '0 0 14px';
    meta.style.color = '#475569';
    meta.textContent = `File: ${name} • Type: ${kind.toUpperCase()} • This is a prototype redaction preview.`;

    const preview = document.createElement('div');
    preview.className = 'pg-doc-redactor-preview';
    preview.textContent = redactedText;

    const actions = document.createElement('div');
    actions.className = 'pg-doc-redactor-actions';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'pg-doc-redactor-secondary';
    cancel.textContent = 'Close';
    cancel.addEventListener('click', () => modal.remove());

    const apply = document.createElement('button');
    apply.type = 'button';
    apply.className = 'pg-doc-redactor-primary';
    apply.textContent = 'Apply redaction';
    apply.addEventListener('click', () => {
      preview.textContent = redactSensitiveText(preview.textContent || '');
    });

    actions.append(cancel, apply);
    header.append(title, close);
    panel.append(header, meta, preview, actions);
    modal.append(panel);
    document.body.appendChild(modal);
  }
})();
