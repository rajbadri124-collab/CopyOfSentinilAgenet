"use strict";
const STORAGE_KEY = 'pg_dom_masker_vault';
const SETTINGS_KEY = 'pg_settings';
const DEFAULT_GROUPS = {
    Identity: true,
    Email: true,
    Phone: true,
    Address: true,
    Financial: true,
    Network: true,
    Location: true,
    Password: true,
    Organization: true,
    'Low-signal': false,
};
const GROUP_FOR_CATEGORY = {
    PERSON: 'Identity',
    USERNAME: 'Identity',
    EMAIL: 'Email',
    PHONE: 'Phone',
    ADDRESS: 'Address',
    CREDIT_CARD: 'Financial',
    IBAN: 'Financial',
    BANK_ACCOUNT: 'Financial',
    SSN: 'Financial',
    IP_ADDRESS: 'Network',
    LOCATION: 'Location',
    PASSWORD: 'Password',
    ORGANIZATION: 'Organization',
    URL: 'Low-signal',
    DATE: 'Low-signal',
    MISC: 'Low-signal',
};
function normalizeGroupsEnabled(groupsEnabled = {}) {
    const normalized = { ...DEFAULT_GROUPS, ...(groupsEnabled ?? {}) };
    if (Object.prototype.hasOwnProperty.call(groupsEnabled, 'Contact')) {
        const value = groupsEnabled.Contact;
        normalized.Email = value;
        normalized.Phone = value;
        normalized.Address = value;
    }
    return normalized;
}
const scanners = [
    { category: 'EMAIL', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
    {
        category: 'PHONE',
        pattern: /\b(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g,
    },
    {
        category: 'DATE',
        pattern: /\b(?:\d{1,2}[/-]\d{1,2}[/-](?:\d{2}|\d{4})|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/g,
    },
    { category: 'CREDIT_CARD', pattern: /\b(?:\d[ -]*?){13,19}\b/g },
    { category: 'SSN', pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
    { category: 'IP_ADDRESS', pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
    { category: 'ADDRESS', pattern: /\b\d{1,5}\s+[A-Z][A-Za-z0-9.'-]*(?:\s+[A-Za-z0-9.'-]+){1,5}\s+(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way)\b/gi },
    { category: 'PASSWORD', pattern: /\b(?:password|passcode|passwd|pwd)\s*[:=]\s*\S+/gi },
];
const rawToToken = new Map();
const tokenToRaw = new Map();
const nextIndex = {
    EMAIL: 1,
    PHONE: 1,
    DATE: 1,
    CREDIT_CARD: 1,
    SSN: 1,
    IP_ADDRESS: 1,
    ADDRESS: 1,
    PASSWORD: 1,
};
const updatingInputs = new WeakSet();
const authenticationGrace = new WeakMap();
const AUTHENTICATION_GRACE_MS = 8000;
let saveTimer;
let settings = { enabled: true, groupsEnabled: { ...DEFAULT_GROUPS } };
function publishVault() {
    window.postMessage({
        type: 'PG_VAULT_ENTRIES',
        entries: Array.from(rawToToken.entries()),
    }, '*');
}
function getChromeStorage() {
    const extensionChrome = globalThis.chrome;
    return extensionChrome?.storage.local;
}
function categoryEnabled(category) {
    return settings.enabled !== false && settings.groupsEnabled[GROUP_FOR_CATEGORY[category] ?? 'Low-signal'] !== false;
}
async function loadSettings() {
    const storage = getChromeStorage();
    if (!storage)
        return;
    try {
        const stored = (await storage.get(SETTINGS_KEY))[SETTINGS_KEY] ?? {};
        settings = {
            enabled: stored.enabled !== false,
            groupsEnabled: normalizeGroupsEnabled(stored.groupsEnabled ?? {}),
        };
    }
    catch {
        // Defaults keep masking enabled when settings are unavailable.
    }
}
function restoreMaskedContent() {
    if (!document.body)
        return;
    const restore = (value) => {
        let restored = value;
        for (const [token, raw] of tokenToRaw)
            restored = restored.replaceAll(token, raw);
        return restored;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        if (!isSkippableTextNode(node))
            node.nodeValue = restore(node.nodeValue ?? '');
    }
    document.querySelectorAll('input, textarea').forEach((input) => {
        if (!isAuthenticationForm(input))
            input.value = restore(input.value);
    });
}
async function loadVault() {
    const storage = getChromeStorage();
    if (!storage)
        return;
    try {
        const stored = await storage.get(STORAGE_KEY);
        const storedEntries = stored[STORAGE_KEY];
        if (!storedEntries || typeof storedEntries !== 'object')
            return;
        for (const [token, raw] of Object.entries(storedEntries)) {
            if (typeof raw !== 'string')
                continue;
            tokenToRaw.set(token, raw);
            rawToToken.set(raw, token);
            const match = /^\[REDACTED_([A-Z_]+)_(\d+)\]$/.exec(token);
            if (match) {
                const category = match[1];
                nextIndex[category] = Math.max(nextIndex[category], Number(match[2]) + 1);
            }
        }
        publishVault();
    }
    catch {
        // Masking remains useful when storage is unavailable or temporarily locked.
    }
}
function persistVault() {
    if (saveTimer)
        clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
        const storage = getChromeStorage();
        if (!storage)
            return;
        try {
            await storage.set({ [STORAGE_KEY]: Object.fromEntries(tokenToRaw) });
        }
        catch {
            // A later mutation will retry persistence after the storage API recovers.
        }
    }, 0);
}
function tokenFor(raw, category) {
    const existingToken = rawToToken.get(raw);
    if (existingToken)
        return existingToken;
    const token = `[REDACTED_${category}_${nextIndex[category]++}]`;
    rawToToken.set(raw, token);
    tokenToRaw.set(token, raw);
    publishVault();
    persistVault();
    return token;
}
function maskText(rawText) {
    let maskedText = rawText;
    // Replace this scanner pipeline with the existing WASM regex engine when it
    // is available in the content-script bundle.
    for (const scanner of scanners) {
        if (!categoryEnabled(scanner.category))
            continue;
        maskedText = maskedText.replace(scanner.pattern, (raw) => tokenFor(raw, scanner.category));
    }
    // The existing ONNX Runtime NER provider can add model-based spans here.
    return maskedText;
}
function isSkippableTextNode(node) {
    const parent = node.parentElement;
    return Boolean(parent?.closest('script, style, noscript, template, textarea, input, [contenteditable="false"]'));
}
function maskTextNode(node) {
    if (isSkippableTextNode(node))
        return;
    const maskedText = maskText(node.nodeValue ?? '');
    if (maskedText === node.nodeValue)
        return;
    node.nodeValue = maskedText;
}
function isAuthenticationField(input) {
    const autocomplete = input.getAttribute('autocomplete')?.toLowerCase() ?? '';
    const name = `${input.name} ${input.id} ${input.getAttribute('aria-label') ?? ''}`.toLowerCase();
    return input.type === 'password' ||
        autocomplete.includes('username') ||
        autocomplete.includes('current-password') ||
        autocomplete.includes('new-password') ||
        /user(name)?|email|login|password|passcode|otp|verification/.test(name);
}
function isAuthenticationForm(input) {
    const form = input.form;
    const pageLooksLikeLogin = /login|log-in|signin|sign-in|auth|account|session|register|signup|sign-up/i.test(`${location.pathname} ${document.title}`);
    return Boolean(isAuthenticationField(input) ||
        form?.querySelector('input[type="password"], input[autocomplete="current-password"], input[autocomplete="new-password"]') ||
        pageLooksLikeLogin);
}
function maskInput(input) {
    if (updatingInputs.has(input))
        return;
    if (isAuthenticationForm(input)) {
        if (!authenticationGrace.has(input)) {
            authenticationGrace.set(input, window.setTimeout(() => authenticationGrace.delete(input), AUTHENTICATION_GRACE_MS));
        }
        return;
    }
    const maskedValue = maskText(input.value);
    if (maskedValue === input.value)
        return;
    updatingInputs.add(input);
    input.value = maskedValue;
    updatingInputs.delete(input);
}
function sanitizeRoot(root) {
    if (root.nodeType === Node.TEXT_NODE) {
        maskTextNode(root);
        return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE)
        return;
    const element = root;
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        maskInput(element);
    }
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode()))
        maskTextNode(node);
    element.querySelectorAll('input, textarea').forEach((field) => {
        maskInput(field);
    });
}
function observeDom() {
    if (!document.body)
        return;
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(sanitizeRoot);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    document.addEventListener('input', (event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            maskInput(target);
        }
    }, true);
    sanitizeRoot(document.body);
}
async function startDomMasker() {
    await loadSettings();
    await loadVault();
    const extensionChrome = globalThis.chrome;
    extensionChrome?.storage?.onChanged?.addListener((changes, area) => {
        if (area !== 'local' || !changes[SETTINGS_KEY])
            return;
        const next = changes[SETTINGS_KEY].newValue ?? {};
        settings = {
            enabled: next.enabled !== false,
            groupsEnabled: { ...DEFAULT_GROUPS, ...(next.groupsEnabled ?? {}) },
        };
        restoreMaskedContent();
        if (settings.enabled && document.body)
            sanitizeRoot(document.body);
    });
    if (document.body) {
        observeDom();
    }
    else {
        document.addEventListener('DOMContentLoaded', observeDom, { once: true });
    }
}
void startDomMasker();
