import test from 'node:test';
import assert from 'node:assert/strict';
import { syncDrinkQuantities } from '../utils/drink-quantities.js';

test('guest count updates automatic drinks without overwriting customized amounts', () => {
  const previous = { tea: 25, water: 10 };
  assert.deepEqual(syncDrinkQuantities(previous, ['tea', 'water'], ['water'], 50), { tea: 50, water: 10 });
  assert.deepEqual(previous, { tea: 25, water: 10 });
});
