import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import SavedPairs from './components/SavedPairs';
import { useDictionary } from './hooks/useDictionary';
import { useSavedPairs } from './hooks/useSavedPairs';

function App() {
  const { searchTerm, setSearchTerm, results, isLoading } = useDictionary();
  const { savedPairs, savePair, removePair, exportToAnki } = useSavedPairs();
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');

  return (
    <div className="container">
      <h1>Russian-Italian Dictionary</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button 
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Pairs ({savedPairs.length})
        </button>
      </div>

      {activeTab === 'search' ? (
        <>
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            isLoading={isLoading} 
          />
          <ResultsList 
            results={results} 
            isLoading={isLoading}
            onSavePair={(result) => savePair(result.item)}
          />
        </>
      ) : (
        <SavedPairs 
          savedPairs={savedPairs}
          onRemovePair={removePair}
          onExport={exportToAnki}
        />
      )}
    </div>
  );
}

export default App;
