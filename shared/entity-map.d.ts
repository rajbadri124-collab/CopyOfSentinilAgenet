import type { PiiSpan } from './message-types';
import type { StoredEntityMap } from './storage';
/**
 * Bidirectional mapping between original PII values and their placeholders.
 * Manages placeholder numbering per entity type and supports serialization
 * for persistence in chrome.storage.local.
 */
export declare class EntityMap {
    /** placeholder → original value */
    private toOriginal;
    /** original value → placeholder */
    private toPlaceholder;
    /** Next index per entity type for placeholder numbering */
    private counters;
    /** Create an EntityMap, optionally restoring from a stored map. */
    constructor(stored?: StoredEntityMap);
    /**
     * Add a PII span to the map. Returns the assigned placeholder.
     * If the same original text was already mapped, returns the existing placeholder.
     */
    add(span: PiiSpan): string;
    /** Get the original value for a placeholder. */
    getOriginal(ph: string): string | undefined;
    /** Get the placeholder for an original value. */
    getPlaceholder(original: string): string | undefined;
    /**
     * Add an externally-chosen replacement string for an original value
     * without consulting the per-type counter. This is the path used when
     * the vault has already decided the replacement (placeholder OR
     * synthetic), so the per-conversation EntityMap should mirror the vault
     * choice instead of generating its own placeholder.
     *
     * If `original` already has a mapping, it is replaced with the new one.
     * The previous reverse entry is removed to keep both directions
     * consistent.
     */
    addExternal(replacement: string, original: string): void;
    /** Get all placeholder → original mappings. */
    entries(): Array<[string, string]>;
    /** Number of mapped entities. */
    get size(): number;
    /** Serialize to a plain object for storage. */
    toStored(): StoredEntityMap;
}
//# sourceMappingURL=entity-map.d.ts.map