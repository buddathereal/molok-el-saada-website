import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEquipmentOrderSummary,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateOrderTotal,
  clampGuestCount,
  initialOrderContext,
  normalizeQuantity,
  openWhatsAppMessage,
  orderContextReducer,
  resolveEquipmentSelections,
  validateCustomerInfo
} from '../utils/order-utils.js';
import { normalizeNavigationHistoryState } from '../utils/navigation-history.js';

test('quantity input is a positive integer and cannot produce a negative total', () => {
  assert.equal(normalizeQuantity('-4'), 1);
  assert.equal(normalizeQuantity('0'), 1);
  assert.equal(normalizeQuantity('2.9'), 2);
  assert.equal(normalizeQuantity('8'), 8);
  assert.equal(normalizeQuantity(''), 1);
  assert.equal(normalizeQuantity('not-a-number'), 1);
});

test('guest count stays within the displayed endpoints and reaches 1000', () => {
  assert.equal(clampGuestCount(10), 25);
  assert.equal(clampGuestCount(999.9), 999);
  assert.equal(clampGuestCount(1000), 1000);
  assert.equal(clampGuestCount(1200), 1000);
});

test('order totals use positive integer quantities and ignore invalid or unpriced lines', () => {
  assert.equal(calculateOrderTotal([
    { unitPrice: 100, quantity: 2 },
    { unitPrice: '25', quantity: 1.9 },
    { unitPrice: 50, quantity: -8 },
    { unitPrice: 0, quantity: 500 },
    { unitPrice: 'invalid', quantity: 2 }
  ]), 275);
});

test('equipment selections resolve options and quick selections, preserving order without duplicates', () => {
  const catalog = [
    { id: 'parent', name: 'Collection' },
    { id: 'option-a', name: 'Table option' },
    { id: 'quick-a', name: 'Quick cutlery selection' }
  ];
  const result = resolveEquipmentSelections(
    ['quick-a', 'option-a', 'missing', 'quick-a'],
    catalog
  );
  assert.deepEqual(result.map((item) => item.id), ['quick-a', 'option-a']);
});

test('equipment summary includes resolved variants, quantities, prices, and identifies unpriced items', () => {
  const summary = buildEquipmentOrderSummary(
    [
      { id: 'option-a', name: 'طقم اكس كامل', price: 600 },
      { id: 'quick-a', name: 'معلقة ك سيلفر', price: 5 },
      { id: 'quote-only', name: 'معدات حسب الطلب' },
      { id: 'option-a', name: 'طقم اكس كامل', price: 600 }
    ],
    { 'option-a': 2, 'quick-a': -5 }
  );

  assert.equal(summary.total, 1205);
  assert.equal(summary.unpricedCount, 1);
  assert.match(summary.lines, /طقم اكس كامل \(عدد 2\)/);
  assert.match(summary.lines, /معلقة ك سيلفر \(عدد 1\)/);
  assert.match(summary.lines, /معدات حسب الطلب \(عدد 1\)/);
  assert.equal((summary.lines.match(/طقم اكس كامل/g) || []).length, 1);
});

test('new order flow replaces stale package/equipment context and reset clears it', () => {
  const oldPackage = { id: 'old-package', title: 'Old', price: 1, sections: [] };
  const nextEquipment = [{ id: 'chair', name: 'Chair', price: 10 }];
  const stale = orderContextReducer(initialOrderContext, {
    type: 'start-package-inquiry',
    package: oldPackage
  });
  const equipmentFlow = orderContextReducer(stale, {
    type: 'start-equipment-inquiry',
    items: nextEquipment
  });

  assert.equal(equipmentFlow.kind, 'equipment-inquiry');
  assert.equal(equipmentFlow.pendingPackage, null);
  assert.deepEqual(equipmentFlow.pendingEquipment, nextEquipment);
  assert.deepEqual(orderContextReducer(equipmentFlow, { type: 'start-booking' }), initialOrderContext);
  assert.deepEqual(orderContextReducer(equipmentFlow, { type: 'reset' }), initialOrderContext);
});

test('booking validation enforces the displayed two-part name without inventing a phone format', () => {
  const valid = {
    name: '  أحمد محمد  ',
    phone: 'phone-format-policy-not-provided',
    eventDate: 'الجمعة القادمة',
    agreedToDeposit: true
  };
  assert.deepEqual(validateCustomerInfo(valid), {});
  assert.deepEqual(validateCustomerInfo({ ...valid, name: ' أحمد   محمد ' }), {});
  assert.ok(validateCustomerInfo({ ...valid, name: 'أحمد' }).name);
  assert.ok(validateCustomerInfo({ ...valid, name: '   ' }).name);
  assert.ok(validateCustomerInfo({ ...valid, phone: '  ' }).phone);
  assert.ok(validateCustomerInfo({ ...valid, eventDate: '' }).eventDate);
  assert.ok(validateCustomerInfo({ ...valid, agreedToDeposit: false }).agreedToDeposit);
});

test('browser history restores stable category IDs and rejects stale display text', () => {
  const restored = normalizeNavigationHistoryState(
    { view: 'category', categoryId: 'Beverages', categoryName: 'stale title' },
    ['Beverages', 'Services'],
    ['buffet']
  );
  assert.deepEqual(restored, { view: 'category', categoryId: 'Beverages', activeEquipmentCatId: null });

  assert.deepEqual(normalizeNavigationHistoryState(
    { view: 'category', categoryId: 'removed-category' }, ['Beverages'], ['buffet']
  ), { view: 'portal', categoryId: null, activeEquipmentCatId: null });
  assert.deepEqual(normalizeNavigationHistoryState(
    { view: 'tools', activeEquipmentCatId: 'unknown-category' }, ['Beverages'], ['buffet']
  ), { view: 'tools', categoryId: null, activeEquipmentCatId: null });
});

test('WhatsApp handoff URL safely encodes its message without sending it', () => {
  const url = new URL(buildWhatsAppUrl('+20 (109) 735-6529', 'طلب حجز & ملاحظات'));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/201097356529');
  assert.equal(url.searchParams.get('text'), 'طلب حجز & ملاحظات');
});

test('message builder includes the chosen order, customer details and only entered optional data', () => {
  const message = buildWhatsAppOrderMessage({
    header: '*طلب حجز من ملوك السعادة*',
    sections: ['*المعدات المختارة:*\n- طقم ضيافة (عدد 2): 500 ج.م'],
    customerInfo: {
      name: 'أحمد محمد',
      phone: '01012345678',
      eventDate: 'الجمعة القادمة',
      eventLocation: '',
      message: '',
      agreedToDeposit: true
    }
  });

  assert.match(message, /طقم ضيافة \(عدد 2\): 500 ج\.م/);
  assert.match(message, /الاسم: أحمد محمد/);
  assert.match(message, /الرقم: 01012345678/);
  assert.match(message, /موافق على دفع 30%/);
  assert.doesNotMatch(message, /مكان المناسبة:/);
  assert.doesNotMatch(message, /ملاحظات:/);
  assert.throws(() => buildWhatsAppOrderMessage({ header: '*طلب*', sections: [], customerInfo: {} }), /Order details are required/);
});

test('WhatsApp window opening is isolated behind a mockable no-opener handoff', () => {
  const calls = [];
  const url = 'https://wa.me/201097356529?text=Hello';
  const result = openWhatsAppMessage(url, (...args) => {
    calls.push(args);
    return 'mock-window';
  });

  assert.equal(result, true);
  assert.deepEqual(calls, [[url, '_blank', 'noopener,noreferrer']]);
  assert.throws(() => openWhatsAppMessage('https://example.com/', () => null), /Only HTTPS WhatsApp links/);
});
