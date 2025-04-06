import React from 'react';
import { SearchResult } from '../types';

interface ResultsListProps {
  results: SearchResult[];
  isLoading: boolean;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return <div className="results-container">Loading dictionary...</div>;
  }

  if (results.length === 0) {
    return <div className="results-container">No results found</div>;
  }

  return (
    <div className="results-container">
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <div className="russian">{result.item.russian}</div>
          <div className="italian">{result.item.italian.join(', ')}</div>
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
