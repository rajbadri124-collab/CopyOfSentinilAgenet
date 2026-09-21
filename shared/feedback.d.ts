import type { AllowlistEntry, BlocklistEntry, PiiSpan } from './message-types';
/**
 * Compute adaptive confidence thresholds per entity type based on user feedback.
 *
 * When users frequently dismiss a particular entity type (false positives),
 * the threshold for that type increases. When users frequently add missed
 * entities, the threshold decreases.
 */
export declare function computeAdaptiveThresholds(baseThreshold: number): Promise<Record<string, number>>;
/**
 * Filter spans whose full text is matched by any allowlist entry.
 * Matching is whole-word, case-insensitive, with * wildcard support.
 */
export declare function applyAllowlist(spans: PiiSpan[], allowlist: AllowlistEntry[]): PiiSpan[];
/**
 * Filter spans covered by any allowlist entry matched against the original text.
 * This catches detector output that splits an allowlisted phrase into smaller
 * spans, e.g. "John" and "Doe" when "John Doe" is allowlisted.
 */
export declare function applyAllowlistToText(text: string, spans: PiiSpan[], allowlist: AllowlistEntry[]): PiiSpan[];
/**
 * Inject synthetic spans for each blocklist match that no detector already produced.
 * Injected spans get score 1.0 and source 'manual'. Blocklist wins on conflict with
 * the allowlist because this function is called after applyAllowlist — allowlist-suppressed
 * spans are not in `spans`, so blocklist re-injects them.
 */
export declare function applyBlocklist(text: string, spans: PiiSpan[], blocklist: BlocklistEntry[]): PiiSpan[];
/**
 * Apply adaptive thresholds to filter spans per entity type.
 */
export declare function applyAdaptiveThresholds(spans: PiiSpan[], thresholds: Record<string, number>, defaultThreshold: number): PiiSpan[];
//# sourceMappingURL=feedback.d.ts.map