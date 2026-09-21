/**
 * Privacy Guardrail — Page Status Chip (Shadow DOM)
 *
 * Persistent page-level chip surfacing degraded-protection states on
 * supported chat pages. Renders one reason at a time and supports
 * per-session minimization without permanent dismissal.
 */
import type { ThemeSetting } from '../../shared/message-types';
import { type ChipMessage, type ChipReason } from '../../shared/page-status-chip-reason';
export interface PageStatusChipCallbacks {
    onMinimizeChange?: (minimized: boolean) => void;
}
export declare class PageStatusChip {
    private host;
    private shadow;
    private mounted;
    private currentReason;
    private currentMessage;
    private minimized;
    private theme;
    private readonly callbacks;
    constructor(theme?: ThemeSetting, callbacks?: PageStatusChipCallbacks);
    setTheme(theme: ThemeSetting): void;
    /** Update the displayed reason; pass null to remove the chip. */
    update(reason: ChipReason | null, message?: ChipMessage): void;
    setMinimized(minimized: boolean): void;
    isMinimized(): boolean;
    isMounted(): boolean;
    getReason(): ChipReason | null;
    dispose(): void;
    private render;
}
//# sourceMappingURL=page-status-chip.d.ts.map