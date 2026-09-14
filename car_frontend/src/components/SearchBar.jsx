import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-input-wrapper" style={{ width: '100%' }}>
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        placeholder="Search by brand, model, or title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
