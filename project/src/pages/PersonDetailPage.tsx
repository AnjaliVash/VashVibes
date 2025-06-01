import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, Camera, Users, Calendar, ChevronLeft, Edit, Trash, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Photo, Person } from '../types';
import { formatDate } from '../utils/storageUtils';
import { getRelationshipsForPerson, getRelationshipLabel } from '../utils/relationshipUtils';
import PhotoCard from '../components/gallery/PhotoCard';
import PhotoViewer from '../components/gallery/PhotoViewer';
import PersonForm from '../components/people/PersonForm';
import RelationshipForm from '../components/people/RelationshipForm';

const PersonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updatePerson, deletePerson, addRelationship } = useAppContext();
  
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddRelationshipOpen, setIsAddRelationshipOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const person = state.people.find(p => p.id === id);
  
  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Person not found</p>
          <Link 
            to="/people" 
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Back to People
          </Link>
        </div>
      </div>
    );
  }
  
  // Get photos with this person
  const personPhotos = state.photos.filter(photo => 
    photo.tags.some(tag => tag.personId === person.id)
  );
  
  // Get relationships
  const personRelationships = getRelationshipsForPerson(person.id, state.relationships);
  
  const handleUpdatePerson = (updatedPerson: Person) => {
    updatePerson(updatedPerson);
    setIsEditFormOpen(false);
  };
  
  const handleDeletePerson = () => {
    if (isConfirmingDelete) {
      deletePerson(person.id);
      navigate('/people');
    } else {
      setIsConfirmingDelete(true);
    }
  };
  
  const handleAddRelationship = (relationship1, relationship2) => {
    addRelationship(relationship1);
    addRelationship(relationship2);
    setIsAddRelationshipOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <section className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center mb-4">
            <Link 
              to="/people" 
              className="text-gray-600 hover:text-gray-800 mr-2"
            >
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              {person.name}
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 lg:w-1/4">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                {person.profileImage ? (
                  <img 
                    src={person.profileImage} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-2/3 lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between mb-4">
                <div>
                  {person.birthdate && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={18} className="mr-2" />
                      <span>{formatDate(person.birthdate)}</span>
                    </div>
                  )}
                  
                  {personPhotos.length > 0 && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <Camera size={18} className="mr-2" />
                      <span>Appears in {personPhotos.length} photos</span>
                    </div>
                  )}
                  
                  {personRelationships.length > 0 && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <Users size={18} className="mr-2" />
                      <span>Has {personRelationships.length} family connections</span>
                    </div>
                  )}
                </div>
                
                <div className="flex mt-4 sm:mt-0 space-x-2">
                  <button 
                    onClick={() => setIsEditFormOpen(true)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button 
                    onClick={handleDeletePerson}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center"
                  >
                    <Trash size={16} className="mr-1" />
                    {isConfirmingDelete ? "Confirm" : "Delete"}
                  </button>
                </div>
              </div>
              
              {person.notes && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
                  <p className="text-gray-700">{person.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Relationships */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Family Relationships
          </h2>
          <button 
            onClick={() => setIsAddRelationshipOpen(true)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Relationship
          </button>
        </div>
        
        {personRelationships.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">No relationships added yet</p>
            <button
              onClick={() => setIsAddRelationshipOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center mx-auto"
            >
              <Plus size={18} className="mr-1" />
              Add First Relationship
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personRelationships.map(relationship => {
              const relatedPerson = state.people.find(p => 
                p.id === (relationship.person1Id === person.id 
                  ? relationship.person2Id 
                  : relationship.person1Id)
              );
              
              if (!relatedPerson) return null;
              
              const relationshipLabel = relationship.person1Id === person.id
                ? getRelationshipLabel(relationship.relationshipType, relatedPerson.name)
                : getRelationshipLabel(relationship.relationshipType, person.name);
              
              return (
                <Link 
                  key={relationship.id}
                  to={`/people/${relatedPerson.id}`}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                    {relatedPerson.profileImage ? (
                      <img 
                        src={relatedPerson.profileImage} 
                        alt={relatedPerson.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{relatedPerson.name}</h3>
                    <p className="text-sm text-gray-600">{relationshipLabel}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      
      {/* Photos */}
      {personPhotos.length > 0 && (
        <section className="container mx-auto px-4 py-8 max-w-6xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Photos with {person.name}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {personPhotos.map(photo => (
              <PhotoCard 
                key={photo.id} 
                photo={photo} 
                people={state.people}
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
      
      {/* Edit Person Modal */}
      {isEditFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <PersonForm
            initialPerson={person}
            onSubmit={handleUpdatePerson}
            onCancel={() => setIsEditFormOpen(false)}
          />
        </div>
      )}
      
      {/* Add Relationship Modal */}
      {isAddRelationshipOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <RelationshipForm
            people={state.people}
            relationships={state.relationships}
            initialPerson={person}
            onSubmit={handleAddRelationship}
            onCancel={() => setIsAddRelationshipOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PersonDetailPage;