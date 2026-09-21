import type { NerRuntimeState } from './message-types';
import { type BrowserMemoryTier, type PassiveSystemSignals, type WebGpuAvailability, type LocalAiRecommendation } from './system-compatibility-policy';
export declare const SYSTEM_CHECK_STORAGE_KEY = "pg_system_check";
export declare const SYSTEM_CHECK_SCHEMA_VERSION = 1;
export type LocalAiProtectionState = 'enabled' | 'off-user-choice' | 'off-low-memory-auto' | 'off-load-failure' | 'enabled-low-memory-override';
export interface SystemCheckResult {
    schemaVersion: number;
    policyVersion: number;
    checkedAt: number;
    browserMemoryGb?: number;
    webGpu: WebGpuAvailability;
    tier: BrowserMemoryTier;
    recommendation: LocalAiRecommendation;
    notes: string[];
    localAiState: LocalAiProtectionState;
    runtimeState: NerRuntimeState | 'unknown' | 'not-loaded';
    criticalModal: 'none' | 'pending' | 'dismissed';
    lowMemoryOverride: boolean;
    recommendationDeclinedAt?: number;
    loadFailure?: {
        message: string;
        at: number;
    };
}
export declare function buildSystemCheckResult(signals: PassiveSystemSignals, now?: number, previous?: SystemCheckResult | null): SystemCheckResult;
export declare function normalizeSystemCheckResult(raw: unknown): SystemCheckResult | null;
export declare function loadSystemCheckResult(): Promise<SystemCheckResult | null>;
export declare function saveSystemCheckResult(result: SystemCheckResult): Promise<void>;
export declare function markCriticalModalDismissed(): Promise<SystemCheckResult | null>;
export declare function recordLowMemoryOverride(): Promise<SystemCheckResult | null>;
export declare function recordLocalAiEnabled(): Promise<SystemCheckResult | null>;
export declare function recordRuntimeState(runtimeState: SystemCheckResult['runtimeState']): Promise<SystemCheckResult | null>;
export declare function recordLowMemoryAutoDisable(result: SystemCheckResult): Promise<SystemCheckResult>;
export declare function recordUserLocalAiOff(result: SystemCheckResult): Promise<SystemCheckResult>;
export declare function recordRecommendationDeclined(now?: number): Promise<SystemCheckResult | null>;
export declare function recordLoadFailure(message: string, now?: number): Promise<SystemCheckResult | null>;
//# sourceMappingURL=system-check-storage.d.ts.map