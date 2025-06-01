import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Tag, Filter, Grid, Grid3X3 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PhotoCard from '../components/gallery/PhotoCard';
import PhotoViewer from '../components/gallery/PhotoViewer';
import PhotoUploadForm from '../components/upload/PhotoUploadForm';
import { Photo } from '../types';
import { formatDate, groupPhotosByDate, groupPhotosByEvent } from '../utils/storageUtils';

const GalleryPage: React.FC = () => {
  const { state, addPhoto } = useAppContext();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<'none' | 'date' | 'event'>('none');
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

  useEffect(() => {
    setFilteredPhotos([...state.photos].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }));
  }, [state.photos]);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(filteredPhotos.findIndex(p => p.id === photo.id));
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
      setSelectedPhoto(filteredPhotos[selectedPhotoIndex + 1]);
    }
  };

  const handlePreviousPhoto = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
      setSelectedPhoto(filteredPhotos[selectedPhotoIndex - 1]);
    }
  };

  const handleAddPhoto = (photo: Photo) => {
    addPhoto(photo);
    setIsUploadFormOpen(false);
  };

  const renderGroupedPhotos = () => {
    if (groupBy === 'none') {
      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
          {filteredPhotos.map(photo => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              people={state.people}
              onClick={() => handlePhotoClick(photo)}
            />
          ))}
        </div>
      );
    }

    if (groupBy === 'date') {
      const grouped = groupPhotosByDate(filteredPhotos);
      return Object.entries(grouped)
        .sort(([dateA], [dateB]) => {
          if (dateA === 'No Date') return 1;
          if (dateB === 'No Date') return -1;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .map(([date, photos]) => (
          <div key={date} className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-blue-600" />
              {date === 'No Date' ? 'No Date' : formatDate(date)}
              <span className="text-sm text-gray-500 ml-2">({photos.length} photos)</span>
            </h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
              {photos.map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo as Photo}
                  people={state.people}
                  onClick={() => handlePhotoClick(photo as Photo)}
                />
              ))}
            </div>
          </div>
        ));
    }

    if (groupBy === 'event') {
      const grouped = groupPhotosByEvent(filteredPhotos);
      return Object.entries(grouped)
        .sort(([eventA], [eventB]) => {
          if (eventA === 'Uncategorized') return 1;
          if (eventB === 'Uncategorized') return -1;
          return eventA.localeCompare(eventB);
        })
        .map(([event, photos]) => (
          <div key={event} className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Tag size={20} className="mr-2 text-blue-600" />
              {event}
              <span className="text-sm text-gray-500 ml-2">({photos.length} photos)</span>
            </h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
              {photos.map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo as Photo}
                  people={state.people}
                  onClick={() => handlePhotoClick(photo as Photo)}
                />
              ))}
            </div>
          </div>
        ));
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <section className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Photo Gallery
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">View:</span>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="Grid view"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('masonry')}
                    className={`p-2 ${viewMode === 'masonry' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="Masonry view"
                  >
                    <Grid3X3 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">Group by:</span>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setGroupBy('none')}
                    className={`px-3 py-1.5 text-sm ${groupBy === 'none' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    None
                  </button>
                  <button
                    onClick={() => setGroupBy('date')}
                    className={`px-3 py-1.5 text-sm ${groupBy === 'date' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Date
                  </button>
                  <button
                    onClick={() => setGroupBy('event')}
                    className={`px-3 py-1.5 text-sm ${groupBy === 'event' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Event
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setIsUploadFormOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
              >
                <Plus size={18} className="mr-1" />
                Add Photo
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="font-semibold text-gray-800">{filteredPhotos.length}</span>
              <span className="ml-1 text-gray-600">photos</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-semibold text-gray-800">
                {new Set(filteredPhotos.flatMap(photo => photo.tags.map(tag => tag.personId))).size}
              </span>
              <span className="ml-1 text-gray-600">people tagged</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-semibold text-gray-800">
                {new Set(filteredPhotos.map(photo => photo.event).filter(Boolean)).size}
              </span>
              <span className="ml-1 text-gray-600">events</span>
            </div>
          </div>
        </div>
        
        {/* Photos */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No photos yet</p>
            <button
              onClick={() => setIsUploadFormOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center mx-auto"
            >
              <Plus size={18} className="mr-1" />
              Add Your First Photo
            </button>
          </div>
        ) : (
          renderGroupedPhotos()
        )}
      </div>
      
      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onNext={handleNextPhoto}
          onPrevious={handlePreviousPhoto}
          hasNext={selectedPhotoIndex < filteredPhotos.length - 1}
          hasPrevious={selectedPhotoIndex > 0}
        />
      )}
      
      {/* Upload Form Modal */}
      {isUploadFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <PhotoUploadForm
            people={state.people}
            onSubmit={handleAddPhoto}
            onCancel={() => setIsUploadFormOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;