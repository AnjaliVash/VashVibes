import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, User, Calendar, MapPin, Tag, Edit, Trash } from 'lucide-react';
import { Photo, Person } from '../../types';
import { formatDate } from '../../utils/storageUtils';
import { useAppContext } from '../../context/AppContext';

interface PhotoViewerProps {
  photo: Photo;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ 
  photo, 
  onClose, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false 
}) => {
  const { state, deletePhoto } = useAppContext();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get people in the photo
  const taggedPeople = photo.tags
    .map(tag => state.people.find(person => person.id === tag.personId))
    .filter(Boolean) as Person[];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) onPrevious();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  const handleDelete = () => {
    if (isDeleting) {
      deletePhoto(photo.id);
      onClose();
    } else {
      setIsDeleting(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col md:justify-center items-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center text-white mb-4">
        <h2 className="text-xl font-semibold truncate">{photo.description || 'Family Photo'}</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Close viewer"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Main content */}
      <div className="relative w-full max-w-6xl flex-grow flex justify-center items-center">
        {/* Previous button */}
        {hasPrevious && (
          <button 
            onClick={onPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>
        )}
        
        {/* Image */}
        <div className="h-full max-h-[80vh] flex items-center justify-center">
          <img 
            src={photo.url} 
            alt={photo.description || 'Family photo'} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        {/* Next button */}
        {hasNext && (
          <button 
            onClick={onNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
      
      {/* Footer with details */}
      <div className="w-full max-w-6xl mt-4 bg-gray-900 rounded-lg p-4 text-white">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-grow">
            {/* Photo details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {photo.event && (
                  <div className="flex items-center mb-2">
                    <Tag size={18} className="mr-2 text-blue-400" />
                    <span>{photo.event}</span>
                  </div>
                )}
                
                {photo.date && (
                  <div className="flex items-center mb-2">
                    <Calendar size={18} className="mr-2 text-blue-400" />
                    <span>{formatDate(photo.date)}</span>
                  </div>
                )}
                
                {photo.location && (
                  <div className="flex items-center mb-2">
                    <MapPin size={18} className="mr-2 text-blue-400" />
                    <span>{photo.location}</span>
                  </div>
                )}
              </div>
              
              <div>
                {taggedPeople.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center mb-2">
                      <User size={18} className="mr-2 text-blue-400" />
                      <span>People in this photo:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-7">
                      {taggedPeople.map(person => (
                        <span 
                          key={person.id} 
                          className="bg-blue-600 text-white text-sm rounded-full px-3 py-1"
                        >
                          {person.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex mt-4 md:mt-0 md:ml-4 space-x-2">
            <button 
              className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              onClick={handleDelete}
            >
              <Trash size={18} className="mr-1" />
              {isDeleting ? "Confirm Delete?" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;