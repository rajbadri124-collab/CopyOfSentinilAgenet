import type { DetectionOptions, NerProviderMode, NerStatus, Settings } from './message-types';
export declare function detectionOptionsFromSettings(settings: Settings, overrides?: DetectionOptions): DetectionOptions;
export declare function fallbackNerStatus(mode: NerProviderMode, message?: string): NerStatus;
//# sourceMappingURL=detection-config.d.ts.map