export const API_BASE = '/api';

export const STATUSES = {
  watching: { label: 'Watching', color: '#8b1a4a', icon: '' },
  completed: { label: 'Completed', color: '#2e7d32', icon: '' },
  plan_to_watch: { label: 'Plan to Watch', color: '#ef6c00', icon: '' },
  on_hold: { label: 'On Hold', color: '#b08a9a', icon: '' },
  dropped: { label: 'Dropped', color: '#c62828', icon: '' },
};

export const SEASONS = ['winter', 'spring', 'summer', 'fall'];

export const SEASON_LABELS = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
};

export function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
}

export function formatScore(score) {
  if (!score) return 'N/A';
  return score.toFixed(1);
}

export function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
