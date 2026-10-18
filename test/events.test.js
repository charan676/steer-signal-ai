import test from 'node:test';
import assert from 'node:assert/strict';
import { clearLocalEvents, getLocalEvents, trackEvent } from '../src/utils/events.js';

test('the local event buffer keeps only approved, non-identifying event shapes', () => {
  clearLocalEvents();
  trackEvent('experience_opened', 'case-file');
  trackEvent('not-allowed', 'case-file');
  trackEvent('round_completed', 'signal-rush');
  assert.deepEqual(getLocalEvents(), [
    { name: 'experience_opened', experience: 'case-file' },
    { name: 'round_completed', experience: 'signal-rush' }
  ]);
});

test('the local event buffer is bounded to 100 records', () => {
  clearLocalEvents();
  for (let index = 0; index < 105; index += 1) trackEvent('experience_opened', 'signal');
  const events = getLocalEvents();
  assert.equal(events.length, 100);
  assert.deepEqual(events[0], { name: 'experience_opened', experience: 'signal' });
});
