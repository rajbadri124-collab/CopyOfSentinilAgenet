import type { SiteAdapter } from './site-adapters/adapter-interface';
import type { PiiSpan } from '../shared/message-types';
export type CanceledPasteDecision = 'paste-original' | 'drop';
export interface PasteInterceptorCallbacks {
    onAnalyzing: () => void;
    onNoPii: (text: string) => void;
    onPiiDetected: (text: string, spans: PiiSpan[], timings?: {
        totalMs: number;
    }) => void;
    onError: (error: string) => void;
    onCanceled: (explicitUserCancel?: boolean) => void;
    onExplicitCancelDecision?: (text: string) => Promise<CanceledPasteDecision> | CanceledPasteDecision;
    /**
     * Reports whether the site adapter still resolves the page's message box.
     *
     * `false` says protection just failed silently: either a paste this
     * interceptor would have reviewed fell through unreviewed, or reviewed text
     * had nowhere to be inserted. `true` says a lookup succeeded and clears
     * that state — a supported site can stop matching for one route or one
     * moment of a page's build and match again afterwards.
     *
     * Deliberately asymmetric: a successful lookup is proof on its own, while a
     * failed one is only reported for a paste that mattered (see
     * `reportUnattachedPaste`).
     */
    onComposerLookup?: (found: boolean) => void;
}
export interface PasteInterceptorOptions {
    /** Delays detection until the content script has restored its local state. */
    waitForReady?: () => Promise<void>;
}
/**
 * Manages paste event interception on a monitored LLM chat page.
 */
export declare class PasteInterceptor {
    private adapter;
    private callbacks;
    private enabled;
    private requestCounter;
    private activeRequestId;
    private canceledRequestIds;
    private savedSelection;
    private activePasteText;
    private activeTarget;
    private waitForReady;
    constructor(adapter: SiteAdapter, callbacks: PasteInterceptorCallbacks, options?: PasteInterceptorOptions);
    /** Start listening for paste events on the input element. */
    start(): void;
    /** Stop listening for paste events. */
    stop(): void;
    /** Enable or disable interception. */
    setEnabled(enabled: boolean): void;
    cancelActiveDetection(): void;
    private handlePaste;
    private handleKeyDown;
    /**
     * Report a paste that fell through because the adapter resolved no message
     * box — the failure mode that made the signed-out ChatGPT build (#32)
     * invisible: the page looked protected while every paste went unreviewed.
     *
     * Restricted to pastes this interceptor would otherwise have taken: a
     * target that could plausibly have been the message box, and enough text to
     * clear `MIN_PASTE_LENGTH`. With no composer resolved there is nothing to
     * run the usual containment check against, and this drives a warning the
     * user sees, so the target itself has to carry the judgement.
     */
    private reportUnattachedPaste;
    private processPaste;
    private analyze;
    private resolveExplicitCancellation;
    /** Restore the saved cursor position so text inserts at the original caret. */
    private restoreSelection;
    /** Insert original text into input (fallback on error). */
    pasteOriginal(text: string): void;
    /** Insert anonymized text into input. */
    pasteAnonymized(text: string): void;
    /**
     * Insert into the message box, reporting the lookup either way.
     *
     * A message box that disappears between the paste and this insert takes the
     * user's text with it — the review ran, and its result lands nowhere. That
     * used to be a bare `if (input)` with no else, which is the same silence
     * this signal exists to end.
     */
    private insertIntoComposer;
}
//# sourceMappingURL=paste-interceptor.d.ts.map