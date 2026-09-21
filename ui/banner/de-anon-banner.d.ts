/**
 * Privacy Guardrail — De-anonymization Banner (Shadow DOM)
 *
 * Attaches to AI response elements that contain placeholders.
 * Provides a toggle to reveal/hide original PII values as a
 * non-destructive overlay on the response text.
 */
import { EntityMap } from '../../shared/entity-map';
/**
 * Create and attach a de-anonymization banner above a response element.
 *
 * @param theme — visual theme to render in. Defaults to `dark`.
 */
export declare function attachDeAnonBanner(responseElement: HTMLElement, entityMap: EntityMap, theme?: 'dark' | 'light'): void;
//# sourceMappingURL=de-anon-banner.d.ts.map