import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, User, Users, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SearchBar from '../components/search/SearchBar';
import PhotoCard from '../components/gallery/PhotoCard';

const HomePage: React.FC = () => {
  const { state } = useAppContext();
  
  // Get recent photos
  const recentPhotos = [...state.photos]
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Remember every face in your family
              </h1>
              <p className="text-lg md:text-xl mb-6 opacity-90">
                Store, organize, and search your family photos with natural language queries like "Find photos of Anjali's Bade papa and Bade mummy together."
              </p>
              <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <SearchBar />
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-8 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute top-0 left-0 w-48 h-48 rounded-lg shadow-xl overflow-hidden transform -rotate-6 z-10">
                  <img 
                    src="https://images.pexels.com/photos/3767420/pexels-photo-3767420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Family" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-48 h-48 rounded-lg shadow-xl overflow-hidden transform rotate-6 z-0">
                  <img 
                    src="https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Family" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Cards */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
            Keep your family memories organized
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/gallery" className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="h-40 bg-blue-100 flex items-center justify-center">
                <Camera size={64} className="text-blue-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Photo Gallery</h3>
                <p className="text-gray-600">
                  Browse and organize all your family photos in one place.
                </p>
              </div>
            </Link>
            
            <Link to="/people" className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="h-40 bg-amber-100 flex items-center justify-center">
                <User size={64} className="text-amber-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Family Members</h3>
                <p className="text-gray-600">
                  Manage profiles for everyone in your family tree.
                </p>
              </div>
            </Link>
            
            <Link to="/relationships" className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="h-40 bg-rose-100 flex items-center justify-center">
                <Users size={64} className="text-rose-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Relationships</h3>
                <p className="text-gray-600">
                  Track and visualize how everyone is connected.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Recent Photos */}
      {recentPhotos.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-100">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Recent Photos
              </h2>
              <Link to="/gallery" className="text-blue-600 hover:text-blue-800 font-medium">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPhotos.map(photo => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  people={state.people}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Stats */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                {state.photos.length}
              </p>
              <p className="text-gray-600">Photos</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
                {state.people.length}
              </p>
              <p className="text-gray-600">People</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl md:text-3xl font-bold text-rose-600 mb-2">
                {state.relationships.length / 2}
              </p>
              <p className="text-gray-600">Relationships</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
              <p className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
                {new Set(state.photos.flatMap(photo => photo.tags.map(tag => tag.personId))).size}
              </p>
              <p className="text-gray-600">Tagged Faces</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;