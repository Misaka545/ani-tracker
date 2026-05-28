import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime, getTopAnime } from '../api/jikan';
import AnimeGrid from '../components/AnimeGrid';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const TYPE_OPTIONS = ['', 'tv', 'movie', 'ova', 'ona', 'special', 'music'];
const STATUS_OPTIONS = ['', 'airing', 'complete', 'upcoming'];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'score', label: 'Score' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'members', label: 'Members' },
  { value: 'start_date', label: 'Release Date' },
  { value: 'episodes', label: 'Episodes' },
  { value: 'title', label: 'Title' },
];

export default function Search({ onAnimeClick, getStatusColor }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const genreId = searchParams.get('genres') || '';
  const genreName = searchParams.get('genre_name') || '';
  const topFilter = searchParams.get('top') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const sfwParam = searchParams.get('sfw');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [sortFilter, setSortFilter] = useState(searchParams.get('order_by') || '');
  const [sfwFilter, setSfwFilter] = useState(sfwParam === 'false' ? false : true);
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Scroll to top when navigating to this page with new params
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  useEffect(() => {
    if (topFilter) {
      loadTop(topFilter, currentPage);
    } else if (query || genreId || typeFilter || statusFilter || sortFilter) {
      performSearch(currentPage);
    } else {
      loadPopular(currentPage);
    }
  }, [query, genreId, currentPage, typeFilter, statusFilter, sortFilter, topFilter, sfwFilter]);

  async function loadTop(filter, page) {
    setLoading(true);
    try {
      const res = await getTopAnime(filter, page, 24, sfwFilter);
      setResults(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load top:', err);
    } finally {
      setLoading(false);
    }
  }

  async function performSearch(page) {
    setLoading(true);
    try {
      const filters = {};
      if (genreId) filters.genres = genreId;
      if (typeFilter) filters.type = typeFilter;
      if (statusFilter) filters.status = statusFilter;
      if (sortFilter) {
        filters.order_by = sortFilter;
        filters.sort = 'desc';
      }
      filters.sfw = sfwFilter ? true : '';
      const res = await searchAnime(query || '', page, filters);
      setResults(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadPopular(page) {
    setLoading(true);
    try {
      const res = await getTopAnime('bypopularity', page, 24, sfwFilter);
      setResults(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load popular:', err);
    } finally {
      setLoading(false);
    }
  }

  const updateParams = (overrides = {}) => {
    const params = { page: '1' };
    if (query) params.q = query;
    if (genreId) {
      params.genres = genreId;
      if (genreName) params.genre_name = genreName;
    }
    if (typeFilter) params.type = typeFilter;
    if (statusFilter) params.status = statusFilter;
    if (sortFilter) params.order_by = sortFilter;
    if (topFilter) params.top = topFilter;
    if (!sfwFilter) params.sfw = 'false';

    Object.assign(params, overrides);
    Object.keys(params).forEach((k) => {
      if (!params[k]) delete params[k];
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    updateParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTypeChange = (v) => {
    setTypeFilter(v);
    updateParams({ type: v, page: '1' });
  };

  const handleStatusChange = (v) => {
    setStatusFilter(v);
    updateParams({ status: v, page: '1' });
  };

  const handleSortChange = (v) => {
    setSortFilter(v);
    updateParams({ order_by: v, page: '1' });
  };

  const handleSfwChange = (v) => {
    const isSfw = v === 'true';
    setSfwFilter(isSfw);
    updateParams({ sfw: isSfw ? undefined : 'false', page: '1' });
  };

  const clearAllFilters = () => {
    setTypeFilter('');
    setStatusFilter('');
    setSortFilter('');
    setSfwFilter(true);
    const params = { page: '1' };
    if (query) params.q = query;
    setSearchParams(params);
  };

  const hasFilters = typeFilter || statusFilter || sortFilter || genreId || !sfwFilter;

  let title = 'Most Popular';
  if (topFilter === 'airing') title = 'Top Airing Anime';
  else if (topFilter === 'upcoming') title = 'Most Anticipated Anime';
  else if (query && genreName) title = `"${query}" in ${genreName}`;
  else if (query) title = `Results for "${query}"`;
  else if (genreName) title = genreName;
  else if (hasFilters) title = 'Filtered Results';

  return (
    <div className="page" id="search-page">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">{title}</h1>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="search-filters">
            <div className="filter-group">
              <label className="filter-label">Type</label>
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="">All Types</option>
                {TYPE_OPTIONS.filter(Boolean).map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.filter(Boolean).map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortFilter}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Content</label>
              <select
                className="filter-select"
                value={sfwFilter ? 'true' : 'false'}
                onChange={(e) => handleSfwChange(e.target.value)}
              >
                <option value="true">SFW Only</option>
                <option value="false">All Content (NSFW)</option>
              </select>
            </div>

            {hasFilters && (
              <button className="filter-clear" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>
        )}

        <AnimeGrid
          animeList={results}
          loading={loading}
          onAnimeClick={onAnimeClick}
          getStatusColor={getStatusColor}
          emptyMessage={query ? `No results for "${query}"` : 'Loading...'}
        />

        {pagination && (
          <Pagination
            currentPage={currentPage}
            lastPage={pagination.last_visible_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
