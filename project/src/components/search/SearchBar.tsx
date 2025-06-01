import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onClose) {
        onClose();
      }
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find photos of Anjali's Bade papa and Bade mummy together..."
          className="w-full py-2 pl-10 pr-12 rounded-full bg-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          autoFocus
        />
        <Search className="absolute left-3 text-blue-300" size={18} />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-14 text-blue-300 hover:text-white"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-1"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      </div>
      
      <div className="mt-2 text-xs text-blue-300">
        <p>Try: "Photos of Anjali with Raj" or "Bade Papa at birthday party"</p>
      </div>
    </form>
  );
};

export default SearchBar;