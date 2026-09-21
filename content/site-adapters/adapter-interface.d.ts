/**
 * Interface for site-specific DOM adapters.
 * Each LLM chat site has different DOM structure — adapters abstract those differences.
 */
export interface SiteAdapter {
    /** Human-readable site name for logging. */
    readonly name: string;
    /** Find the main chat input element (contentEditable div or textarea). */
    getInputElement(): HTMLElement | null;
    /** Find all AI response elements currently in the DOM. */
    getResponseElements(): HTMLElement[];
    /**
     * Insert text into the input element in a way that the site's framework
     * (React, ProseMirror, etc.) recognizes as user input.
     */
    insertText(element: HTMLElement, text: string): void;
    /**
     * Set up a MutationObserver to watch for new AI response elements.
     * Calls the callback with each new response element.
     */
    observeResponses(callback: (element: HTMLElement) => void): MutationObserver;
    /**
     * True when the URL identifies a persisted conversation rather than the
     * site's "new chat" screen.
     *
     * Every supported site creates a conversation on the first send and then
     * rewrites the URL in place (`/new` -> `/chat/<uuid>`, `/` -> `/c/<uuid>`,
     * ...). Placeholder mappings recorded before that rewrite are filed under
     * the transient URL and would be unreachable on the next visit, so the
     * content script uses this to detect the rewrite and move them across.
     *
     * Adapters that do not implement it keep the old behaviour: the URL at
     * load time is used for the lifetime of the page.
     */
    hasConversationId?(url: string): boolean;
}
/** Path portion of a URL, tolerant of values that are not parseable. */
export declare function urlPath(url: string): string;
/**
 * True when the element is a form control whose caret lives on
 * `selectionStart`/`selectionEnd` rather than in a DOM Range.
 *
 * Composers built on `<textarea>` (ChatGPT's current web client) must not be
 * driven through `window.getSelection()`: a textarea's internal caret is not
 * addressable as a Range, so adding one moves the selection outside the
 * control and the insert lands in the wrong place — or nowhere.
 *
 * Uses `tagName` rather than `instanceof` so the check also holds for
 * elements from another realm (e.g. inside an iframe).
 */
export declare function isTextFormControl(element: HTMLElement | null): element is HTMLTextAreaElement | HTMLInputElement;
/**
 * Insert text using execCommand (deprecated but most reliable for contentEditable).
 * Falls back to InputEvent dispatch if execCommand fails.
 */
export declare function insertTextCompat(element: HTMLElement, text: string): void;
//# sourceMappingURL=adapter-interface.d.ts.map