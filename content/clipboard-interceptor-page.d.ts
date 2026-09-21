/**
 * Privacy Guardrail — Clipboard Interceptor (page / main world)
 *
 * Runs in the page's main world at document_start. Monkey-patches
 * `navigator.clipboard.writeText` and (defensively) `Clipboard.prototype`
 * methods so the isolated-world coordinator sees writes triggered by the
 * page. The patch never blocks: the original is called first and the
 * postMessage notification is fired right after.
 *
 * This is one of two trigger sources the coordinator listens to. The
 * other is a bubble-phase `copy` DOM event listener in the isolated
 * world, which catches sites that copy via `clipboardData.setData(...)`
 * and `document.execCommand('copy')` without ever calling `writeText`.
 *
 * Captured-original discipline:
 *   - The original `writeText` reference is captured ONCE at boot. Every
 *     extension-driven write (the postMessage Replace round-trip) goes
 *     through that captured reference, never through the patched one.
 */
declare const SOURCE = "pg-clipboard-intercept";
interface InterceptedMessage {
    source: typeof SOURCE;
    kind: 'WRITE_INTERCEPTED';
    text: string;
    requestId: string;
}
interface ReplaceMessage {
    source: typeof SOURCE;
    kind: 'REPLACE_CLIPBOARD';
    text: string;
    requestId: string;
}
//# sourceMappingURL=clipboard-interceptor-page.d.ts.map