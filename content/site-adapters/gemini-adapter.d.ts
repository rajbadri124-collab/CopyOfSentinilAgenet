import type { SiteAdapter } from './adapter-interface';
export declare class GeminiAdapter implements SiteAdapter {
    readonly name = "Gemini";
    hasConversationId(url: string): boolean;
    getInputElement(): HTMLElement | null;
    getResponseElements(): HTMLElement[];
    insertText(element: HTMLElement, text: string): void;
    observeResponses(callback: (element: HTMLElement) => void): MutationObserver;
}
//# sourceMappingURL=gemini-adapter.d.ts.map