/**
 * Privacy Guardrail — Scanning Indicator (Shadow DOM)
 *
 * Persistent status toast shown while PII detection is actively running.
 */
export declare class ScanningIndicator {
    private host;
    private shadow;
    private indicatorEl;
    private labelEl;
    private counterEl;
    private mounted;
    private tierTwoTimer;
    private tierThreeTimer;
    private tierFourTimer;
    private counterInterval;
    private startTimeMs;
    private cancelInvoked;
    private readonly theme;
    private readonly onCancel?;
    private readonly keydownHandler;
    constructor(theme?: 'dark' | 'light', onCancel?: () => void);
    start(): void;
    stop(): void;
    private render;
    private invokeCancel;
    private scheduleTierTwoEscalation;
    private scheduleTierThreeCounter;
    private scheduleTierFourWarning;
    private clearTimers;
    private setLabel;
    private hideCounter;
    private updateCounterText;
}
//# sourceMappingURL=scanning-indicator.d.ts.map