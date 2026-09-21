import type { PiiSpan } from './message-types';
import { EntityMap } from './entity-map';
import { type IdentityVaultData, type IdentityRecord, type ReplacementMode } from './identity-vault';
export interface AnonymizeResult {
    text: string;
    entityMap: EntityMap;
}
/**
 * Vault-aware anonymisation result. In addition to the rendered text and
 * the conversation EntityMap (kept for backwards compatibility with the
 * de-anon banner), it returns the mutated vault data — the caller is
 * expected to persist it via `saveIdentityVault` — and the list of
 * records that were referenced. The latter is useful for telemetry /
 * "Items used in this paste" UI affordances.
 */
export interface VaultAnonymizeResult extends AnonymizeResult {
    vaultData: IdentityVaultData;
    recordsTouched: IdentityRecord[];
}
/**
 * Anonymize text by replacing detected PII spans with typed placeholders.
 *
 * This is the simple, vault-less path retained for backwards compatibility
 * with tests and any caller that does not need cross-session memory.
 * Production code paths should prefer `anonymizeWithVault`.
 *
 * @param originalText - The original text
 * @param spans - Detected PII spans (must not overlap; run merger first)
 * @param existingMap - Optional existing EntityMap to extend (for multi-paste conversations)
 * @returns The anonymized text and the updated entity map
 */
export declare function anonymize(originalText: string, spans: PiiSpan[], existingMap?: EntityMap): AnonymizeResult;
/**
 * Vault-aware anonymisation. Looks up each detected span in the vault
 * (creating a new record on miss) and emits the canonical replacement —
 * either the typed placeholder or a realistic synthetic value, depending
 * on the record's per-record `replacementMode` (with `defaultMode` as
 * fallback).
 *
 * Cross-session/cross-provider consistency is achieved naturally: the
 * vault is shared across all conversations and providers in
 * `chrome.storage.local`, so re-pasting the same identity always yields
 * the same replacement.
 *
 * The returned `entityMap` mirrors the chosen replacements so the
 * de-anonymisation banner can still operate without re-loading the
 * vault, and so the WASM-side merger view remains unaware of the vault.
 *
 * @param originalText — text to anonymise.
 * @param spans — detected PII spans, non-overlapping, sorted or unsorted.
 * @param vaultData — current vault state. Mutated in place; caller saves.
 * @param defaultMode — replacement mode to use for records that don't
 *   have an explicit `replacementMode` (effectively "global default").
 * @param existingMap — conversation-scoped EntityMap to extend.
 */
export declare function anonymizeWithVault(originalText: string, spans: PiiSpan[], vaultData: IdentityVaultData, defaultMode: ReplacementMode, existingMap?: EntityMap): VaultAnonymizeResult;
//# sourceMappingURL=anonymizer.d.ts.map