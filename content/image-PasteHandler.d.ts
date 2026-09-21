import type { SiteAdapter } from './site-adapters/adapter-interface';
export interface ProcessImageRequest {
    action: 'PROCESS_IMAGE';
    data: ArrayBuffer;
    mimeType: string;
    fileName: string;
    source: 'paste' | 'drop';
}
export interface ImagePasteCallbacks {
    onScanning?: () => void;
    onComplete?: (redacted: boolean) => void;
    onError?: (message: string) => void;
}
/** Pick the same site adapter the text pipeline uses for this host. */
export declare function selectImagePasteAdapter(hostname?: string): SiteAdapter | null;
/**
 * First image payload on a paste/drop transfer.
 *
 * `DataTransferItem.type` is the MIME string (`image/png`, …). File-kind
 * items without a type are ignored so we never block a text-only paste.
 */
export declare function findImageFile(data: DataTransfer | null): File | null;
/**
 * Intercepts native image paste and drop into supported AI composers and
 * forwards the bytes to the background/offscreen document for local vision.
 */
export declare class ImagePasteHandler {
    private adapter;
    private enabled;
    private started;
    private reinjecting;
    private worker;
    private callbacks;
    constructor(adapter?: SiteAdapter, callbacks?: ImagePasteCallbacks);
    start(): void;
    stop(): void;
    setEnabled(enabled: boolean): void;
    private resolveComposer;
    private handlePaste;
    private handleDragOver;
    private handleDrop;
    private forwardImage;
    private redactImage;
}
/**
 * Convenience entry for a later content-script wire-up. No-ops on hosts this
 * agent does not cover so a shared inject list cannot throw.
 */
export declare function startImagePasteHandler(): ImagePasteHandler | null;
//# sourceMappingURL=image-PasteHandler.d.ts.map