/**
 * Privacy Guardrail — Synthetic Value Pool
 *
 * Generates realistic-but-clearly-fake replacements for detected PII so that
 * downstream LLMs receive natural-looking text rather than awkward
 * placeholder tokens like [PERSON_1]. The synthetic value is recorded once,
 * per identity, in the IdentityVault and reused on every subsequent paste —
 * giving the user consistent, cross-session, cross-provider replacements.
 *
 * Design rules:
 * - **Unstructured types** (PERSON, EMAIL, LOCATION, ORGANIZATION,
 *   ADDRESS, USERNAME, MISC): drawn from curated pools of safe, neutral,
 *   obviously-not-real values. Picks gender-neutral / multicultural names
 *   to minimise cultural bias and avoids names of public figures.
 * - **Structured types** (CREDIT_CARD, SSN, IBAN, IP_ADDRESS, PHONE,
 *   BANK_ACCOUNT): use officially reserved test values from the relevant
 *   standards (RFC 5737 TEST-NET-1, IRS test SSN range, etc.) so that any
 *   accidental leakage downstream cannot collide with real-world values.
 * - **Sensitive types** (PASSWORD, URL, DATE): synthetic mode falls back
 *   to the typed placeholder. Generating fake passwords/URLs is high-risk
 *   (could look credential-like to scanners) and date arithmetic depends
 *   on context the vault doesn't currently track.
 *
 * The pool is finite. The vault is responsible for cycling: when the pool
 * is exhausted for a given type, the generator appends a numeric suffix
 * to keep producing unique values.
 */
import type { EntityType } from './message-types';
/**
 * Generate a synthetic value for a given entity type.
 *
 * @param entityType — the PII entity type to generate for.
 * @param index — monotonic counter per type (vault assigns this), used to
 *   pick an unused value from the pool deterministically.
 * @param context — optional contextual hints. `personSeed` lets EMAIL
 *   generation reuse a person's synthetic name as the email local part so
 *   `Jordan Park <jordan.park@example.com>` stays internally consistent.
 * @returns the synthetic value, or `null` if the type opts out (the caller
 *   should fall back to the typed placeholder).
 */
export declare function generateSyntheticValue(entityType: EntityType, index: number, context?: {
    personSeed?: string;
}): string | null;
/**
 * Set of entity types that DO support synthetic substitution. Useful for
 * UI affordances ("Synthetic mode is unavailable for PASSWORD" etc.).
 */
export declare const SYNTHETIC_CAPABLE_TYPES: ReadonlySet<EntityType>;
/** True when the synthetic generator can produce a value for this type. */
export declare function supportsSynthetic(entityType: EntityType): boolean;
/**
 * Exposed for tests and UI previews. Returns the maximum number of
 * unique values the pool can produce before cycling with suffixes.
 */
export declare function poolSize(entityType: EntityType): number;
//# sourceMappingURL=synthetic-pool.d.ts.map