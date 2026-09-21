import type { Message } from '../shared/message-types';
/**
 * Chrome can throw synchronously after an extension reload invalidates the
 * content-script context. Promise .catch() only handles async rejections.
 */
export declare function sendRuntimeMessageBestEffort(message: Message): void;
//# sourceMappingURL=runtime-messaging.d.ts.map