/**
 * Privacy Guardrail — Review Overlay state model
 *
 * Holds the reactive state for the Svelte review overlay using Svelte
 * stores (the established pattern in this codebase — see
 * src/popup/popup-model.svelte.ts). Wraps the OverlayCallbacks so
 * components only need to call model methods; the model emits feedback
 * entries identical to the previous vanilla-TS implementation.
 */
import { type Readable, type Writable } from 'svelte/store';
import type { EntityType, FeedbackEntry, PiiSpan } from '../../shared/message-types';
export interface OverlayCallbacks {
    onConfirm: (approvedSpans: PiiSpan[]) => void;
    onPasteOriginal: () => void;
    onCancel: () => void;
    onFeedback: (entry: FeedbackEntry) => void;
    onAddToAllowlist: (text: string) => void;
    onEditDetails: (text: string) => void;
}
export interface SpanState {
    span: PiiSpan;
    enabled: boolean;
    entityType: EntityType;
    manualOverride: boolean;
    whitelisted: boolean;
}
export interface DismissMenuState {
    index: number;
    spanText: string;
    anchorRect: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}
export type ThresholdResolver = (span: PiiSpan) => number;
/**
 * Returns the replacement string the real anonymiser would emit for a
 * given span. Resolvers may hold per-pass state (e.g. dedup new identities
 * by normalised text), so a fresh resolver is built for every preview
 * rebuild via `PreviewResolverFactory`.
 */
export type PreviewResolver = (span: PiiSpan) => string;
export type PreviewResolverFactory = () => PreviewResolver;
export declare class OverlayModel {
    readonly originalText: string;
    readonly timings?: {
        totalMs: number;
    };
    private readonly thresholdFn;
    private readonly callbacks;
    private destroyed;
    spanStates: Writable<SpanState[]>;
    manualSpans: Writable<PiiSpan[]>;
    confidenceThreshold: Writable<number>;
    selectedSnippet: Writable<string | null>;
    dismissMenu: Writable<DismissMenuState | null>;
    totalCount: Readable<number>;
    enabledCount: Readable<number>;
    highlightedHtml: Readable<string>;
    previewText: Readable<string>;
    mainIndices: Readable<number[]>;
    codeBlockIndices: Readable<number[]>;
    private readonly previewResolverFactory;
    constructor(originalText: string, spans: PiiSpan[], callbacks: OverlayCallbacks, confidenceThreshold: number | ThresholdResolver, timings?: {
        totalMs: number;
    }, previewResolverFactory?: PreviewResolverFactory);
    /**
     * Effective threshold for a span. The slider acts as a "min confidence"
     * floor — when the adaptive resolver is configured we take the higher of
     * the adaptive value and the slider, so dragging the slider up always
     * tightens the gate (but never loosens it below the adaptive baseline).
     */
    thresholdFor(span: PiiSpan): number;
    isBelowThreshold(state: SpanState): boolean;
    toggle(index: number, enabled: boolean): void;
    retype(index: number, newType: EntityType): void;
    openDismissMenu(index: number, anchorRect: DismissMenuState['anchorRect']): void;
    closeDismissMenu(): void;
    /**
     * Persistence choice from the dismiss menu:
     *  - 'none'     → just this time, no allowlist write
     *  - 'value'    → also add the exact value to the allowlist
     *  - 'pattern'  → also open options page so the user can craft a pattern
     */
    confirmDismiss(persist: 'none' | 'value' | 'pattern'): void;
    removeManual(index: number): void;
    addManual(text: string, entityType: EntityType): boolean;
    setSelectedSnippet(text: string | null): void;
    setThreshold(value: number): void;
    confirm(): PiiSpan[];
    pasteOriginal(): void;
    cancel(): void;
    isDestroyed(): boolean;
    private extractContext;
}
export declare function truncate(text: string, maxLen: number): string;
//# sourceMappingURL=overlay-model.d.ts.map