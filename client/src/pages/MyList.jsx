import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STATUSES } from '../utils/constants';
import AnimeCard from '../components/AnimeCard';

export default function MyList({ tracker, onAnimeClick, getStatusColor }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredList = tracker.getListByStatus(activeTab);

  const tabs = [
    { key: 'all', label: 'All' },
    ...Object.entries(STATUSES).map(([key, config]) => ({
      key,
      label: config.label,
    })),
  ];

  return (
    <div className="page" id="mylist-page">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">My List</h1>
        </div>

        {/* Filter Tabs */}
        <div className="list-tabs">
          {tabs.map((tab) => {
            const count = tracker.getCount(tab.key);
            return (
              <button
                key={tab.key}
                className={`list-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                id={`tab-${tab.key}`}
              >
                {tab.label}
                {count > 0 && <span className="tab-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {tracker.loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <span className="loading-text">Loading your list...</span>
          </div>
        )}

        {/* List Grid */}
        {!tracker.loading && filteredList.length > 0 && (
          <div className="anime-grid">
            {filteredList.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                onClick={onAnimeClick}
                statusColor={getStatusColor ? getStatusColor(anime.mal_id) : null}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!tracker.loading && filteredList.length === 0 && (
          <div className="empty-state">
            <h3>
              {activeTab === 'all'
                ? 'Your list is empty'
                : `No anime in "${STATUSES[activeTab]?.label || activeTab}"`}
            </h3>
            <p>
              Start exploring and add anime to your list to track your watching progress.
            </p>
            <Link to="/" className="empty-state-btn">
              Explore Anime
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
