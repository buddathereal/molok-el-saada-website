import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldPlayBackgroundVideo } from '../utils/media-playback.js';

test('background video plays only when near the viewport and the tab is visible', () => {
  assert.equal(shouldPlayBackgroundVideo(true, true), true);
  assert.equal(shouldPlayBackgroundVideo(false, true), false);
  assert.equal(shouldPlayBackgroundVideo(true, false), false);
  assert.equal(shouldPlayBackgroundVideo(false, false), false);
});
