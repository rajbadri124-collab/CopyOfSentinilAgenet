import type { SiteAdapter } from './site-adapters/adapter-interface';
export interface ResponseObserverCallbacks {
    onResponseWithPlaceholders: (element: HTMLElement, text: string) => void;
    /** Optional sync predicate that returns true when `text` contains a
     *  known synthetic value from the identity vault. The shape gate alone
     *  misses responses that only echo back synthetic strings (e.g.
     *  "Jordan Park"), which have no placeholder-like form. */
    hasKnownSynthetic?: (text: string) => boolean;
}
/**
 * Watches for AI response elements containing anonymized placeholders.
 * Uses debouncing to wait for streaming responses to stabilize.
 */
export declare class ResponseObserver {
    private adapter;
    private callbacks;
    private observer;
    private debounceTimers;
    /** Per-element observers, kept connected for the element's lifetime so
     *  content that streams in after a pause is still noticed. Disconnected
     *  together in `stop()`. */
    private elementObservers;
    private watched;
    /** Text each element was last checked with, so a re-fire that carries no
     *  new content skips the storage read behind `onResponseWithPlaceholders`. */
    private lastCheckedText;
    constructor(adapter: SiteAdapter, callbacks: ResponseObserverCallbacks);
    /** Start observing for AI responses. */
    start(): void;
    /** Stop observing. */
    stop(): void;
    /**
     * Watch a response element for changes (streaming) and check for
     * placeholders once the content stabilizes.
     */
    private watchElement;
    /** Debounced check: resets on every call, fires once content settles. */
    private scheduleCheck;
    private checkForPlaceholders;
}
//# sourceMappingURL=response-observer.d.ts.map