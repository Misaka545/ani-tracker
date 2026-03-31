const API_BASE = `${import.meta.env.VITE_API_URL || '/api'}/list`;

async function fetchList(endpoint = '', options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(`List API Error: ${response.status}`);
  return response.json();
}

export async function getList(status = 'all') {
  return fetchList(`?status=${status}`);
}

export async function checkAnimeInList(malId) {
  return fetchList(`/${malId}`);
}

export async function addAnimeToList(anime, status) {
  return fetchList('', {
    method: 'POST',
    body: JSON.stringify({ anime, status }),
  });
}

export async function updateAnimeStatus(malId, status) {
  return fetchList(`/${malId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function removeAnimeFromList(malId) {
  return fetchList(`/${malId}`, {
    method: 'DELETE',
  });
}
