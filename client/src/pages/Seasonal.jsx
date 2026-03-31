import { useState, useEffect } from 'react';
import { getCurrentSeasonAnime, getSeasonAnime } from '../api/jikan';
import AnimeGrid from '../components/AnimeGrid';
import Pagination from '../components/Pagination';
import { SEASONS, SEASON_LABELS, getCurrentSeason } from '../utils/constants';

export default function Seasonal({ onAnimeClick, getStatusColor }) {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();

  const [year, setYear] = useState(currentYear);
  const [season, setSeason] = useState(currentSeason);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeasonal();
  }, [year, season, page]);

  async function loadSeasonal() {
    setLoading(true);
    try {
      let res;
      if (year === currentYear && season === currentSeason) {
        res = await getCurrentSeasonAnime(page);
      } else {
        res = await getSeasonAnime(year, season, page);
      }
      setResults(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load seasonal:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSeasonChange = (newSeason) => {
    setSeason(newSeason);
    setPage(1);
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const years = [];
  for (let y = currentYear + 1; y >= 2000; y--) {
    years.push(y);
  }

  return (
    <div className="page" id="seasonal-page">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">Seasonal Anime</h1>
        </div>

        {/* Season Picker */}
        <div className="season-picker">
          <select
            className="year-select"
            value={year}
            onChange={handleYearChange}
            id="year-select"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="season-tabs">
            {SEASONS.map((s) => (
              <button
                key={s}
                className={`season-tab ${season === s ? 'active' : ''}`}
                onClick={() => handleSeasonChange(s)}
                id={`season-${s}`}
              >
                {SEASON_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <AnimeGrid
          animeList={results}
          loading={loading}
          onAnimeClick={onAnimeClick}
          getStatusColor={getStatusColor}
          emptyMessage="No anime found for this season"
        />

        {pagination && (
          <Pagination
            currentPage={page}
            lastPage={pagination.last_visible_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
