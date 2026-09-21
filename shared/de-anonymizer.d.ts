import { EntityMap } from './entity-map';
import type { IdentityVaultData } from './identity-vault';
import { findVariantMatches, type VariantMatch } from './placeholder-variants';
/**
 * De-anonymize text by replacing placeholders with their original values.
 *
 * Two passes: first the strict-canonical pass (cheap regex, exact match),
 * then a tolerant variant pass that catches the common LLM-mangling forms
 * (`PERSON 1`, `[person_1]`, dropped brackets, etc.) gated against the
 * entity map's known placeholders. See
 * `docs/prd-placeholder-restoration-robustness.md`.
 *
 * @param text - Text containing placeholders like [PERSON_1], [EMAIL_1]
 * @param entityMap - The entity map containing placeholder → original mappings
 * @returns The de-anonymized text with original values restored
 */
export declare function deAnonymize(text: string, entityMap: EntityMap): string;
/**
 * Find all placeholders present in a text.
 * Returns an array of placeholder strings found.
 *
 * Strict canonical-only: callers who want a fast canonical-form check
 * still have one. Use `findVariantMatches` from `placeholder-variants`
 * for tolerant matching.
 */
export declare function findPlaceholders(text: string): string[];
/**
 * Check if a text contains any placeholders.
 *
 * Strict canonical-only — see `findPlaceholders`.
 */
export declare function hasPlaceholders(text: string): boolean;
/**
 * Vault-aware de-anonymisation. Reverses both placeholders ([PERSON_1])
 * and synthetic values ("Jordan Park") back to the original text the
 * user pasted. Synthetic substrings are matched on whole-word boundaries
 * (Unicode-aware) to minimise the chance of accidentally substituting
 * unrelated occurrences in the LLM's response.
 *
 * Records whose `replacementMode` differs from what actually appears in
 * the response are still resolved — both the placeholder and the
 * synthetic of every record are valid reverse-keys so the user can flip
 * modes mid-conversation without losing the round-trip.
 *
 * Pass order:
 *   1. Strict canonical placeholder substitution.
 *   2. Mangled-placeholder pass (variant matcher gated by the known set).
 *   3. Synthetic-value substitution (whole-word, Unicode-aware).
 */
export declare function deAnonymizeWithVault(text: string, vaultData: IdentityVaultData): string;
/** Returns true when the text contains any reversible placeholder OR any
 *  known synthetic value from the vault. Used by the response observer
 *  to decide whether to attach the de-anon banner. Tolerant of mangled
 *  placeholder forms — see `placeholder-variants`. */
export declare function hasReversibleContent(text: string, vaultData: IdentityVaultData): boolean;
/** Re-export for callers that want direct access to the variant matcher
 *  (used by the de-anon banner). */
export { findVariantMatches };
export type { VariantMatch };
//# sourceMappingURL=de-anonymizer.d.ts.map