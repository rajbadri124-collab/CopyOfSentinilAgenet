/**
 * Privacy Guardrail — Placeholder Variant Matcher
 *
 * Pure module for tolerantly matching the placeholders we emit
 * (`[PERSON_1]`, `[EMAIL_2]`, …) when an LLM mangles them on the way
 * back. Observed manglings include dropped brackets, lower-cased type,
 * underscore replaced with a space, missing separator, and one-sided
 * brackets. See `docs/prd-placeholder-restoration-robustness.md`.
 *
 * The module is deliberately deep and pure: inputs are strings and an
 * iterable of canonical placeholder strings; outputs are matches or a
 * regex. No I/O, no DOM, no `EntityMap` dependency.
 *
 * Restoration must always be gated against a known canonical set so
 * arbitrary all-caps tokens (`HTTP_2`, `ASCII_1`) are never touched.
 */
export interface ParsedPlaceholder {
    /** Bracket-stripped type, e.g. `PERSON` or `BANK_ACCOUNT`. */
    type: string;
    /** Numeric suffix. */
    index: number;
}
/**
 * Parse `[TYPE_N]` into its parts. Returns null when the string is not
 * a strict canonical placeholder — synthetic-value EntityMap keys and
 * arbitrary text are filtered out this way.
 */
export declare function parsePlaceholder(canonical: string): ParsedPlaceholder | null;
/**
 * Build a regex that matches all accepted variant forms of a single
 * canonical placeholder. The regex captures whether each bracket is
 * present so the caller can apply a Unicode-aware whole-word boundary
 * check on the bracket-less side(s).
 *
 * Capture groups:
 *   1 — opening `[` if present
 *   2 — closing `]` if present
 *
 * Falls back to a literal regex when given a non-canonical string. This
 * keeps the function total at the cost of doing nothing useful for
 * synthetic keys; callers should filter those out with `parsePlaceholder`
 * first.
 */
export declare function buildVariantRegex(canonical: string): RegExp;
export interface VariantMatch {
    /** Inclusive start offset in the source text. */
    start: number;
    /** Exclusive end offset in the source text. */
    end: number;
    /** Exact substring as it appears in the source text (mangled or not). */
    matchText: string;
    /** Canonical placeholder this variant resolves to (e.g. `[PERSON_1]`). */
    canonical: string;
}
/**
 * Find every accepted variant occurrence of any known placeholder in
 * `text`. Iteration is longest-index-first so that `PERSON_12` is
 * consumed before `PERSON_1`, and overlapping matches from later (shorter)
 * placeholders are dropped. The returned list is sorted by `start` and is
 * safe to apply left-to-right as substitutions.
 */
export declare function findVariantMatches(text: string, knownPlaceholders: Iterable<string>): VariantMatch[];
/**
 * Permissive shape predicate: returns true when the text contains a
 * substring that could plausibly be a placeholder variant. Cheap pre-gate
 * for the response observer, which doesn't have direct access to the
 * conversation's entity map. False positives are harmless because the
 * banner-attach path re-checks against the known set.
 */
export declare function hasPotentialPlaceholderShape(text: string): boolean;
//# sourceMappingURL=placeholder-variants.d.ts.map