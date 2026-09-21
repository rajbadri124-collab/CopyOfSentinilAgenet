export interface CodeRegion {
    start: number;
    end: number;
}
/**
 * Find fenced markdown (```) and HTML <code>/<pre> regions in text.
 * Returns character-index ranges where end is exclusive.
 * Inline backtick runs are NOT returned.
 */
export declare function findCodeRegions(text: string): CodeRegion[];
//# sourceMappingURL=code-region-finder.d.ts.map