import type { NerStatus, SystemCompatibilityStatus } from './message-types';
export type ChipReason = 'composer-not-found' | 'low-memory-protection' | 'enabled-despite-low-memory' | 'pattern-only' | 'model-failed' | 'low-memory-warning' | 'unknown-memory' | 'running-on-cpu';
export interface ChipReasonInputs {
    status: SystemCompatibilityStatus | null | undefined;
    nerStatus?: NerStatus | null;
    /**
     * True once this page could not resolve the site's message box, so a paste
     * that would have been reviewed went through unreviewed instead. Cleared
     * again as soon as a lookup succeeds.
     */
    composerMissing?: boolean;
}
/**
 * Derive the single chip reason to display, or null when no degraded
 * protection state applies. The one-time critical modal owns the
 * `low-memory-protection` surface while it is still pending; suppressing
 * the chip in that window prevents duplicate contradictory messaging.
 */
export declare function deriveChipReason({ status, nerStatus, composerMissing, }: ChipReasonInputs): ChipReason | null;
export interface ChipMessage {
    title: string;
    detail: string;
}
export declare function chipReasonMessageForStatus(reason: ChipReason, status?: SystemCompatibilityStatus | null): ChipMessage;
export declare function chipReasonMessage(reason: ChipReason): ChipMessage;
//# sourceMappingURL=page-status-chip-reason.d.ts.map