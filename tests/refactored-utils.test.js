import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

async function loadBundled(path) {
  const result = await build({ entryPoints: [path], bundle: true, platform: 'node', format: 'esm', write: false });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}

const { readCart, CART_STORAGE_KEY } = await loadBundled('utils/cart-storage.ts');
const { optimizeCloudinaryImage, cloudinarySrcSet, handleSafeImageError } = await loadBundled('utils/images.ts');

test('cart restoration tolerates invalid storage and validates saved selections', () => {
  const original = globalThis.localStorage;
  try {
    globalThis.localStorage = { getItem: () => '{broken' };
    assert.equal(readCart(), null);
    globalThis.localStorage = { getItem: () => { throw new Error('storage disabled'); } };
    assert.equal(readCart(), null);
    globalThis.localStorage = { getItem: (key) => {
      assert.equal(key, CART_STORAGE_KEY);
      return JSON.stringify({ version: 1, calcPax: 5000, selectedPkgId: 'bev-1', selectedEquipment: ['hot-32-mid', 'missing', 'hot-32-mid'], equipmentQuantities: { 'hot-32-mid': 2, missing: 20 }, selectedDrinks: ['مياه صغيرة', 'unknown'] });
    } };
    const restored = readCart();
    assert.equal(restored.calcPax, 1000);
    assert.equal(restored.selectedPkgId, 'bev-1');
    assert.deepEqual(restored.selectedEquipment, ['hot-32-mid']);
    assert.deepEqual(restored.equipmentQuantities, { 'hot-32-mid': 2 });
    assert.deepEqual(restored.selectedDrinks, ['مياه صغيرة']);
  } finally {
    if (original === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = original;
  }
});

test('image helpers retain Cloudinary optimizations and use the local fallback once', () => {
  const url = 'https://res.cloudinary.com/test/image/upload/f_auto,q_auto/example.jpg';
  assert.equal(optimizeCloudinaryImage(url, 480), 'https://res.cloudinary.com/test/image/upload/f_auto,q_auto,w_480,c_limit/example.jpg');
  assert.match(cloudinarySrcSet(url), /w_960,c_limit\/example.jpg 960w/);
  assert.equal(optimizeCloudinaryImage('/local.png', 480), '/local.png');
  const image = { dataset: {}, srcset: 'bad 480w', src: 'bad' };
  handleSafeImageError({ currentTarget: image });
  assert.equal(image.src, '/image-placeholder.svg');
  assert.equal(image.srcset, '');
  handleSafeImageError({ currentTarget: image });
  assert.equal(image.src, '/image-placeholder.svg');
});
