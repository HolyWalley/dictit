import React from 'react';
import { SavedPair } from '../types';

interface SavedPairsProps {
  savedPairs: SavedPair[];
  onRemovePair: (id: string) => void;
}

const SavedPairs: React.FC<SavedPairsProps> = ({ savedPairs, onRemovePair }) => {
  if (savedPairs.length === 0) {
    return <div className="results-container">No saved pairs yet</div>;
  }

  return (
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
  );
};

export default SavedPairs;
