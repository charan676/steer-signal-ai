// Deliberately local, bounded and non-identifying. Do not add answers, URLs,
// timestamps, health details, or personal data to these events.
const events = [];
const allowed = new Set([
  'experience_opened', 'round_completed', 'experience_completed',
  'challenge_share_clicked', 'steer_cta_clicked', 'replay_clicked'
]);

export function trackEvent(name, experience) {
  if (!allowed.has(name) || typeof experience !== 'string') return;
  events.push(Object.freeze({ name, experience }));
  if (events.length > 100) events.shift();
}

export function getLocalEvents() {
  return [...events];
}

export function clearLocalEvents() {
  events.length = 0;
}
