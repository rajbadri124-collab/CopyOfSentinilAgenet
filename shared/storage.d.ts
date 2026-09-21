import type { Settings, FeedbackEntry } from './message-types';
/** Load extension settings from chrome.storage.local. */
export declare function loadSettings(): Promise<Settings>;
/** Save extension settings to chrome.storage.local. */
export declare function saveSettings(settings: Partial<Settings>): Promise<void>;
/** Append a feedback entry to the log. */
export declare function logFeedback(entry: FeedbackEntry): Promise<void>;
/** Get all feedback entries. */
export declare function getFeedbackLog(): Promise<FeedbackEntry[]>;
/** Clear all feedback entries. */
export declare function clearFeedback(): Promise<void>;
/** Entity map storage — keyed by conversation URL. */
export interface StoredEntityMap {
    [placeholder: string]: string;
}
/** Save an entity map for a specific conversation URL. */
export declare function saveEntityMap(conversationUrl: string, map: StoredEntityMap): Promise<void>;
/** Load the entity map for a specific conversation URL. */
export declare function loadEntityMap(conversationUrl: string): Promise<StoredEntityMap>;
/**
 * Narrow a map to the entries whose replacement token a single page session
 * actually emitted into the page.
 *
 * The "new chat" URL is a shared key: every new conversation in every tab
 * files its mappings under it until the site assigns a real one. A session
 * restores that key on load, so its in-memory map can hold entries belonging
 * to other sessions' drafts. Persisting or migrating the map wholesale would
 * carry those originals into this conversation, where its reveal banner
 * would resolve placeholders it never sent. Both writers pass their entries
 * through here so a session only ever stores what it used.
 */
export declare function ownedEntries(map: StoredEntityMap, owned: ReadonlySet<string>): StoredEntityMap;
/**
 * Move placeholder mappings recorded before a conversation existed onto the
 * URL the site assigned it.
 *
 * Every supported chat site creates the conversation on the first send and
 * rewrites the URL in place. Anything anonymized while composing is filed
 * under the transient "new chat" URL, so without this the mappings become
 * unreachable the moment the page is reloaded.
 *
 * Only the supplied entries move — the ones this page session actually
 * produced. A second tab composing its own new chat keeps its pending
 * mappings under the transient URL untouched.
 */
export declare function migrateEntityMap(fromUrl: string, toUrl: string, entries: StoredEntityMap): Promise<void>;
/** Clear entity maps for a specific conversation or all conversations. */
export declare function clearEntityMaps(conversationUrl?: string): Promise<void>;
//# sourceMappingURL=storage.d.ts.map