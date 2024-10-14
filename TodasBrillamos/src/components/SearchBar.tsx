import React from 'react';
import "../styles/searchBar.css"; // Importar estilos si es necesario

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value, onChange, filters }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="search-input"
      />
      {filters && <div className="filters-container">{filters}</div>}
    </div>
  );
};

export default SearchBar;
