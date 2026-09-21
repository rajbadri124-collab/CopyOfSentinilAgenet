import { type NerDtype, type NerExternalDataAsset, type NerModelDefinition } from '../shared/constants';
import type { EntityType, NerInferenceDevice, NerModelKey, NerProviderMode, NerTimingInfo, NerWebGpuDtype, PiiSpan } from '../shared/message-types';
export interface NerProvider {
    readonly mode: NerProviderMode;
    readonly model?: NerModelKey;
    readonly modelLabel?: string;
    detect(text: string, signal?: AbortSignal): Promise<PiiSpan[]>;
    getLastTiming?(): NerTimingInfo | undefined;
    getDevice?(): NerInferenceDevice | undefined;
}
export declare class NerProviderUnavailableError extends Error {
    constructor(message: string);
}
export type TokenClassificationItem = {
    word: string;
    score: number;
    entity?: string;
    entity_group?: string;
    start?: number;
    end?: number;
};
type TokenClassificationPipeline = (text: string, options?: {
    aggregation_strategy?: 'simple';
    ignore_labels?: string[];
}) => Promise<TokenClassificationItem[]>;
type OnnxWasmPaths = string | {
    mjs?: string;
    wasm?: string;
};
type OnnxWasmEnv = {
    wasmPaths?: OnnxWasmPaths;
    numThreads?: number;
    proxy?: boolean;
};
type TransformersModule = {
    env: {
        allowRemoteModels: boolean;
        allowLocalModels: boolean;
        localModelPath: string;
        useBrowserCache: boolean;
        useFSCache: boolean;
        useWasmCache: boolean;
        backends: {
            onnx: {
                wasm?: OnnxWasmEnv;
            };
        };
    };
    pipeline: (task: 'token-classification', model: string, options?: {
        dtype?: NerDtype;
        local_files_only?: boolean;
        device?: NerInferenceDevice;
        session_options?: {
            externalData?: NerExternalDataAsset[];
        };
    }) => Promise<TokenClassificationPipeline>;
};
interface TransformersProviderOptions {
    modelKey?: NerModelKey;
    loadTransformers?: () => Promise<TransformersModule>;
    getExtensionUrl?: (path: string) => string;
    assetExists?: (url: string) => Promise<boolean>;
    chunking?: NerChunkingOptions;
    detectWebGpu?: () => Promise<boolean>;
    /**
     * Benchmark/test escape hatch: force a specific ONNX artifact instead of
     * the device-derived one (e.g., run the WebGPU q4f16 artifact on the CPU
     * EP in Node to measure quantization quality).
     */
    dtypeOverride?: NerDtype;
    /** Benchmark/test escape hatch: force the execution provider. */
    deviceOverride?: NerInferenceDevice;
    /**
     * User preference for the WebGPU artifact (options page). Consulted only
     * when the resolved device is 'webgpu' — the wasm fallback uses the model's
     * low-memory CPU dtype. Unlike `dtypeOverride` this never forces a
     * user-selected WebGPU artifact onto the CPU path.
     */
    webGpuDtypePreference?: NerWebGpuDtype;
}
export interface NerTextChunk {
    text: string;
    startChar: number;
    endChar: number;
    startByte: number;
    endByte: number;
}
export interface NerChunkingOptions {
    maxChunkChars?: number;
    overlapChars?: number;
}
export declare const DEFAULT_NER_CHUNK_OVERLAP_CHARS = 256;
export declare const NER_THRESHOLD_BY_ENTITY_TYPE: Readonly<Record<EntityType, number>>;
export declare function chunkTextForNer(text: string, options?: NerChunkingOptions): NerTextChunk[];
export declare function mergeOverlappingNerSpans(spans: PiiSpan[]): PiiSpan[];
export declare function createFixtureNerProvider(): NerProvider;
export declare function defaultDetectWebGpu(): Promise<boolean>;
export declare function dtypeForDevice(model: NerModelDefinition, device: NerInferenceDevice, webGpuDtypePreference?: NerWebGpuDtype): NerDtype;
export declare function requiredAssetsForDtype(model: NerModelDefinition, dtype: NerDtype): readonly string[];
export declare function mapAi4PrivacyLabelToEntityType(label: string | undefined): EntityType | null;
export declare function mapBardsAiLabelToEntityType(label: string | undefined): EntityType | null;
export declare function mapHikmaAiLabelToEntityType(label: string | undefined): EntityType | null;
export declare function nerThresholdForEntityType(entityType: EntityType, modelKey?: NerModelKey): number;
export declare function passesNerThreshold(span: Pick<PiiSpan, 'entity_type' | 'score'>, modelKey?: NerModelKey): boolean;
export declare function applyNerThresholdPolicy(spans: PiiSpan[], modelKey?: NerModelKey): PiiSpan[];
export declare function transformerOutputToSpans(text: string, output: TokenClassificationItem[], modelKey?: NerModelKey): PiiSpan[];
export declare function createTransformersNerProvider(options?: TransformersProviderOptions): NerProvider;
export declare function createNerProvider(mode: NerProviderMode, modelKey?: NerModelKey, webGpuDtypePreference?: NerWebGpuDtype): NerProvider | null;
export declare function resetNerProviderCachesForTests(): void;
export {};
//# sourceMappingURL=ner-provider.d.ts.map