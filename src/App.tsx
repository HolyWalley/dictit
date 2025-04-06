import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import SavedPairs from './components/SavedPairs';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import SynonymSelectionPopup from './components/SynonymSelectionPopup';
import { useDictionary } from './hooks/useDictionary';
import { useSavedPairs } from './hooks/useSavedPairs';
import { DictionaryEntry, SynonymSelectionState } from './types';

function App() {
  const { searchTerm, setSearchTerm, results, isLoading } = useDictionary();
  const { savedPairs, savePair, removePair, exportToAnki } = useSavedPairs();
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [synonymSelection, setSynonymSelection] = useState<SynonymSelectionState>({
    isOpen: false,
    entry: null,
    selectedSynonyms: []
  });

  return (
    <div className="container">
      <PWAInstallPrompt />

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
            onSavePair={(result) => {
              // If there are multiple Italian translations, show the selection popup
              if (result.item.italian.length > 1) {
                setSynonymSelection({
                  isOpen: true,
                  entry: result.item,
                  selectedSynonyms: result.item.italian
                });
              } else {
                // If there's only one translation, save directly
                savePair(result.item);
              }
            }}
          />
        </>
      ) : (
        <SavedPairs
          savedPairs={savedPairs}
          onRemovePair={removePair}
          onExport={exportToAnki}
        />
      )}

      <SynonymSelectionPopup
        isOpen={synonymSelection.isOpen}
        entry={synonymSelection.entry}
        onClose={() => setSynonymSelection(prev => ({ ...prev, isOpen: false }))}
        onSave={(russian, selectedSynonyms) => {
          if (synonymSelection.entry) {
            // Create a modified entry with only the selected synonyms
            const modifiedEntry: DictionaryEntry = {
              russian,
              italian: selectedSynonyms
            };
            savePair(modifiedEntry);
          }
        }}
      />
    </div>
  );
}

export default App;
