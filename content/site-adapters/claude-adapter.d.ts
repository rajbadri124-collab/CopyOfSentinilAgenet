import type { SiteAdapter } from './adapter-interface';
export declare class ClaudeAdapter implements SiteAdapter {
    readonly name = "Claude";
    hasConversationId(url: string): boolean;
    getInputElement(): HTMLElement | null;
    getResponseElements(): HTMLElement[];
    insertText(element: HTMLElement, text: string): void;
    observeResponses(callback: (element: HTMLElement) => void): MutationObserver;
}
//# sourceMappingURL=claude-adapter.d.ts.map