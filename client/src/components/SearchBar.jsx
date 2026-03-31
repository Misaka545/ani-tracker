import { useState, useRef, useEffect, useCallback } from 'react';
import { searchAnime } from '../api/jikan';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await searchAnime(q, 1, { limit: 6 });
      const items = (res.data || []).map((a) => ({
        mal_id: a.mal_id,
        title: a.title,
        title_english: a.title_english,
        image: a.images?.jpg?.small_image_url || a.images?.jpg?.image_url,
        type: a.type,
        year: a.year,
        score: a.score,
      }));
      setSuggestions(items);
      setShowSuggestions(items.length > 0);
      setSelectedIndex(-1);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val.trim());
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    onSearch(suggestion.title);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search anime..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            id="search-input"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Panel */}
      {showSuggestions && (
        <div className="suggestions-panel">
          {suggestions.map((s, i) => (
            <button
              key={s.mal_id}
              className={`suggestion-item ${i === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(s)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <img
                className="suggestion-image"
                src={s.image}
                alt=""
                loading="lazy"
              />
              <div className="suggestion-info">
                <span className="suggestion-title">{s.title}</span>
                <span className="suggestion-meta">
                  {[s.type, s.year, s.score && `★ ${s.score}`].filter(Boolean).join(' · ')}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
