import { formatScore } from '../utils/constants';

export default function AnimeCard({ anime, onClick, statusColor }) {
  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const genres = anime.genres?.slice(0, 3) || [];

  return (
    <div className="anime-card" onClick={() => onClick(anime)} role="button" tabIndex={0}>
      <div className="card-image-wrapper">
        <img
          src={image}
          alt={anime.title}
          loading="lazy"
        />

        {anime.score && (
          <div className="card-score">
            <span className="star">★</span>
            {formatScore(anime.score)}
          </div>
        )}

        {anime.type && <span className="card-type">{anime.type}</span>}

        {statusColor && (
          <div
            className="card-status-indicator"
            style={{ background: statusColor }}
          />
        )}

        <div className="card-image-overlay" />
        <div className="card-hover-info">
          {genres.length > 0 && (
            <div className="card-hover-genres">
              {genres.map((g) => (
                <span key={g.mal_id}>{g.name}</span>
              ))}
            </div>
          )}
          <div className="card-hover-meta">
            {anime.episodes && <span>{anime.episodes} eps</span>}
            {anime.season && <span>{anime.season} {anime.year}</span>}
            {anime.members && <span>{(anime.members / 1000).toFixed(0)}K members</span>}
          </div>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{anime.title}</h3>
        {anime.title_english && anime.title_english !== anime.title && (
          <p className="card-subtitle">{anime.title_english}</p>
        )}
      </div>
    </div>
  );
}
