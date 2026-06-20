import { useState, useEffect, useCallback } from 'react';
import { syncItemToSupabase } from '../lib/supabaseSync';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get initial value from localStorage or fallback to initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispatch a custom event so other instances of this hook in other components can sync
          window.dispatchEvent(new Event(`local-storage-${key}`));

          // BACKGROUND SYNC TO SUPABASE (SEAMLESS!)
          syncItemToSupabase(key, valueToStore);
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Listen for custom local-storage event
    window.addEventListener(`local-storage-${key}`, handleStorageChange);
    // Listen for standard storage event (for cross-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === key) {
        handleStorageChange();
      }
    });

    return () => {
      window.removeEventListener(`local-storage-${key}`, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}
