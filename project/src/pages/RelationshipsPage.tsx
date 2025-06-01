import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import RelationshipForm from '../components/people/RelationshipForm';
import { getRelationshipLabel } from '../utils/relationshipUtils';

const RelationshipsPage: React.FC = () => {
  const { state, addRelationship } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Group relationships by person
  const relationshipsByPerson = new Map<string, typeof state.relationships>();
  
  state.relationships.forEach(relationship => {
    const personId = relationship.person1Id;
    if (!relationshipsByPerson.has(personId)) {
      relationshipsByPerson.set(personId, []);
    }
    relationshipsByPerson.get(personId)?.push(relationship);
  });
  
  const handleAddRelationship = (relationship1, relationship2) => {
    addRelationship(relationship1);
    addRelationship(relationship2);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <section className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Family Relationships
            </h1>
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center self-start"
            >
              <Plus size={18} className="mr-1" />
              Add Relationship
            </button>
          </div>
        </div>
      </section>
      
      {/* Relationships Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {relationshipsByPerson.size === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No relationships added yet</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center mx-auto"
            >
              <Plus size={18} className="mr-1" />
              Add Your First Relationship
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Array.from(relationshipsByPerson.entries()).map(([personId, relationships]) => {
              const person = state.people.find(p => p.id === personId);
              if (!person) return null;
              
              return (
                <div key={personId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <Link to={`/people/${personId}`} className="flex items-center hover:text-blue-600">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {person.name}'s Relationships
                      </h2>
                    </Link>
                  </div>
                  
                  <div className="p-4">
                    <ul className="divide-y divide-gray-200">
                      {relationships.map(relationship => {
                        const relatedPerson = state.people.find(p => p.id === relationship.person2Id);
                        if (!relatedPerson) return null;
                        
                        return (
                          <li key={relationship.id} className="py-3 first:pt-0 last:pb-0">
                            <Link 
                              to={`/people/${relatedPerson.id}`}
                              className="flex items-center hover:bg-gray-50 p-2 rounded-md -mx-2 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
                                {relatedPerson.profileImage ? (
                                  <img 
                                    src={relatedPerson.profileImage} 
                                    alt={relatedPerson.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Users size={16} className="text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{relatedPerson.name}</div>
                                <div className="text-sm text-gray-600">
                                  {getRelationshipLabel(relationship.relationshipType, relatedPerson.name)}
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Add Relationship Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <RelationshipForm
            people={state.people}
            relationships={state.relationships}
            onSubmit={handleAddRelationship}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default RelationshipsPage;