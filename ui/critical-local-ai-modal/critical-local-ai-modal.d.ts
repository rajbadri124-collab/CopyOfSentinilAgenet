import type { ThemeSetting } from '../../shared/message-types';
export interface CriticalLocalAiModalCallbacks {
    onDismiss: () => Promise<void> | void;
    onOpenSettings: () => Promise<void> | void;
}
export declare class CriticalLocalAiModal {
    private readonly theme;
    private readonly callbacks;
    private host;
    private shadow;
    private mounted;
    private dismissed;
    constructor(theme: ThemeSetting, callbacks: CriticalLocalAiModalCallbacks);
    show(): void;
    isMounted(): boolean;
    dismiss(): Promise<void>;
    openSettings(): Promise<void>;
    dispose(): void;
}
//# sourceMappingURL=critical-local-ai-modal.d.ts.map