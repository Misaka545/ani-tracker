import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATUSES, formatScore, formatNumber } from '../utils/constants';

export default function AnimeDetail({ anime, onClose, tracker }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const currentStatus = tracker.getStatus(anime.mal_id);
  const inList = tracker.isInList(anime.mal_id);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = () => setShowDropdown(false);
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [showDropdown]);

  const handleStatusSelect = (status) => {
    tracker.addToList(anime, status);
    setShowDropdown(false);
  };

  const handleRemove = () => {
    tracker.removeFromList(anime.mal_id);
  };

  const handleGenreClick = (genre) => {
    onClose();
    navigate(`/search?genres=${genre.mal_id}&genre_name=${encodeURIComponent(genre.name)}`);
  };

  const bannerImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const genres = [...(anime.genres || []), ...(anime.themes || [])];

  return (
    <div className="modal-overlay" onClick={onClose} id="anime-detail-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Banner */}
        <div className="detail-banner">
          <img src={bannerImage} alt="" />
          <div className="detail-banner-overlay" />
          <button className="detail-close" onClick={onClose} aria-label="Close" id="detail-close">
            ×
          </button>
        </div>

        {/* Main Info */}
        <div className="detail-main">
          <div className="detail-poster">
            <img src={bannerImage} alt={anime.title} />
          </div>
          <div className="detail-info">
            <h1 className="detail-title">{anime.title}</h1>
            {anime.title_japanese && (
              <p className="detail-title-jp">{anime.title_japanese}</p>
            )}

            <div className="detail-meta">
              {[
                anime.type,
                anime.episodes && `${anime.episodes} eps`,
                anime.status,
                anime.duration,
                anime.rating,
              ].filter(Boolean).map((item, i, arr) => (
                <span key={i} className="detail-meta-item">
                  <span className="meta-value">{item}</span>
                  {i < arr.length - 1 && <span className="meta-sep">|</span>}
                </span>
              ))}
            </div>

            {anime.score && (
              <div className="detail-score-big">
                <span className="score-number">{formatScore(anime.score)}</span>
                <div className="score-info">
                  <span>Score</span>
                  <span>{formatNumber(anime.scored_by)} votes</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
              <div className="status-dropdown">
                <button
                  className="action-btn primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                  id="add-to-list-btn"
                >
                  {inList ? STATUSES[currentStatus]?.label : 'Add to List'}
                </button>
                {showDropdown && (
                  <div className="status-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    {Object.entries(STATUSES).map(([key, config]) => (
                      <button
                        key={key}
                        className={`status-option ${currentStatus === key ? 'selected' : ''}`}
                        onClick={() => handleStatusSelect(key)}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {inList && (
                <button className="action-btn danger" onClick={handleRemove} id="remove-from-list-btn">
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="detail-body">
          {anime.synopsis && (
            <div className="detail-section">
              <h3>Synopsis</h3>
              <p className="detail-synopsis">{anime.synopsis}</p>
            </div>
          )}

          {genres.length > 0 && (
            <div className="detail-section">
              <h3>Genres & Themes</h3>
              <div className="detail-genres">
                {genres.map((g) => (
                  <button
                    key={g.mal_id}
                    className="genre-tag"
                    onClick={() => handleGenreClick(g)}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>Statistics</h3>
            <div className="detail-stats-grid">
              <div className="stat-card">
                <div className="stat-value">#{anime.rank || '—'}</div>
                <div className="stat-label">Ranked</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">#{anime.popularity || '—'}</div>
                <div className="stat-label">Popularity</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{formatNumber(anime.members)}</div>
                <div className="stat-label">Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{formatNumber(anime.favorites)}</div>
                <div className="stat-label">Favorites</div>
              </div>
            </div>
          </div>

          {anime.trailer?.youtube_id && (
            <div className="detail-section">
              <h3>Trailer</h3>
              <div className="detail-trailer">
                <iframe
                  src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                  title={`${anime.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {(anime.studios?.length > 0 || anime.producers?.length > 0) && (
            <div className="detail-section">
              <h3>Production</h3>
              <div className="detail-meta">
                {anime.studios?.length > 0 && (
                  <span className="detail-meta-item">
                    <span className="meta-label">Studio</span>
                    <span className="meta-value">
                      {anime.studios.map((s) => s.name).join(', ')}
                    </span>
                  </span>
                )}
                {anime.season && anime.year && (
                  <span className="detail-meta-item">
                    <span className="meta-label">Season</span>
                    <span className="meta-value">
                      {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}
                    </span>
                  </span>
                )}
                {anime.source && (
                  <span className="detail-meta-item">
                    <span className="meta-label">Source</span>
                    <span className="meta-value">{anime.source}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
