import type { PassiveSystemSignals } from '../shared/system-compatibility-policy';
interface NavigatorWithPassiveHardwareSignals extends Navigator {
    deviceMemory?: number;
    gpu?: {
        requestAdapter?: () => Promise<unknown>;
    };
}
export declare function collectPassiveSystemSignals(navigatorLike?: NavigatorWithPassiveHardwareSignals): Promise<PassiveSystemSignals>;
export {};
//# sourceMappingURL=passive-signals.d.ts.map