import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ listCount, theme, onToggleTheme }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/seasonal', label: 'Seasonal' },
    { path: '/mylist', label: 'My List' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          AniTracker
        </Link>

        <div className="navbar-right">
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
                id={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
                {link.path === '/mylist' && listCount > 0 && (
                  <span className="count-badge">{listCount}</span>
                )}
              </Link>
            ))}
          </div>

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={theme.resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme.resolved === 'dark' ? 'Light' : 'Dark'}
          </button>

          <button
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="nav-toggle"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
