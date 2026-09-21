/**
 * Privacy Guardrail — Identity Vault
 *
 * Global, cross-session, cross-provider mapping between detected PII and
 * the values used to anonymise it. The vault gives three properties that a
 * conversation-scoped EntityMap cannot:
 *
 *   1. **Consistency** — pasting "John Doe" today in ChatGPT and tomorrow in
 *      Claude resolves to the same placeholder/synthetic, so the LLM sees a
 *      stable identity across sessions and the de-anonymisation step never
 *      ambiguates.
 *   2. **User control** — every record is inspectable and editable from the
 *      options page. The user owns the table; pinned records are immune
 *      to automatic mutation.
 *   3. **Synthetic substitution** — each record carries both a typed
 *      placeholder (`[PERSON_3]`) and a realistic synthetic
 *      (`Jordan Park`). Either may be the active replacement, switchable
 *      per record, and the de-anonymiser knows how to reverse both.
 *
 * Storage uses a single `chrome.storage.local` key (`pg_identity_vault`).
 * Records are looked up by both exact original text and a normalised key
 * (lowercase + collapsed whitespace) so that "John Doe" and "john doe"
 * resolve to the same identity.
 *
 * The vault is intentionally NOT placed in `chrome.storage.sync` — vault
 * contents are plaintext PII and must not be replicated across devices
 * without an explicit user action (export/import, future feature).
 */
import type { EntityType, PiiSpan } from './message-types';
/** Active replacement strategy for an individual vault record. */
export type ReplacementMode = 'placeholder' | 'synthetic';
/** A single identity stored in the vault. */
export interface IdentityRecord {
    /** Stable identifier (UUIDv4-ish) — used by UI to address the record. */
    id: string;
    /** Original text exactly as first observed. Whitespace preserved. */
    originalText: string;
    /** Normalised form used for lookup: lowercase, collapsed whitespace. */
    normalizedKey: string;
    /** Entity type assigned at creation; user can edit later. */
    entityType: EntityType;
    /** Typed placeholder (e.g. `[PERSON_3]`). Always present. */
    placeholder: string;
    /** Realistic synthetic replacement, pre-generated at creation. May be
     *  empty string for types where no safe synthetic is available; in that
     *  case `replacementMode` is forced back to 'placeholder'. */
    syntheticValue: string;
    /** Which value is currently emitted by the anonymiser. */
    replacementMode: ReplacementMode;
    /** When pinned, automated logic must not mutate this record. The user
     *  is the only writer. Pinned records survive "Clear unused" actions. */
    pinned: boolean;
    /** Free-text note set by the user. Optional. */
    notes?: string;
    /** Wall-clock millis. */
    createdAt: number;
    updatedAt: number;
    lastSeenAt: number;
    /** How often the record has been hit by the anonymiser. */
    usageCount: number;
}
/** Persisted shape of the entire vault. */
export interface IdentityVaultData {
    records: IdentityRecord[];
    /** Monotonic per-type counters used to generate placeholders + synthetic
     *  pool indices. Lives at vault scope so numbering is consistent across
     *  conversations and providers. */
    counters: Partial<Record<EntityType, number>>;
    /** Schema version for future migrations. */
    version: number;
}
/** Fresh, empty vault state. */
export declare function emptyVaultData(): IdentityVaultData;
/** Normalise text for lookup: trim + collapse whitespace + lowercase. */
export declare function normalizeKey(text: string): string;
/**
 * Load the vault from chrome.storage.local. Always returns a usable
 * IdentityVaultData (synthesises an empty one if storage is empty or the
 * stored value is corrupted).
 */
export declare function loadIdentityVault(): Promise<IdentityVaultData>;
/** Persist the vault. */
export declare function saveIdentityVault(data: IdentityVaultData): Promise<void>;
/** Clear all vault contents. Used by debug/reset paths. */
export declare function clearIdentityVault(): Promise<void>;
/** Look up a record by normalised key + entity type. Returns undefined if
 *  there is no match. Lookup is intentionally type-scoped so the same text
 *  detected as different types (e.g. ambiguous "Berlin" — LOCATION vs
 *  ORGANIZATION) yields independent records. */
export declare function findRecord(data: IdentityVaultData, text: string, entityType: EntityType): IdentityRecord | undefined;
/** All records, sorted most-recently-seen first. Cheap to compute and
 *  convenient for UI rendering. */
export declare function recordsByRecency(data: IdentityVaultData): IdentityRecord[];
/**
 * Decide which value the anonymiser should emit for a given record under
 * a given default mode. Synthetic falls back to placeholder when the
 * record's syntheticValue is empty (i.e. type opted out of synthetic).
 */
export declare function activeReplacement(record: IdentityRecord, defaultMode: ReplacementMode): string;
/**
 * Result of upsertEntity: tells the caller whether a new record was
 * created so the UI can show feedback ("Added 'John Doe' to the vault").
 */
export interface UpsertResult {
    record: IdentityRecord;
    created: boolean;
}
/**
 * Look up or create a record for a detected span. The vault counter is
 * advanced only on creation, so re-pasting the same name many times never
 * inflates the placeholder index.
 *
 * Caller is responsible for persisting the updated `data` afterwards via
 * `saveIdentityVault`. Batching multiple upserts before a single save is
 * recommended to minimise storage round-trips.
 *
 * @param data — vault state, mutated in place.
 * @param span — detected PII span (text + entity type are the primary
 *   inputs; score and offsets are recorded only for telemetry).
 * @param now — current timestamp; injected for deterministic tests.
 */
export declare function upsertEntity(data: IdentityVaultData, span: PiiSpan, now?: number, defaultMode?: ReplacementMode): UpsertResult;
/** Update fields on a record by id. Returns the updated record, or
 *  undefined if no matching id exists. */
export declare function updateRecord(data: IdentityVaultData, id: string, patch: Partial<Pick<IdentityRecord, 'replacementMode' | 'syntheticValue' | 'pinned' | 'notes' | 'entityType'>>, now?: number): IdentityRecord | undefined;
/** Delete a record by id. Returns true if removed, false if no such id. */
export declare function deleteRecord(data: IdentityVaultData, id: string): boolean;
/**
 * Build a quick-lookup index from active replacement value (placeholder
 * OR synthetic) back to the record. Used by the de-anonymiser to reverse
 * either form.
 *
 * Note: synthetic values can collide with strings naturally appearing in
 * model output ("Riley Bennett" might also be the name of a real person
 * the user is asking about). Caller must use word-boundary matching to
 * minimise false positives — see `de-anonymizer.ts` for the wrapping.
 */
export declare function buildReverseIndex(data: IdentityVaultData): Map<string, IdentityRecord>;
//# sourceMappingURL=identity-vault.d.ts.map