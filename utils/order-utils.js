/** @typedef {import('../types').MenuPackage} MenuPackage */
/** @typedef {import('../types').EquipmentItem} EquipmentItem */

/**
 * @typedef {{ kind: 'booking', pendingPackage: null, pendingEquipment: null }
 *   | { kind: 'package-inquiry', pendingPackage: MenuPackage, pendingEquipment: null }
 *   | { kind: 'equipment-inquiry', pendingPackage: null, pendingEquipment: EquipmentItem[] | null }} OrderContext
 */

/**
 * @typedef {{ type: 'start-booking' }
 *   | { type: 'start-package-inquiry', package: MenuPackage }
 *   | { type: 'start-equipment-inquiry', items: EquipmentItem[] | null }
 *   | { type: 'reset' }} OrderContextAction
 */

/** @type {OrderContext} */
export const initialOrderContext = {
  kind: 'booking',
  pendingPackage: null,
  pendingEquipment: null
};

/** @param {OrderContext} _state @param {OrderContextAction} action @returns {OrderContext} */
export function orderContextReducer(_state, action) {
  switch (action.type) {
    case 'start-booking':
    case 'reset':
      return { ...initialOrderContext };
    case 'start-package-inquiry':
      return {
        kind: 'package-inquiry',
        pendingPackage: action.package,
        pendingEquipment: null
      };
    case 'start-equipment-inquiry':
      return {
        kind: 'equipment-inquiry',
        pendingPackage: null,
        pendingEquipment: action.items
      };
    default:
      return _state;
  }
}

/** @param {number | string | null | undefined} value */
export function normalizeQuantity(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;
}

/** @param {number | string | null | undefined} value @param {number} [min] @param {number} [max] */
export function clampGuestCount(value, min = 25, max = 1000) {
  const parsed = Number(value);
  const integer = Number.isFinite(parsed) ? Math.floor(parsed) : min;
  return Math.min(max, Math.max(min, integer));
}

/**
 * Calculate a total from price/quantity lines using the same quantity invariant as the UI.
 * @param {Array<{unitPrice: number | string, quantity: number | string}>} lines
 */
export function calculateOrderTotal(lines) {
  return lines.reduce((total, line) => {
    const unitPrice = Number(line.unitPrice);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) return total;
    return total + unitPrice * normalizeQuantity(line.quantity);
  }, 0);
}

/**
 * Resolve selected IDs from a normalized catalog, preserving selection order and removing duplicates.
 * @template {{id: string}} T
 * @param {string[]} selectedIds
 * @param {T[]} catalog
 * @returns {T[]}
 */
export function resolveEquipmentSelections(selectedIds, catalog) {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const seen = new Set();
  const resolved = [];

  for (const id of selectedIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const item = byId.get(id);
    if (item) resolved.push(item);
  }

  return resolved;
}

/**
 * @param {EquipmentItem[]} items
 * @param {Record<string, number>} quantities
 */
export function buildEquipmentOrderSummary(items, quantities) {
  const uniqueItems = resolveEquipmentSelections(items.map((item) => item.id), items);
  let total = 0;
  let unpricedCount = 0;

  const lines = uniqueItems.map((item) => {
    const quantity = normalizeQuantity(quantities[item.id]);
    const name = item.name || item.id;
    const price = Number(item.price);

    if (!Number.isFinite(price) || price <= 0) {
      unpricedCount += 1;
      return `- ${name} (عدد ${quantity}): السعر غير مدرج`;
    }

    const lineTotal = calculateOrderTotal([{ unitPrice: price, quantity }]);
    total += lineTotal;
    return `- ${name} (عدد ${quantity}): ${lineTotal.toLocaleString()} ج.م`;
  });

  return { lines: lines.join('\n'), total, unpricedCount, itemCount: uniqueItems.length };
}

/** @param {{name: string, phone: string, eventDate: string, agreedToDeposit: boolean}} info */
export function validateCustomerInfo(info) {
  /** @type {Partial<Record<'name' | 'phone' | 'eventDate' | 'agreedToDeposit', string>>} */
  const errors = {};
  const name = String(info.name || '').trim().replace(/\s+/g, ' ');

  if (name.split(' ').filter(Boolean).length < 2) {
    errors.name = 'يرجى إدخال الاسم الأول واسم العائلة.';
  }
  if (!String(info.phone || '').trim()) {
    errors.phone = 'رقم الهاتف مطلوب.';
  }
  if (!String(info.eventDate || '').trim()) {
    errors.eventDate = 'موعد المناسبة مطلوب.';
  }
  if (!info.agreedToDeposit) {
    errors.agreedToDeposit = 'يرجى تأكيد الموافقة على العربون للمتابعة.';
  }

  return errors;
}

/**
 * Format the final customer block and selected order sections for WhatsApp.
 * The message is prepared for review; opening WhatsApp does not send it.
 * @param {{header: string, sections: string[], customerInfo: {name: string, phone: string, eventDate: string, eventLocation?: string, message?: string, agreedToDeposit?: boolean}}} input
 */
export function buildWhatsAppOrderMessage({ header, sections, customerInfo }) {
  const cleanSections = sections.map((section) => String(section || '').trim()).filter(Boolean);
  if (!String(header || '').trim() || cleanSections.length === 0) {
    throw new Error('Order details are required before preparing a WhatsApp message.');
  }

  const customerLines = [
    `- الاسم: ${String(customerInfo.name || '').trim().replace(/\s+/g, ' ')}`,
    `- الرقم: ${String(customerInfo.phone || '').trim()}`,
    `- ميعاد المناسبة: ${String(customerInfo.eventDate || '').trim()}`
  ];
  if (String(customerInfo.eventLocation || '').trim()) {
    customerLines.push(`- مكان المناسبة: ${String(customerInfo.eventLocation).trim()}`);
  }
  if (String(customerInfo.message || '').trim()) {
    customerLines.push(`- ملاحظات: ${String(customerInfo.message).trim()}`);
  }

  const depositLine = customerInfo.agreedToDeposit
    ? '\n\n✅ العميل موافق على دفع 30% ديبوزت (عربون) لتأكيد الحجز.'
    : '';

  return `${String(header).trim()}\n\n${cleanSections.join('\n\n')}\n\n*بيانات العميل:*\n${customerLines.join('\n')}${depositLine}\n\nيرجى التواصل للتأكيد وتحديد الموعد.`;
}

/** @param {string} phone @param {string} message */
export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) throw new Error('A WhatsApp phone number is required.');
  const url = new URL(`https://wa.me/${digits}`);
  url.searchParams.set('text', message);
  return url.toString();
}

/**
 * Open a prefilled WhatsApp URL through an injectable browser function.
 * Tests supply a mock so no external page is opened.
 * @param {string} url
 * @param {(url: string, target: string, features: string) => unknown} [openWindow]
 * @returns {boolean} Whether the browser handoff was initiated without throwing.
 */
export function openWhatsAppMessage(url, openWindow) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'wa.me') {
    throw new Error('Only HTTPS WhatsApp links are allowed.');
  }

  const opener = openWindow || ((targetUrl, target, features) => {
    if (typeof window === 'undefined') return null;
    return window.open(targetUrl, target, features);
  });

  try {
    opener(url, '_blank', 'noopener,noreferrer');
    return true;
  } catch {
    return false;
  }
}
