import React, { useState } from 'react';
import { Photo, Person } from '../../types';
import { formatDate } from '../../utils/storageUtils';
import { Info, User, Calendar, MapPin, Tag } from 'lucide-react';

interface PhotoCardProps {
  photo: Photo;
  people: Person[];
  onClick: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, people, onClick }) => {
  const [showInfo, setShowInfo] = useState(false);
  
  const taggedPeople = photo.tags
    .map(tag => people.find(person => person.id === tag.personId))
    .filter(Boolean) as Person[];

  const toggleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  return (
    <div 
      className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="aspect-w-3 aspect-h-2 overflow-hidden bg-gray-200">
        <img 
          src={photo.url} 
          alt={photo.description || 'Family photo'} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      {/* Tag indicators */}
      <div className="absolute top-2 right-2 bg-blue-600 bg-opacity-80 text-white rounded-full px-2 py-1 text-xs flex items-center">
        <User size={12} className="mr-1" />
        <span>{taggedPeople.length}</span>
      </div>
      
      {/* Info toggle button */}
      <button 
        className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1.5 transform transition-transform hover:scale-110"
        onClick={toggleInfo}
        aria-label="Toggle photo information"
      >
        <Info size={16} />
      </button>
      
      {/* Info overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black to-transparent p-3 flex flex-col justify-end transition-opacity duration-300 ${
          showInfo ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {photo.event && (
          <div className="flex items-center text-white text-sm mb-1">
            <Tag size={14} className="mr-1.5 flex-shrink-0" />
            <span className="truncate">{photo.event}</span>
          </div>
        )}
        
        {photo.date && (
          <div className="flex items-center text-white text-sm mb-1">
            <Calendar size={14} className="mr-1.5 flex-shrink-0" />
            <span>{formatDate(photo.date)}</span>
          </div>
        )}
        
        {photo.location && (
          <div className="flex items-center text-white text-sm mb-1">
            <MapPin size={14} className="mr-1.5 flex-shrink-0" />
            <span className="truncate">{photo.location}</span>
          </div>
        )}
        
        {taggedPeople.length > 0 && (
          <div className="mt-2">
            <h4 className="text-white text-xs mb-1">People in this photo:</h4>
            <div className="flex flex-wrap gap-1">
              {taggedPeople.map(person => (
                <span 
                  key={person.id} 
                  className="bg-blue-600 bg-opacity-70 text-white text-xs rounded-full px-2 py-0.5"
                >
                  {person.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;