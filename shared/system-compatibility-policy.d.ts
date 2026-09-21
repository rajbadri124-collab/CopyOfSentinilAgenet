export declare const SYSTEM_COMPATIBILITY_POLICY_VERSION = 2;
export declare const CRITICAL_BROWSER_MEMORY_GB = 2;
export declare const WARNING_BROWSER_MEMORY_GB = 4;
export type BrowserMemoryTier = 'critical' | 'warning' | 'ok' | 'unknown';
export type WebGpuAvailability = 'available' | 'unavailable' | 'unknown';
export type LocalAiRecommendation = 'auto-disable-local-ai' | 'warn' | 'none';
export interface PassiveSystemSignals {
    /** Approximate browser-reported memory in GB (navigator.deviceMemory). */
    browserMemoryGb?: number;
    webGpu: WebGpuAvailability;
}
export interface SystemCompatibilityDecision {
    policyVersion: number;
    tier: BrowserMemoryTier;
    recommendation: LocalAiRecommendation;
    notes: string[];
}
export declare function classifyBrowserMemory(browserMemoryGb?: number): BrowserMemoryTier;
export declare function decideSystemCompatibility(signals: PassiveSystemSignals): SystemCompatibilityDecision;
//# sourceMappingURL=system-compatibility-policy.d.ts.map