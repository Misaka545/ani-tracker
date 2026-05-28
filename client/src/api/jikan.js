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
  
  const json = await response.json();
  
  if (json && Array.isArray(json.data)) {
    const seen = new Set();
    json.data = json.data.filter(anime => {
      if (!anime || !anime.mal_id) return true;
      if (seen.has(anime.mal_id)) return false;
      seen.add(anime.mal_id);
      return true;
    });
  }

  return json;
}

export async function searchAnime(q, page = 1, filters = {}) {
  const finalFilters = { sfw: true, ...filters };
  return fetchAPI('/anime/search', { q, page, limit: 24, ...finalFilters });
}

export async function getTopAnime(filter = 'bypopularity', page = 1, limit = 24, sfw = true) {
  return fetchAPI('/anime/top', { filter, page, limit, sfw: sfw ? 'true' : '' });
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

export async function getCurrentSeasonAnime(page = 1, sfw = true) {
  return fetchAPI('/seasonal/now', { page, limit: 25, sfw: sfw ? 'true' : '' });
}

export async function getSeasonAnime(year, season, page = 1, sfw = true) {
  return fetchAPI(`/seasonal/${year}/${season}`, { page, limit: 25, sfw: sfw ? 'true' : '' });
}
