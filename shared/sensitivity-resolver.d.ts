import type { EntityType, Settings } from './message-types';
interface CategoryThreshold {
    baseline: number;
    delta: number;
}
export declare const CATEGORY_THRESHOLDS: Record<EntityType, CategoryThreshold>;
type ResolverSettings = Pick<Settings, 'minConfidence' | 'sensitivityMode' | 'groupThresholds'>;
/**
 * Resolve the effective confidence threshold for a given entity type.
 *
 * Global mode: maps minConfidence [0,1] linearly between ceiling and floor.
 *   ceiling = clamp(baseline + delta, 0, 1) — threshold when slider is at 0
 *   floor   = clamp(baseline - delta, 0, 1) — threshold when slider is at 1
 *
 * Individual mode: if the entity's group has a per-group slider override in
 * groupThresholds, that override position (0–1) replaces minConfidence in the
 * headroom math. Falls back to minConfidence when no override is set.
 */
export declare function resolveThreshold(settings: ResolverSettings, entityType: EntityType): number;
/**
 * Lowest threshold the resolver will produce for any entity type at the current slider position.
 * Use this as the WASM pipeline's min_confidence so it never pre-filters a span the resolver wants.
 */
export declare function minResolvedThreshold(settings: ResolverSettings): number;
export {};
//# sourceMappingURL=sensitivity-resolver.d.ts.map