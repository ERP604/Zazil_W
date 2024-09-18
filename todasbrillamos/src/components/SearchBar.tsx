import React from 'react';
import "../styles/searchBar.css";

interface SearchBarProps {
  placeholder: string;
  filters?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, filters }) => {
  return (
    <div className="search-bar">
      <input type="text" placeholder={placeholder} className="search-input" />
      {filters && <div className="filters">{filters}</div>}
    </div>
  );
};

export default SearchBar;
