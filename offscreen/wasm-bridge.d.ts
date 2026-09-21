import type { DetectionOptions, PiiSpan } from '../shared/message-types';
/**
 * Load and initialize the WASM module.
 * Caches the module after first load.
 */
export declare function ensureWasm(): Promise<void>;
/**
 * Run PII detection on text via the WASM pipeline.
 */
export declare function detectPii(text: string, config?: DetectionOptions, externalNerSpans?: PiiSpan[]): Promise<PiiSpan[]>;
/**
 * Check if the NER model is loaded in the WASM module.
 */
export declare function isNerReady(): Promise<boolean>;
/**
 * Get the default pipeline configuration from WASM.
 */
export declare function getDefaultConfig(): Promise<Required<Omit<DetectionOptions, 'ner_provider'>>>;
//# sourceMappingURL=wasm-bridge.d.ts.map