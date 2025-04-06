import { DictionaryEntry } from '../types';

export async function loadDictionary(): Promise<DictionaryEntry[]> {
  try {
    // Try to load from cache first
    const cachedData = localStorage.getItem('dictionaryData');
    if (cachedData) {
      console.log('Loading dictionary from cache');
      return JSON.parse(cachedData);
    }

    // If not in cache, fetch from file
    console.log('Fetching dictionary from file');
    const response = await fetch('./russian_italian_dictionary.csv');
    const text = await response.text();
    
    const parsedData = parseCsv(text);
    
    // Cache the parsed data
    localStorage.setItem('dictionaryData', JSON.stringify(parsedData));
    
    return parsedData;
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return [];
  }
}

function parseCsv(csvText: string): DictionaryEntry[] {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
  return lines.map(line => {
    const [russian, italianStr] = line.split(',').map(item => item.trim());
    const italian = italianStr.split(';').map(item => item.trim());
    
    return { russian, italian };
  });
}
