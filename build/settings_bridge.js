"use strict";

const SETTINGS_KEY = 'pg_settings';

function publish(settings) {
    window.postMessage({ type: 'PG_SETTINGS', settings }, '*');
}

async function loadSettings() {
    try {
        const result = await chrome.storage.local.get(SETTINGS_KEY);
        publish(result[SETTINGS_KEY] ?? {});
    }
    catch {
        // The interceptors retain their enabled defaults until storage is available.
    }
}

void loadSettings();
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[SETTINGS_KEY])
        publish(changes[SETTINGS_KEY].newValue ?? {});
});
