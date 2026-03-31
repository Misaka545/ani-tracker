import { API_BASE } from '../utils/constants';

async function fetchAPI(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export async function searchAnime(q, page = 1, filters = {}) {
  return fetchAPI('/anime/search', { q, page, limit: 24, ...filters });
}

export async function getTopAnime(filter = 'bypopularity', page = 1, limit = 24) {
  return fetchAPI('/anime/top', { filter, page, limit });
}

export async function getAnimeById(id) {
  return fetchAPI(`/anime/${id}`);
}

export async function getAnimeCharacters(id) {
  return fetchAPI(`/anime/${id}/characters`);
}

export async function getAnimeRecommendations(id) {
  return fetchAPI(`/anime/${id}/recommendations`);
}

export async function getCurrentSeasonAnime(page = 1) {
  return fetchAPI('/seasonal/now', { page, limit: 24 });
}

export async function getSeasonAnime(year, season, page = 1) {
  return fetchAPI(`/seasonal/${year}/${season}`, { page, limit: 24 });
}
