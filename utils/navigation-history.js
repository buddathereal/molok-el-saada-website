/** @typedef {'home' | 'portal' | 'category' | 'tools' | 'contact'} HistoryView */

const HISTORY_VIEWS = new Set(['home', 'portal', 'category', 'tools', 'contact']);

/**
 * Validate history state against the current stable catalog identifiers.
 * Display labels and arbitrary objects in browser history are never trusted.
 * @param {unknown} rawState
 * @param {string[]} validCategoryIds
 * @param {string[]} validEquipmentCategoryIds
 * @returns {{ view: HistoryView, categoryId: string | null, activeEquipmentCatId: string | null }}
 */
export function normalizeNavigationHistoryState(rawState, validCategoryIds, validEquipmentCategoryIds) {
  const state = rawState && typeof rawState === 'object' && !Array.isArray(rawState)
    ? /** @type {Record<string, unknown>} */ (rawState)
    : {};
  const rawView = typeof state.view === 'string' ? state.view : '';
  /** @type {HistoryView} */
  let view = HISTORY_VIEWS.has(rawView) ? /** @type {HistoryView} */ (rawView) : 'home';

  const categoryId = typeof state.categoryId === 'string' && validCategoryIds.includes(state.categoryId)
    ? state.categoryId
    : null;
  if (view === 'category' && !categoryId) view = 'portal';

  const activeEquipmentCatId = view === 'tools'
    && typeof state.activeEquipmentCatId === 'string'
    && validEquipmentCategoryIds.includes(state.activeEquipmentCatId)
    ? state.activeEquipmentCatId
    : null;

  return { view, categoryId, activeEquipmentCatId };
}
