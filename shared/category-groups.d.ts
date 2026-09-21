import type { EntityType, GroupName } from './message-types';
export declare const GROUP_NAMES: readonly GroupName[];
export declare const GROUP_MEMBERS: Readonly<Record<GroupName, readonly EntityType[]>>;
export declare const GROUP_DEFAULT_ON: Readonly<Record<GroupName, boolean>>;
export declare function groupForEntity(entityType: EntityType): GroupName | null;
export declare function entitiesForGroup(group: GroupName): readonly EntityType[];
export declare function defaultGroupsEnabled(): Record<GroupName, boolean>;
/** Filter spans to only those whose group is enabled. */
export declare function filterByGroup(spans: import('./message-types').PiiSpan[], groupsEnabled: Record<GroupName, boolean>): import('./message-types').PiiSpan[];
//# sourceMappingURL=category-groups.d.ts.map