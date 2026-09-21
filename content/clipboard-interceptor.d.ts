/**
 * Privacy Guardrail — Clipboard Interceptor (isolated coordinator)
 *
 * Drives a singleton "Replace with originals" toast. Two trigger sources:
 *
 *   1. `WRITE_INTERCEPTED` postMessages forwarded by the main-world patch
 *      (covers code paths that call `navigator.clipboard.writeText`).
 *   2. Capture + bubble-phase `copy` DOM events on `document` — the path
 *      used by Ctrl+C / right-click → Copy and by copy implementations that
 *      stage text through `clipboardData.setData(...)`. Capture gives manual
 *      selection copies a reliable selection fallback; bubble sees text that
 *      page handlers staged during the event.
 *
 * On Replace, route the de-anonymised text back to the system clipboard.
 * For postMessage triggers we send `REPLACE_CLIPBOARD` to the main world
 * (which uses the captured-original `writeText`); for `copy`-event
 * triggers the isolated world calls `navigator.clipboard.writeText`
 * directly (a different JS world from the page, so the page-world patch
 * doesn't observe it).
 *
 * State is intentionally minimal: the entity-map / vault snapshot is
 * provided by an injected resolver callback, keeping this module
 * decoupled from storage and easily testable.
 */
import type { ResolveResult } from '../shared/placeholder-resolver';
export type ResolveCallback = (text: string) => ResolveResult | Promise<ResolveResult>;
export interface ClipboardInterceptorOptions {
    /** Returns the unified resolver decision for the just-copied text.
     *  Implementations are expected to load the latest conversation
     *  entity map + identity vault, augment, and call `resolveText`. */
    resolve: ResolveCallback;
    /** Theme to render the toast in. Updated via {@link setTheme}. */
    theme?: 'dark' | 'light';
    /** Whether the feature is currently enabled. Updated via
     *  {@link setEnabled}. */
    enabled?: boolean;
}
/** Function that performs the actual clipboard replacement when the
 *  user clicks "Replace with originals". The path that performs the
 *  replacement depends on the trigger source. */
type ReplaceFn = (deAnonText: string) => void;
export declare class ClipboardInterceptor {
    private resolve;
    private theme;
    private enabled;
    private toast;
    /** Most recent "what we just saw copied" — used to suppress duplicate
     *  triggers when both the writeText patch and the `copy` DOM event
     *  fire for one logical user action. */
    private lastSeenText;
    private lastSeenAt;
    private messageListener;
    private copyListener;
    private started;
    constructor(opts: ClipboardInterceptorOptions);
    start(): void;
    stop(): void;
    setEnabled(enabled: boolean): void;
    setTheme(theme: 'dark' | 'light'): void;
    /** Trigger the toast pipeline for an arbitrary copied string. The
     *  `replace` callback is what actually performs the clipboard swap if
     *  the user clicks Replace. Public so tests can drive the coordinator
     *  without round-tripping through DOM events or postMessage. */
    handleCopiedText(text: string, replace: ReplaceFn): Promise<void>;
    /** Test seam preserved from the original API. Routes through the
     *  postMessage-style replace path. */
    handleIntercepted(text: string, requestId: string): Promise<void>;
    private onWindowMessage;
    private onCopy;
    private disposeToast;
}
export {};
//# sourceMappingURL=clipboard-interceptor.d.ts.map