/**
 * Privacy Guardrail — Review Overlay (Svelte 5 + Shadow DOM)
 *
 * Thin imperative wrapper around the Svelte ReviewOverlay component.
 * Owns the host element, the closed shadow root, the global keyboard
 * shortcuts (Esc / Enter), and the lifecycle of the mounted Svelte
 * component. The Svelte component reads from an OverlayModel instance
 * which holds reactive state and forwards user actions to the
 * OverlayCallbacks supplied by the content script.
 */
import { type PiiSpan } from '../../shared/message-types';
import { type OverlayCallbacks, type PreviewResolver, type PreviewResolverFactory } from './overlay-model';
export declare const OVERLAY_ENTITY_TYPES: readonly import("../../shared/message-types").EntityType[];
export type { OverlayCallbacks, PreviewResolver, PreviewResolverFactory };
/**
 * Shadow DOM overlay for reviewing and correcting PII detections.
 *
 * The constructor signature is preserved from the previous vanilla-TS
 * implementation so the call site in content-script.ts requires no
 * change. The `theme` parameter is kept for backwards compatibility but
 * is currently ignored — the popup and options page render in a single
 * light style and the overlay matches that unconditionally.
 */
export declare class ReviewOverlay {
    private host;
    private shadow;
    private model;
    private callbacks;
    private app;
    private keyboardHandler;
    constructor(originalText: string, spans: PiiSpan[], callbacks: OverlayCallbacks, confidenceThreshold: number | ((span: PiiSpan) => number), timings?: {
        totalMs: number;
    }, _theme?: 'dark' | 'light', previewResolverFactory?: PreviewResolverFactory);
    /** Show the overlay in the DOM. */
    show(): void;
    /** Remove the overlay from the DOM. Idempotent. */
    destroy(): void;
    private attachKeyboardShortcuts;
}
//# sourceMappingURL=overlay.d.ts.map