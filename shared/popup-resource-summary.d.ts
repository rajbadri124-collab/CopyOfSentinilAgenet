import type { NerStatus, Settings, SystemCompatibilityStatus } from './message-types';
export type ResourceSummaryTone = 'ok' | 'warning' | 'critical' | 'info' | 'muted';
export interface ResourceSummary {
    tone: ResourceSummaryTone;
    title: string;
    detail: string;
}
/**
 * Derive the popup's compact Local AI resource summary from cached
 * compatibility storage, settings, and (optional) runtime NER status.
 *
 * Returns null on OK systems with Local AI enabled and no CPU/WASM
 * fallback — those systems should stay quiet in the popup.
 */
export declare function deriveResourceSummary(settings: Settings | null, status: SystemCompatibilityStatus | null, nerStatus?: NerStatus | null): ResourceSummary | null;
//# sourceMappingURL=popup-resource-summary.d.ts.map