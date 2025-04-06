import React from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import { useDictionary } from './hooks/useDictionary';

function App() {
  const { searchTerm, setSearchTerm, results, isLoading } = useDictionary();

  return (
    <div className="container">
      <h1>Russian-Italian Dictionary</h1>
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        isLoading={isLoading} 
      />
      <ResultsList 
        results={results} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export default App;
