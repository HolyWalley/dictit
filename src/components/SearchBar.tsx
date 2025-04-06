import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, isLoading }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={isLoading ? "Loading dictionary..." : "Search Russian or Italian..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );
};

export default SearchBar;
