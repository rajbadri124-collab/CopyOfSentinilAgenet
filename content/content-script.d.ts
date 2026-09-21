/**
 * Privacy Guardrail — Content Script
 *
 * Injected into curated LLM chat pages. Orchestrates:
 * 1. Paste interception → WASM detection → review overlay → anonymized insert
 * 2. Response observation → de-anonymization banner → reveal/hide toggle
 * 3. Feedback logging → adaptive threshold computation
 */
import type { ActivePageScanResponse } from '../shared/message-types';
type YoloElementCoordinate = NonNullable<ActivePageScanResponse['payload']['elementCoordinates']>[number];
/** Draw numbered, document-positioned markers for the latest visual scan. */
export declare function drawYoloBadges(coordinates: YoloElementCoordinate[], imageWidth?: number, imageHeight?: number): void;
export {};
//# sourceMappingURL=content-script.d.ts.map