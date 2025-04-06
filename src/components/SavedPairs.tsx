import React from 'react';
import { SavedPair } from '../types';

interface SavedPairsProps {
  savedPairs: SavedPair[];
  onRemovePair: (id: string) => void;
  onExport?: () => void;
}

const SavedPairs: React.FC<SavedPairsProps> = ({ savedPairs, onRemovePair, onExport }) => {
  if (savedPairs.length === 0) {
    return <div className="results-container">No saved pairs yet</div>;
  }

  return (
    <>
      <div className="export-container">
        <button 
          className="export-button"
          onClick={onExport}
          disabled={savedPairs.length === 0}
          title="Export to Anki CSV and clear saved pairs"
        >
          Export to Anki CSV
        </button>
      </div>
      <div className="results-container">
        {savedPairs.map((pair) => (
          <div key={pair.id} className="result-item">
            <div className="result-content">
              <div className="russian">{pair.russian}</div>
              <div className="italian">{pair.italian.join(', ')}</div>
            </div>
            <button 
              className="remove-button" 
              onClick={() => onRemovePair(pair.id)}
              title="Remove this pair"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default SavedPairs;
