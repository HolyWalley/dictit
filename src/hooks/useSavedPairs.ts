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
      const existingPairIndex = prev.findIndex(pair => pair.russian === entry.russian);
      
      if (existingPairIndex >= 0) {
        // If it exists, update it with the new selection
        const updatedPairs = [...prev];
        updatedPairs[existingPairIndex] = {
          ...updatedPairs[existingPairIndex],
          italian: entry.italian,
          savedAt: Date.now()
        };
        return updatedPairs;
      } else {
        // Add new pair
        const newPair: SavedPair = {
          id: Date.now().toString(),
          russian: entry.russian,
          italian: entry.italian,
          savedAt: Date.now()
        };
        return [...prev, newPair];
      }
    });
  };

  const removePair = (id: string) => {
    setSavedPairs(prev => prev.filter(pair => pair.id !== id));
  };

  const exportToAnki = () => {
    // Create CSV content for Anki
    // Format: front,back
    const csvContent = savedPairs.map(pair => {
      // Front is Russian, back is Italian words joined with commas
      return `"${pair.russian}","${pair.italian.join(', ')}"`;
    }).join('\n');
    
    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'anki_russian_italian.csv');
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Clear saved pairs
    setSavedPairs([]);
  };

  return {
    savedPairs,
    savePair,
    removePair,
    exportToAnki
  };
}
