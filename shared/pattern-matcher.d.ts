export interface PatternMatch {
    start: number;
    end: number;
    text: string;
}
/**
 * Find all whole-word, case-insensitive occurrences of `pattern` in `text`.
 * `*` in the pattern expands to one or more word characters (no spaces).
 */
export declare function matchPattern(text: string, pattern: string): PatternMatch[];
//# sourceMappingURL=pattern-matcher.d.ts.map