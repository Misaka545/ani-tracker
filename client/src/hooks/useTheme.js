import { useState, useEffect, useCallback } from 'react';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'system';
  });

  const resolved = mode === 'system' ? getSystemTheme() : mode;

  useEffect(() => {
    const root = document.documentElement;

    if (mode === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', mode);
    }

    localStorage.setItem('theme', mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setMode('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => {
      if (prev === 'system') {
        return getSystemTheme() === 'dark' ? 'light' : 'dark';
      }
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const setTheme = useCallback((t) => {
    setMode(t);
  }, []);

  return { mode, resolved, toggle, setTheme };
}
