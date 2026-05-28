import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopAnime, getCurrentSeasonAnime } from '../api/jikan';
import AnimeGrid from '../components/AnimeGrid';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Home({ onAnimeClick, getStatusColor }) {
  const [topAiring, setTopAiring] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [topUpcoming, setTopUpcoming] = useState([]);
  const [loadingAiring, setLoadingAiring] = useState(true);
  const [loadingSeasonal, setLoadingSeasonal] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    let topAiringData = [];
    try {
      setLoadingAiring(true);
      const airingRes = await getTopAnime('airing', 1, 16);
      topAiringData = airingRes.data?.slice(0, 12) || [];
      setTopAiring(topAiringData);
      setLoadingAiring(false);
    } catch (err) {
      console.error('Failed to load airing:', err);
      setLoadingAiring(false);
    }

    await delay(400);

    try {
      setLoadingSeasonal(true);
      const seasonRes = await getCurrentSeasonAnime(1);
      
      const airingIds = new Set(topAiringData.map(a => a.mal_id));
      const uniqueSeasonal = (seasonRes.data || []).filter(a => !airingIds.has(a.mal_id));
      
      setSeasonal(uniqueSeasonal.slice(0, 12));
      setLoadingSeasonal(false);
    } catch (err) {
      console.error('Failed to load seasonal:', err);
      setLoadingSeasonal(false);
    }

    await delay(400);

    try {
      setLoadingUpcoming(true);
      const upcomingRes = await getTopAnime('upcoming', 1, 10);
      setTopUpcoming(upcomingRes.data?.slice(0, 6) || []);
      setLoadingUpcoming(false);
    } catch (err) {
      console.error('Failed to load upcoming:', err);
      setLoadingUpcoming(false);
    }
  }

  return (
    <div className="page" id="home-page">
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <h1>Discover & Track<br />Your Anime Journey</h1>
          <p>Explore trending anime, discover seasonal releases, and build your personal watchlist</p>
        </section>

        {/* Top Airing */}
        <section style={{ marginBottom: '48px' }}>
          <div className="section-header">
            <h2 className="section-title">Top Airing</h2>
            <Link to="/search?top=airing" className="section-link">
              View All →
            </Link>
          </div>
          <AnimeGrid
            animeList={topAiring}
            loading={loadingAiring}
            onAnimeClick={onAnimeClick}
            getStatusColor={getStatusColor}
          />
        </section>

        {/* This Season */}
        <section style={{ marginBottom: '48px' }}>
          <div className="section-header">
            <h2 className="section-title">This Season</h2>
            <Link to="/seasonal" className="section-link">
              View All →
            </Link>
          </div>
          <AnimeGrid
            animeList={seasonal}
            loading={loadingSeasonal}
            onAnimeClick={onAnimeClick}
            getStatusColor={getStatusColor}
          />
        </section>

        {/* Top Upcoming */}
        <section style={{ marginBottom: '48px' }}>
          <div className="section-header">
            <h2 className="section-title">Most Anticipated</h2>
            <Link to="/search?top=upcoming" className="section-link">
              View All →
            </Link>
          </div>
          <AnimeGrid
            animeList={topUpcoming}
            loading={loadingUpcoming}
            onAnimeClick={onAnimeClick}
            getStatusColor={getStatusColor}
          />
        </section>
      </div>
    </div>
  );
}
