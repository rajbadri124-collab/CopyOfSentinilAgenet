import type { SiteAdapter } from './adapter-interface';
/**
 * Generic fallback adapter that uses common attribute selectors.
 * Used when no site-specific adapter matches the current hostname.
 */
export declare class GenericAdapter implements SiteAdapter {
    readonly name = "Generic";
    getInputElement(): HTMLElement | null;
    getResponseElements(): HTMLElement[];
    insertText(element: HTMLElement, text: string): void;
    observeResponses(_callback: (element: HTMLElement) => void): MutationObserver;
}
//# sourceMappingURL=generic-adapter.d.ts.map