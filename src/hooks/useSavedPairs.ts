import { useState, useEffect } from 'react';
import { SavedPair, DictionaryEntry } from '../types';

export function useSavedPairs() {
  const [savedPairs, setSavedPairs] = useState<SavedPair[]>([]);

  // Load saved pairs from localStorage on initial render
  useEffect(() => {
    const storedPairs = localStorage.getItem('savedPairs');
    if (storedPairs) {
      setSavedPairs(JSON.parse(storedPairs));
    }
  }, []);

  // Save to localStorage whenever savedPairs changes
  useEffect(() => {
    localStorage.setItem('savedPairs', JSON.stringify(savedPairs));
  }, [savedPairs]);

  const savePair = (entry: DictionaryEntry) => {
    setSavedPairs(prev => {
      // Check if this pair is already saved
      const alreadySaved = prev.some(pair => pair.russian === entry.russian);
      if (alreadySaved) {
        return prev;
      }
      
      // Add new pair
      const newPair: SavedPair = {
        id: Date.now().toString(),
        russian: entry.russian,
        italian: entry.italian,
        savedAt: Date.now()
      };
      return [...prev, newPair];
    });
  };

  const removePair = (id: string) => {
    setSavedPairs(prev => prev.filter(pair => pair.id !== id));
  };

  return {
    savedPairs,
    savePair,
    removePair
  };
}
