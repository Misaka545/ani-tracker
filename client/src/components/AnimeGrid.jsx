import AnimeCard from './AnimeCard';
import SkeletonCard from './SkeletonCard';

export default function AnimeGrid({ animeList, loading, onAnimeClick, getStatusColor, emptyMessage }) {
  if (loading) {
    return (
      <div className="anime-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!animeList || animeList.length === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyMessage || 'No anime found'}</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="anime-grid">
      {animeList.map((anime) => (
        <AnimeCard
          key={anime.mal_id}
          anime={anime}
          onClick={onAnimeClick}
          statusColor={getStatusColor ? getStatusColor(anime.mal_id) : null}
        />
      ))}
    </div>
  );
}
