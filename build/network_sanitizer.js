"use strict";
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /\b(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/g;
const DATE_PATTERN = /\b(?:\d{1,2}[/-]\d{1,2}[/-](?:\d{2}|\d{4})|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/g;
const TOKEN_PATTERN = /^\[REDACTED_[A-Z_]+_\d+\]$/;
const SETTINGS_KEY = 'pg_settings';
const DEFAULT_GROUPS = { Identity: true, Email: true, Phone: true, Address: true, Financial: true, Network: true, Location: true, Password: true, Organization: true, 'Low-signal': false };
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
const rawToToken = new Map();
const counters = { EMAIL: 1, PHONE: 1, DATE: 1 };
let settings = { enabled: true, groupsEnabled: { ...DEFAULT_GROUPS } };
function categoryEnabled(category) {
    return settings.enabled !== false && settings.groupsEnabled[GROUP_FOR_CATEGORY[category]] !== false;
}
async function loadSettings() {
    const storage = globalThis.chrome?.storage?.local;
    if (!storage)
        return;
    try {
        const stored = (await storage.get(SETTINGS_KEY))[SETTINGS_KEY] ?? {};
        settings = { enabled: stored.enabled !== false, groupsEnabled: normalizeGroupsEnabled(stored.groupsEnabled ?? {}) };
    }
    catch {
        // Defaults preserve the existing interceptor behavior if storage is unavailable.
    }
}
function isAuthenticationContext() {
    return /login|log-in|signin|sign-in|auth|account|session|register|signup|sign-up/i.test(`${location.pathname} ${document.title}`) || Boolean(document.querySelector('input[type="password"], input[autocomplete="current-password"], input[autocomplete="new-password"]'));
}
function tokenFor(raw, category) {
    const existing = rawToToken.get(raw);
    if (existing)
        return existing;
    const token = `[REDACTED_${category}_${counters[category]++}]`;
    rawToToken.set(raw, token);
    return token;
}
function sanitizeText(value) {
    let sanitized = categoryEnabled('EMAIL') ? value.replace(EMAIL_PATTERN, (raw) => tokenFor(raw, 'EMAIL')) : value;
    sanitized = categoryEnabled('PHONE') ? sanitized.replace(PHONE_PATTERN, (raw) => tokenFor(raw, 'PHONE')) : sanitized;
    sanitized = categoryEnabled('DATE') ? sanitized.replace(DATE_PATTERN, (raw) => tokenFor(raw, 'DATE')) : sanitized;
    if (categoryEnabled('CREDIT_CARD'))
        sanitized = sanitized.replace(/\b(?:\d[ -]*?){13,19}\b/g, (raw) => tokenFor(raw, 'CREDIT_CARD'));
    if (categoryEnabled('SSN'))
        sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, (raw) => tokenFor(raw, 'SSN'));
    if (categoryEnabled('IP_ADDRESS'))
        sanitized = sanitized.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, (raw) => tokenFor(raw, 'IP_ADDRESS'));
    if (categoryEnabled('ADDRESS'))
        sanitized = sanitized.replace(/\b\d{1,5}\s+[A-Z][A-Za-z0-9.'-]*(?:\s+[A-Za-z0-9.'-]+){1,5}\s+(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way)\b/gi, (raw) => tokenFor(raw, 'ADDRESS'));
    if (categoryEnabled('PASSWORD'))
        sanitized = sanitized.replace(/\b(?:password|passcode|passwd|pwd)\s*[:=]\s*\S+/gi, (raw) => tokenFor(raw, 'PASSWORD'));
    return sanitized;
}
function sanitizeBody(body) {
    try {
        const parsed = JSON.parse(body);
        const sanitizeValue = (value) => {
            if (typeof value === 'string')
                return sanitizeText(value);
            if (Array.isArray(value))
                return value.map(sanitizeValue);
            if (value && typeof value === 'object') {
                return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeValue(item)]));
            }
            return value;
        };
        return JSON.stringify(sanitizeValue(parsed));
    }
    catch {
        return sanitizeText(body);
    }
}
function sanitizeFormData(data) {
    const sanitized = new FormData();
    data.forEach((value, key) => {
        sanitized.append(key, typeof value === 'string' ? sanitizeText(value) : value);
    });
    return sanitized;
}
function installFetchInterceptor() {
    const nativeFetch = window.fetch;
    window.fetch = async function guardedFetch(input, init) {
        if (isAuthenticationContext())
            return nativeFetch.call(this, input, init);
        if (!init?.body && input instanceof Request && !['GET', 'HEAD'].includes(input.method)) {
            const originalBody = await input.clone().text();
            if (originalBody) {
                return nativeFetch.call(this, new Request(input, { body: sanitizeBody(originalBody) }));
            }
        }
        if (!init?.body)
            return nativeFetch.call(this, input, init);
        const nextInit = { ...init };
        if (typeof init.body === 'string')
            nextInit.body = sanitizeBody(init.body);
        else if (init.body instanceof URLSearchParams)
            nextInit.body = sanitizeText(init.body.toString());
        else if (init.body instanceof FormData)
            nextInit.body = sanitizeFormData(init.body);
        return nativeFetch.call(this, input, nextInit);
    };
}
function installXhrInterceptor() {
    const nativeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function guardedSend(body) {
        if (isAuthenticationContext()) {
            nativeSend.call(this, body);
            return;
        }
        let nextBody = body;
        if (typeof body === 'string')
            nextBody = sanitizeBody(body);
        else if (body instanceof URLSearchParams)
            nextBody = sanitizeText(body.toString());
        else if (body instanceof FormData)
            nextBody = sanitizeFormData(body);
        nativeSend.call(this, nextBody);
    };
}
function installNetworkSanitizer() {
    void loadSettings();
    globalThis.chrome?.storage?.onChanged?.addListener((changes, area) => {
        if (area !== 'local' || !changes[SETTINGS_KEY])
            return;
        const stored = changes[SETTINGS_KEY].newValue ?? {};
        settings = { enabled: stored.enabled !== false, groupsEnabled: normalizeGroupsEnabled(stored.groupsEnabled ?? {}) };
    });
    window.addEventListener('message', (event) => {
        if (event.source !== window || event.data?.type !== 'PG_SETTINGS')
            return;
        const stored = event.data.settings ?? {};
        settings = { enabled: stored.enabled !== false, groupsEnabled: { ...DEFAULT_GROUPS, ...(stored.groupsEnabled ?? {}) } };
    });
    window.addEventListener('message', (event) => {
        if (event.source !== window || !event.data || event.data.type !== 'PG_VAULT_ENTRIES')
            return;
        for (const entry of event.data.entries) {
            if (!Array.isArray(entry))
                continue;
            const [raw, token] = entry;
            if (typeof raw === 'string' && typeof token === 'string' && TOKEN_PATTERN.test(token)) {
                rawToToken.set(raw, token);
            }
        }
    });
    installFetchInterceptor();
    installXhrInterceptor();
}
installNetworkSanitizer();
