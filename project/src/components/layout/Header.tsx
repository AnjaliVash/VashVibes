import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Camera, Users, Home } from 'lucide-react';
import SearchBar from '../search/SearchBar';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Camera size={28} className="text-white" />
            <span className="text-xl font-bold">Family Faces</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 hover:text-blue-200 transition-colors ${isActive('/') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/gallery" 
              className={`flex items-center space-x-1 hover:text-blue-200 transition-colors ${isActive('/gallery') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
            >
              <Camera size={18} />
              <span>Gallery</span>
            </Link>
            <Link 
              to="/people" 
              className={`flex items-center space-x-1 hover:text-blue-200 transition-colors ${isActive('/people') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
            >
              <User size={18} />
              <span>People</span>
            </Link>
            <Link 
              to="/relationships" 
              className={`flex items-center space-x-1 hover:text-blue-200 transition-colors ${isActive('/relationships') ? 'font-semibold border-b-2 border-white pb-1' : ''}`}
            >
              <Users size={18} />
              <span>Relationships</span>
            </Link>
          </nav>

          {/* Search Icon */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-blue-700 transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-60 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <nav className="flex flex-col space-y-4 px-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition-colors"
              onClick={closeMenu}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/gallery" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition-colors"
              onClick={closeMenu}
            >
              <Camera size={18} />
              <span>Gallery</span>
            </Link>
            <Link 
              to="/people" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition-colors"
              onClick={closeMenu}
            >
              <User size={18} />
              <span>People</span>
            </Link>
            <Link 
              to="/relationships" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition-colors"
              onClick={closeMenu}
            >
              <Users size={18} />
              <span>Relationships</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Search Bar Overlay */}
      <div 
        className={`absolute left-0 right-0 bg-blue-700 shadow-md transition-all duration-300 ease-in-out z-10 ${
          isSearchOpen ? 'top-16 opacity-100' : '-top-20 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Header;