import type { AllowlistEntry, BlocklistEntry } from './message-types';
type ListEntry = AllowlistEntry | BlocklistEntry;
export declare function normalizeListPattern(pattern: string): string;
export declare function findConflictingPattern(pattern: string, entries: ListEntry[]): string | null;
export {};
//# sourceMappingURL=list-conflicts.d.ts.map