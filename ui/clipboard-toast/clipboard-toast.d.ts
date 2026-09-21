/**
 * Privacy Guardrail — Clipboard Toast (Shadow DOM)
 *
 * Non-blocking notification surfaced after the user copies text that
 * contains resolvable placeholders or synthetic-mode echoes. Offers a
 * single "Replace with originals" action; ignoring auto-dismisses after
 * ~6 seconds (paused while the pointer hovers the toast).
 *
 * After a successful replacement the toast briefly shows a "Clipboard
 * replaced" confirmation and then disposes itself.
 */
export interface ClipboardToastCallbacks {
    /** Called when the user clicks "Replace with originals". */
    onReplace: () => void;
    /** Called when the toast disposes itself (auto-dismiss, replace, or
     *  preempted by another toast). Lets the coordinator clear its
     *  singleton reference. */
    onDispose?: () => void;
}
export declare class ClipboardToast {
    private host;
    private shadow;
    private toastEl;
    private msgEl;
    private btnEl;
    private dismissTimer;
    private mounted;
    private disposed;
    private readonly theme;
    private readonly cbs;
    constructor(theme: 'dark' | 'light', cbs: ClipboardToastCallbacks);
    show(): void;
    /**
     * Disposes the toast immediately. Safe to call multiple times.
     * Used by the coordinator to enforce the singleton constraint when a
     * newer copy supersedes an older one.
     */
    dispose(): void;
    /** True between construction and dispose. Useful for tests. */
    isMounted(): boolean;
    private handleReplace;
    private showConfirmation;
    private scheduleAutoDismiss;
    private pauseAutoDismiss;
}
//# sourceMappingURL=clipboard-toast.d.ts.map