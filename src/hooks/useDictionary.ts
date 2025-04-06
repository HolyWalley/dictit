import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { DictionaryEntry, SearchResult } from '../types';
import { loadDictionary } from '../utils/dictionaryLoader';
import { useDebounce } from './useDebounce';

export function useDictionary() {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Initialize dictionary
  useEffect(() => {
    async function initDictionary() {
      const data = await loadDictionary();
      setDictionary(data);
      setIsLoading(false);
    }

    initDictionary();
  }, []);

  // Setup Fuse.js for fuzzy search
  useEffect(() => {
    if (dictionary.length === 0 || debouncedSearchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const fuseOptions = {
      includeScore: true,
      threshold: 0.4,
      keys: [
        'russian',
        'italian'
      ]
    };

    // Create a special searchable array for Fuse.js
    const searchableItems = dictionary.map(entry => ({
      russian: entry.russian,
      italian: entry.italian.join(' '),
      originalEntry: entry
    }));

    const fuse = new Fuse(searchableItems, fuseOptions);
    const searchResults = fuse.search(debouncedSearchTerm);

    // Transform back to our expected format
    const transformedResults = searchResults.map(result => ({
      item: result.item.originalEntry,
      score: result.score || 0
    }));

    setResults(transformedResults);
  }, [dictionary, debouncedSearchTerm]);

  return {
    dictionary,
    searchTerm,
    setSearchTerm,
    results,
    isLoading
  };
}
