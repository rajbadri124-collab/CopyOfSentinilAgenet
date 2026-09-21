import { type Readable, type Writable } from 'svelte/store';
import type { GroupName, NerModelKey, ReplacementModeSetting, Settings, SystemCompatibilityStatus } from '../shared/message-types';
import { type NerModelChoice } from '../shared/constants';
import { type ResourceSummary } from '../shared/popup-resource-summary';
export type TabId = 'protect' | 'detect' | 'test' | 'settings';
export type TabDefinition = {
    id: TabId;
    label: string;
};
export type DetectionCategoryId = GroupName;
export type DetectionCategory = {
    id: GroupName;
    label: string;
    description: string;
    enabled: boolean;
    defaultEnabled: boolean;
};
export type FeedbackCounts = {
    confirmed: number;
    ignored: number;
    pending: number;
};
export type StatusTone = 'ok' | 'danger' | 'muted';
export type StatusPill = {
    label: string;
    tone: StatusTone;
    title?: string;
};
export type NavigationModel = {
    activeTab: Writable<TabId>;
    setActiveTab: (tab: TabId) => void;
};
export type ProtectionModel = {
    enabled: Writable<boolean>;
    wasmStatus: Writable<StatusPill>;
    nerStatus: Writable<StatusPill>;
    cpuFallback: Writable<boolean>;
    version: Writable<string>;
    modelLabel: Writable<string>;
    systemCompatibility: Writable<SystemCompatibilityStatus | null>;
    resourceSummary: Readable<ResourceSummary | null>;
    toggle: () => void;
    setEnabled: (enabled: boolean) => Promise<void>;
};
export type CategoriesModel = {
    categories: Writable<DetectionCategory[]>;
    enabledCount: Readable<number>;
    sensitivityMode: Writable<Settings['sensitivityMode']>;
    toggleCategory: (categoryId: GroupName) => void;
    setCategoryEnabled: (categoryId: GroupName, enabled: boolean) => Promise<void>;
    restoreDefaults: () => Promise<void>;
};
export type VaultModel = {
    memoryEnabled: Writable<boolean>;
    consistentReplacementMode: Writable<boolean>;
    mappingCount: Writable<number>;
    clearMappings: () => Promise<void>;
    openVaultOptions: () => void;
    setMemoryEnabled: (enabled: boolean) => Promise<void>;
    setReplacementMode: (mode: ReplacementModeSetting) => Promise<void>;
};
export type TestModel = {
    testInput: Writable<string>;
    isRunning: Writable<boolean>;
    resultText: Writable<string>;
    runCount: Writable<number>;
    feedbackCounts: Writable<FeedbackCounts>;
    runMockDetection: () => Promise<void>;
    runDetection: () => Promise<void>;
    clearFeedback: () => Promise<void>;
};
export type SettingsModel = {
    minConfidence: Writable<number>;
    debug: Writable<boolean>;
    clipboardInterceptEnabled: Writable<boolean>;
    nerModel: Writable<NerModelKey>;
    nerModelChoice: Writable<string>;
    nerModelChoices: readonly NerModelChoice[];
    openOptions: () => void;
    openIssueReport: () => void;
    openSecurityReport: () => void;
    openPrivacySupport: () => void;
    openPrivacyPolicy: () => void;
    openTermsOfUse: () => void;
    openImpressum: () => void;
    setMinConfidence: (value: number) => Promise<void>;
    setDebug: (enabled: boolean) => Promise<void>;
    setClipboardInterceptEnabled: (enabled: boolean) => Promise<void>;
    setNerModelChoice: (value: string) => Promise<void>;
};
export type AppModels = {
    navigation: NavigationModel;
    protection: ProtectionModel;
    categories: CategoriesModel;
    vault: VaultModel;
    test: TestModel;
    settings: SettingsModel;
};
export declare const tabs: TabDefinition[];
export declare function createAppModels(): AppModels;
//# sourceMappingURL=popup-model.svelte.d.ts.map