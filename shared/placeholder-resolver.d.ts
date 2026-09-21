/**
 * Privacy Guardrail — Placeholder Resolver (shared)
 *
 * Pure module mapping `(text, entityMap)` to a unified set of resolvable
 * matches plus a fully de-anonymised string. Single source of truth for
 * placeholder + synthetic-echo matching used by:
 *
 *   - the de-anon banner (highlight + reveal overlay + copy button)
 *   - the clipboard interceptor (trigger gate + Replace round-trip)
 *
 * Both surfaces must resolve identical inputs identically; they share this
 * module to prevent drift.
 *
 * No DOM, no storage, no `chrome.*` access. Inputs are a string and an
 * `EntityMap`; outputs are plain data.
 */
import { EntityMap } from './entity-map';
/** A single resolvable hit in the input text. */
export interface ResolverMatch {
    /** Inclusive start offset in the input text. */
    start: number;
    /** Exclusive end offset in the input text. */
    end: number;
    /** Substring as it appears in the input text (mangled or canonical or
     *  synthetic). */
    matchText: string;
    /** Resolved original value the match should be replaced with. */
    originalText: string;
    /** Lowercased entity-type label suitable as a CSS class suffix. For
     *  placeholder matches this is derived from the bracketed type; for
     *  synthetic matches the entity-map layer does not currently track type
     *  so we fall back to `'misc'`. */
    styleKey: string;
    /** Discriminator on how the match was found. Useful for tests and for
     *  future surfaces that want to render the two kinds differently. */
    kind: 'placeholder' | 'synthetic';
}
export interface ResolveResult {
    matches: ResolverMatch[];
    /** `text` with every match substituted for its original value. */
    deAnonText: string;
}
/**
 * Resolve every placeholder + synthetic-echo present in `text` against
 * `entityMap`. Pass order:
 *
 *   1. Tolerant placeholder pass (canonical + mangled variants), gated by
 *      the entity map's known canonical placeholders. Highest precedence.
 *   2. Synthetic pass over EntityMap keys that are NOT canonical
 *      placeholders. Whole-word boundary, longest-needle-first so
 *      "Jordan Park" wins over "Jordan" if both were ever mapped.
 *      Synthetics that overlap a placeholder match are dropped.
 *
 * Returned matches are sorted by `start` and are non-overlapping, so a
 * caller can apply them left-to-right as substitutions without further
 * bookkeeping.
 */
export declare function resolveText(text: string, entityMap: EntityMap): ResolveResult;
//# sourceMappingURL=placeholder-resolver.d.ts.map