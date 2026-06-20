import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isAnimating: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'portoko-theme';

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {}
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [isAnimating, setIsAnimating] = useState(false);
  const animatingRef = useRef(false);

  const toggleTheme = useCallback(() => {
    if (animatingRef.current) return;

    const from = theme;
    const to = theme === 'dark' ? 'light' : 'dark';

    animatingRef.current = true;
    setIsAnimating(true);

    const root = document.documentElement;
    const body = document.body;

    // Create wipe overlay
    const wipe = document.createElement('div');
    wipe.setAttribute('aria-hidden', 'true');
    Object.assign(wipe.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '9999',
      overflow: 'hidden',
      pointerEvents: 'none',
    });

    const THEME_COLORS: Record<Theme, string> = {
      dark: '#060611',
      light: '#FFFFFF',
    };

    const oldPanel = document.createElement('div');
    const newPanel = document.createElement('div');

    Object.assign(oldPanel.style, {
      position: 'absolute',
      inset: '0',
      backgroundColor: THEME_COLORS[from],
      willChange: 'transform',
    });
    Object.assign(newPanel.style, {
      position: 'absolute',
      inset: '0',
      backgroundColor: THEME_COLORS[to],
      willChange: 'transform',
    });

    const toLight = to === 'light';
    const oldEndX = toLight ? -100 : 100;
    const newStartX = toLight ? 100 : -100;

    newPanel.style.transform = `translateX(${newStartX}%)`;

    wipe.append(oldPanel, newPanel);
    body.appendChild(wipe);

    const duration = 920;
    const easing = 'cubic-bezier(0.76, 0, 0.24, 1)';

    const oldAnim = oldPanel.animate(
      [
        { transform: 'translateX(0%)' },
        { transform: `translateX(${oldEndX}%)` },
      ],
      { duration, easing, fill: 'forwards' }
    );

    const newAnim = newPanel.animate(
      [
        { transform: `translateX(${newStartX}%)` },
        { transform: 'translateX(0%)' },
      ],
      { duration, easing, fill: 'forwards' }
    );

    Promise.allSettled([oldAnim.finished, newAnim.finished]).then(() => {
      oldAnim.cancel();
      newAnim.cancel();
      wipe.remove();

      // Apply new theme
      root.classList.remove('dark-theme', 'light-theme');
      root.classList.add(`${to}-theme`);

      try {
        localStorage.setItem(STORAGE_KEY, to);
      } catch {}

      setTheme(to);
      animatingRef.current = false;
      setIsAnimating(false);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isAnimating }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
