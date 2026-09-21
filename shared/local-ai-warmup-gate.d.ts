import type { NerStatus, Settings, SystemCompatibilityStatus } from './message-types';
/**
 * Resource-safe auto-warmup gate for the popup.
 *
 * PRD: "On popup open, auto-warm Local AI only when Local AI is enabled
 * and the system tier is OK. Do not auto-warm on warning, critical
 * override, unknown memory, or known CPU/WASM fallback systems."
 *
 * Callers must NOT auto-warm when this returns false. User-initiated
 * actions (explicit Local AI toggle, retry after load failure) live on
 * different code paths and are intentionally not gated here.
 */
export declare function shouldAutoWarmLocalAi(settings: Settings | null, status: SystemCompatibilityStatus | null, nerStatus?: NerStatus | null): boolean;
//# sourceMappingURL=local-ai-warmup-gate.d.ts.map