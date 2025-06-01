import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, Search, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { searchPhotos } from '../utils/searchUtils';
import PhotoCard from '../components/gallery/PhotoCard';
import PhotoViewer from '../components/gallery/PhotoViewer';
import { Photo } from '../types';

const SearchResultsPage: React.FC = () => {
  const { state } = useAppContext();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);
  
  useEffect(() => {
    if (query) {
      const results = searchPhotos(
        query,
        state.people,
        state.relationships,
        state.photos
      );
      setSearchResults(results.photos);
    } else {
      setSearchResults([]);
    }
  }, [query, state.people, state.relationships, state.photos]);
  
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(searchResults.findIndex(p => p.id === photo.id));
  };
  
  const handleNextPhoto = () => {
    if (selectedPhotoIndex < searchResults.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
      setSelectedPhoto(searchResults[selectedPhotoIndex + 1]);
    }
  };
  
  const handlePreviousPhoto = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
      setSelectedPhoto(searchResults[selectedPhotoIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <section className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center mb-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-800 mr-2"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Search Results
            </h1>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
            <Search size={20} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">
                Search query: <span className="font-semibold">"{query}"</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Results */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {searchResults.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Info size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No results found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find any photos matching your search. Try using different keywords or check if the names are spelled correctly.
            </p>
            <p className="text-gray-600 mb-4">
              Try searching for people by name or relationship (e.g., "Anjali's father"), events, or locations.
            </p>
            <Link 
              to="/"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Photos matching your search
              </h2>
              <p className="text-gray-600">
                Click on any photo to view details and people tagged in it.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map(photo => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  people={state.people}
                  onClick={() => handlePhotoClick(photo)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onNext={handleNextPhoto}
          onPrevious={handlePreviousPhoto}
          hasNext={selectedPhotoIndex < searchResults.length - 1}
          hasPrevious={selectedPhotoIndex > 0}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;