export interface DictionaryEntry {
  russian: string;
  italian: string[];
}

export interface SearchResult {
  item: DictionaryEntry;
  score: number;
}
