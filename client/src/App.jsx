import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AnimeDetail from './components/AnimeDetail';
import Home from './pages/Home';
import Search from './pages/Search';
import Seasonal from './pages/Seasonal';
import MyList from './pages/MyList';
import { useTracker } from './hooks/useTracker';
import { useTheme } from './hooks/useTheme';
import { getAnimeById } from './api/jikan';

export default function App() {
  const tracker = useTracker();
  const theme = useTheme();
  const [selectedAnime, setSelectedAnime] = useState(null);

  const handleAnimeClick = useCallback(async (anime) => {
    if (anime.synopsis) {
      setSelectedAnime(anime);
      return;
    }
    try {
      setSelectedAnime(anime);
      const res = await getAnimeById(anime.mal_id);
      setSelectedAnime(res.data);
    } catch (err) {
      console.error('Failed to fetch anime detail:', err);
    }
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedAnime(null);
  }, []);

  const getStatusColor = useCallback(
    (animeId) => tracker.getStatusColor(animeId),
    [tracker]
  );

  return (
    <BrowserRouter>
      <Navbar listCount={tracker.getCount('all')} theme={theme} onToggleTheme={theme.toggle} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              onAnimeClick={handleAnimeClick}
              getStatusColor={getStatusColor}
            />
          }
        />
        <Route
          path="/search"
          element={
            <Search
              onAnimeClick={handleAnimeClick}
              getStatusColor={getStatusColor}
            />
          }
        />
        <Route
          path="/seasonal"
          element={
            <Seasonal
              onAnimeClick={handleAnimeClick}
              getStatusColor={getStatusColor}
            />
          }
        />
        <Route
          path="/mylist"
          element={
            <MyList
              tracker={tracker}
              onAnimeClick={handleAnimeClick}
              getStatusColor={getStatusColor}
            />
          }
        />
      </Routes>

      {selectedAnime && (
        <AnimeDetail
          anime={selectedAnime}
          onClose={handleCloseDetail}
          tracker={tracker}
        />
      )}
    </BrowserRouter>
  );
}
