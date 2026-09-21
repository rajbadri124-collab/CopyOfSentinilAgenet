import type { DetectionOptions, NerProviderMode, NerStatus, NerWebGpuDtype, PiiSpan } from '../shared/message-types';
import { type NerProvider } from './ner-provider';
type NerProviderFactory = (mode: NerProviderMode, model: NonNullable<DetectionOptions['ner_model']>, webGpuDtype?: NerWebGpuDtype) => NerProvider | null;
export declare function getNerStatus(config?: DetectionOptions): NerStatus;
export interface DetectionResult {
    spans: PiiSpan[];
    nerMs?: number;
}
export declare function detectWithExternalNer(text: string, config?: DetectionOptions, signal?: AbortSignal): Promise<DetectionResult>;
export declare function setNerProviderFactoryForTests(factory: NerProviderFactory): void;
export declare function resetNerProviderStateForTests(): void;
export {};
//# sourceMappingURL=detection.d.ts.map