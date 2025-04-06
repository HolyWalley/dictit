import React, { useState, useEffect } from 'react';
import { DictionaryEntry } from '../types';

interface SynonymSelectionPopupProps {
  isOpen: boolean;
  entry: DictionaryEntry | null;
  onClose: () => void;
  onSave: (russian: string, selectedSynonyms: string[]) => void;
}

const SynonymSelectionPopup: React.FC<SynonymSelectionPopupProps> = ({
  isOpen,
  entry,
  onClose,
  onSave
}) => {
  const [selectedSynonyms, setSelectedSynonyms] = useState<string[]>([]);

  useEffect(() => {
    // When the entry changes, reset the selected synonyms
    if (entry) {
      setSelectedSynonyms([...entry.italian]);
    } else {
      setSelectedSynonyms([]);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleToggleSynonym = (synonym: string) => {
    setSelectedSynonyms(prev => 
      prev.includes(synonym)
        ? prev.filter(s => s !== synonym)
        : [...prev, synonym]
    );
  };

  const handleSave = () => {
    if (entry && selectedSynonyms.length > 0) {
      onSave(entry.russian, selectedSynonyms);
    }
    onClose();
  };

  return (
    <div className="synonym-popup-overlay">
      <div className="synonym-popup">
        <h3>Select Italian translations to save</h3>
        <p className="russian-word">{entry.russian}</p>
        
        <div className="synonym-list">
          {entry.italian.map(synonym => (
            <label key={synonym} className="synonym-item">
              <input
                type="checkbox"
                checked={selectedSynonyms.includes(synonym)}
                onChange={() => handleToggleSynonym(synonym)}
              />
              <span>{synonym}</span>
            </label>
          ))}
        </div>
        
        <div className="synonym-popup-actions">
          <button 
            className="synonym-popup-button primary" 
            onClick={handleSave}
            disabled={selectedSynonyms.length === 0}
          >
            Save Selected
          </button>
          <button 
            className="synonym-popup-button secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SynonymSelectionPopup;
