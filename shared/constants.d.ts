import type { LocalAiUnloadTimeoutMs, NerModelKey, NerWebGpuDtype, Settings } from './message-types';
/** Curated LLM chat URLs where paste interception is active. */
export declare const DEFAULT_CURATED_URLS: string[];
/** Minimum text length to trigger PII analysis on paste. */
export declare const MIN_PASTE_LENGTH = 10;
/** Maximum text length before chunking for NER. */
export declare const MAX_TEXT_LENGTH = 5000;
/** How often (ms) to re-read the URL for same-document navigation. */
export declare const CONVERSATION_URL_POLL_MS = 500;
/** Delay (ms) before de-anonymizing a streaming response. */
export declare const RESPONSE_DEBOUNCE_MS = 500;
/** How long (ms) the "no PII found" indicator stays visible. */
export declare const NO_PII_INDICATOR_MS = 1500;
/** How long (ms) the post-anonymization chip stays visible. */
export declare const CHIP_FADE_MS = 5000;
/** Offscreen document idle timeout before closing (ms). */
export declare const OFFSCREEN_IDLE_MS = 600000;
export declare const LOCAL_AI_ACTIVITY_WINDOW_MS = 30000;
export declare const LOCAL_AI_ACTIVITY_HEARTBEAT_MS = 15000;
export declare const LOCAL_AI_UNLOAD_TIMEOUT_CHOICES: readonly LocalAiUnloadTimeoutMs[];
export type NerDtype = 'q8' | 'fp16' | 'q4f16';
/**
 * WebGPU artifact choices exposed on the options page. Order matters for the
 * UI: the low-memory default comes first.
 */
export declare const NER_WEBGPU_DTYPE_CHOICES: readonly NerWebGpuDtype[];
/**
 * External-data companion file for an ONNX artifact whose weights live outside
 * the protobuf. `path` must match the `location` recorded inside the .onnx
 * graph; `data` is the asset path relative to the model directory, fetched at
 * session creation and handed to ONNX Runtime.
 */
export interface NerExternalDataAsset {
    path: string;
    data: string;
}
/** Maps a dtype to the Transformers.js model file suffix it loads. */
export declare const NER_DTYPE_FILE_SUFFIX: Readonly<Record<NerDtype, string>>;
/** A curated ONNX artifact for one WebGPU dtype choice. */
export interface NerWebGpuArtifact {
    requiredAssets: readonly string[];
    /** External weight files accompanying the artifact, if any. */
    externalData?: readonly NerExternalDataAsset[];
}
export interface NerModelDefinition {
    key: NerModelKey;
    label: string;
    modelId: string;
    assetBasePath: string;
    requiredAssets: readonly string[];
    /** ONNX dtype used for the browser CPU/WASM path. Defaults to q8 for older models. */
    wasmDtype?: NerDtype;
    /** Default WebGPU dtype when the user expressed no preference. */
    webGpuDtype?: NerDtype;
    /** Curated non-q8 artifacts, keyed by dtype. */
    webGpuArtifacts?: Partial<Readonly<Record<NerDtype, NerWebGpuArtifact>>>;
}
export declare const DEFAULT_NER_MODEL: NerModelKey;
export declare const NER_MODELS: readonly NerModelDefinition[];
export declare const ACTIVE_NER_MODELS: readonly NerModelDefinition[];
export declare function runtimeNerModelKey(key: NerModelKey | undefined): NerModelKey;
export declare function nerModelDefinitionFor(key: NerModelKey): NerModelDefinition;
/** One entry in the merged model + GPU precision picker. */
export interface NerModelChoice {
    /** Composite select value: `key` or `key@dtype`. */
    value: string;
    key: NerModelKey;
    /** WebGPU dtype this entry selects; null when the model offers no choice. */
    dtype: NerWebGpuDtype | null;
    label: string;
}
/**
 * Flattens models into picker entries shared by the popup and the options
 * page. A model with multiple curated WebGPU artifacts appears once per
 * dtype, labelled "Label (dtype)".
 */
export declare function nerModelChoices(models?: readonly NerModelDefinition[]): NerModelChoice[];
/** Select value matching the persisted model + dtype settings. */
export declare function nerModelChoiceValue(key: NerModelKey, dtype: NerWebGpuDtype | undefined, models?: readonly NerModelDefinition[]): string;
/** Inverse of {@link nerModelChoiceValue}: settings patch for a select value. */
export declare function parseNerModelChoice(value: string): {
    nerModel: NerModelKey;
    nerWebGpuDtype?: NerWebGpuDtype;
};
/** Default extension settings. */
export declare const DEFAULT_SETTINGS: Settings;
/** Placeholder format for anonymized entities. */
export declare function placeholder(type: string, index: number): string;
/** Regex to match placeholders in text (e.g., [PERSON_1], [EMAIL_2]). */
export declare const PLACEHOLDER_REGEX: RegExp;
//# sourceMappingURL=constants.d.ts.map