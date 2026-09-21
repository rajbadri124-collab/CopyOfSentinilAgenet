"use strict";
const STORAGE_KEY = 'pg_dom_masker_vault';
const TOKEN_PATTERN = /^\[REDACTED_(EMAIL|PHONE|DATE)_\d+\]$/;
const tokenToRaw = new Map();
const rawToToken = new Map();
const replayingForms = new WeakSet();
function getChromeStorage() {
    const extensionChrome = globalThis.chrome;
    return extensionChrome?.storage.local;
}
async function loadVault() {
    const storage = getChromeStorage();
    if (!storage)
        return;
    try {
        const stored = await storage.get(STORAGE_KEY);
        const entries = stored[STORAGE_KEY];
        if (!entries || typeof entries !== 'object')
            return;
        for (const [token, raw] of Object.entries(entries)) {
            if (TOKEN_PATTERN.test(token) && typeof raw === 'string') {
                tokenToRaw.set(token, raw);
                rawToToken.set(raw, token);
            }
        }
    }
    catch {
        // A missing vault leaves values unchanged rather than guessing replacements.
    }
}
function fieldsIn(root) {
    return Array.from(root.querySelectorAll('input, textarea, select'));
}
function restoreField(field) {
    const raw = tokenToRaw.get(field.value);
    if (raw !== undefined)
        field.value = raw;
}
function maskField(field) {
    const token = rawToToken.get(field.value);
    if (token !== undefined)
        field.value = token;
}
function restoreForm(form) {
    fieldsIn(form).forEach(restoreField);
}
function maskForm(form) {
    fieldsIn(form).forEach(maskField);
}
function rewriteFormData(event) {
    event.formData.forEach((value, name) => {
        if (typeof value !== 'string')
            return;
        const raw = tokenToRaw.get(value);
        if (raw !== undefined)
            event.formData.set(name, raw);
    });
}
function startRehydrator() {
    document.addEventListener('change', (event) => {
        const field = event.target;
        if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) {
            return;
        }
        restoreField(field);
        queueMicrotask(() => maskField(field));
    }, true);
    document.addEventListener('submit', (event) => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement))
            return;
        if (replayingForms.has(form)) {
            replayingForms.delete(form);
            return;
        }
        restoreForm(form);
        queueMicrotask(() => maskForm(form));
    }, true);
    // Native form submission serializes this payload after the submit event.
    // Rewrite it directly so the DOM can be masked again immediately.
    document.addEventListener('formdata', rewriteFormData, true);
}
void loadVault().then(startRehydrator);
