import React, { useState } from 'react';
import { Photo, PhotoTag, Person } from '../../types';
import { generateId, fileToBase64 } from '../../utils/storageUtils';
import { X, Upload, Camera, Tag, MapPin, Calendar, Info } from 'lucide-react';

interface PhotoUploadFormProps {
  people: Person[];
  onSubmit: (photo: Photo) => void;
  onCancel: () => void;
}

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({ people, onSubmit, onCancel }) => {
  const [url, setUrl] = useState('');
  const [date, setDate] = useState('');
  const [event, setEvent] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!url) {
      newErrors.url = 'Image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const tags: PhotoTag[] = selectedPeople.map(personId => ({
      id: generateId(),
      personId,
      photoId: '' // Will be set when photo is created
    }));
    
    const photo: Photo = {
      id: generateId(),
      url: url.trim(),
      date: date || undefined,
      event: event.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      tags: tags.map(tag => ({ ...tag, photoId: '' })) // Temporary ID
    };
    
    // Update photoId in tags
    photo.tags = photo.tags.map(tag => ({
      ...tag,
      photoId: photo.id
    }));
    
    onSubmit(photo);
  };

  const togglePersonSelection = (personId: string) => {
    if (selectedPeople.includes(personId)) {
      setSelectedPeople(selectedPeople.filter(id => id !== personId));
    } else {
      setSelectedPeople([...selectedPeople, personId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add New Photo</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL *
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              errors.url ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter image URL"
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url}</p>
          )}
          
          {url && (
            <div className="mt-2 flex justify-center">
              <img 
                src={url} 
                alt="Photo preview" 
                className="max-h-40 max-w-full object-contain rounded border-2 border-gray-200"
                onError={() => setErrors({ ...errors, url: 'Invalid image URL' })}
              />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Calendar size={16} className="mr-1 text-blue-500" />
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        
        <div>
          <label htmlFor="event" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Tag size={16} className="mr-1 text-blue-500" />
            Event
          </label>
          <input
            id="event"
            type="text"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="E.g., Birthday, Wedding, Vacation"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="mr-1 text-blue-500" />
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="E.g., Home, Park, Beach"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Info size={16} className="mr-1 text-blue-500" />
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Brief description of the photo"
          />
        </div>
        
        <div className="md:col-span-2 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            People in this photo
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {people.map(person => (
              <div 
                key={person.id}
                onClick={() => togglePersonSelection(person.id)}
                className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors ${
                  selectedPeople.includes(person.id) 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'hover:bg-gray-100 border-gray-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0">
                  {person.profileImage ? (
                    <img 
                      src={person.profileImage} 
                      alt={person.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <span className="text-sm truncate">{person.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Upload size={16} className="mr-1" />
            Add Photo
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhotoUploadForm;