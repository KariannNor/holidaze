// src/components/common/SearchBar.jsx

import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for venues by name or location..."
          className="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors shadow-lg"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;