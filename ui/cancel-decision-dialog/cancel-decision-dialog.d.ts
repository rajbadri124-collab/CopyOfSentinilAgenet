import type { ThemeSetting } from '../../shared/message-types';
export type CancelDecision = 'paste-original' | 'drop';
export interface CancelDecisionDialogResult {
    decision: CancelDecision;
    remember: boolean;
    dismissed: boolean;
}
export declare class CancelDecisionDialog {
    private readonly theme;
    private host;
    private previousActive;
    constructor(theme?: ThemeSetting);
    show(): Promise<CancelDecisionDialogResult>;
    dispose(): void;
}
//# sourceMappingURL=cancel-decision-dialog.d.ts.map