import { useState, useEffect, useCallback } from 'react';
import {
  getList,
  addAnimeToList,
  updateAnimeStatus,
  removeAnimeFromList,
  checkAnimeInList,
} from '../api/list';
import { STATUSES } from '../utils/constants';

export function useTracker() {
  const [list, setList] = useState([]);
  const [counts, setCounts] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
  }, []);

  async function loadList(status = 'all') {
    try {
      setLoading(true);
      const res = await getList(status);
      setList(res.data || []);
      setCounts(res.counts || {});
      const map = {};
      for (const item of res.data || []) {
        map[item.mal_id] = item.status;
      }
      setStatusMap(map);
    } catch (err) {
      console.error('Failed to load list:', err);
    } finally {
      setLoading(false);
    }
  }

  const addToList = useCallback(async (anime, status) => {
    try {
      const res = await addAnimeToList(anime, status);
      setCounts(res.counts || {});
      setStatusMap((prev) => ({ ...prev, [anime.mal_id]: status }));
      const listRes = await getList('all');
      setList(listRes.data || []);
    } catch (err) {
      console.error('Failed to add to list:', err);
    }
  }, []);

  const removeFromList = useCallback(async (malId) => {
    try {
      const res = await removeAnimeFromList(malId);
      setCounts(res.counts || {});
      setStatusMap((prev) => {
        const next = { ...prev };
        delete next[malId];
        return next;
      });
      setList((prev) => prev.filter((a) => a.mal_id !== malId));
    } catch (err) {
      console.error('Failed to remove from list:', err);
    }
  }, []);

  const isInList = useCallback(
    (malId) => malId in statusMap,
    [statusMap]
  );

  const getStatus = useCallback(
    (malId) => statusMap[malId] || null,
    [statusMap]
  );

  const getListByStatus = useCallback(
    (status) => {
      if (status === 'all') return list;
      return list.filter((a) => a.status === status);
    },
    [list]
  );

  const getCount = useCallback(
    (status) => {
      if (status === 'all') return counts.all || 0;
      return counts[status] || 0;
    },
    [counts]
  );

  const getStatusColor = useCallback(
    (malId) => {
      const status = statusMap[malId];
      if (!status) return null;
      return STATUSES[status]?.color || null;
    },
    [statusMap]
  );

  return {
    list,
    counts,
    loading,
    addToList,
    removeFromList,
    isInList,
    getStatus,
    getListByStatus,
    getCount,
    getStatusColor,
    refresh: loadList,
  };
}
