import { DictionaryEntry } from '../types';

export async function loadDictionary(): Promise<DictionaryEntry[]> {
  try {
    const response = await fetch('/russian_italian_dictionary.csv');
    const text = await response.text();
    
    return parseCsv(text);
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
