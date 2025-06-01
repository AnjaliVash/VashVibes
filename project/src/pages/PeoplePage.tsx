import React, { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PersonCard from '../components/people/PersonCard';
import PersonForm from '../components/people/PersonForm';
import { Person } from '../types';

const PeoplePage: React.FC = () => {
  const { state, addPerson } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPeople = state.people.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPerson = (person: Person) => {
    addPerson(person);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <section className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              People
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search people..."
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center"
              >
                <Plus size={18} className="mr-1" />
                Add Person
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* People Grid */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <p className="text-gray-500">No people found matching "{searchQuery}"</p>
            ) : (
              <>
                <p className="text-gray-500 mb-4">No people added yet</p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center mx-auto"
                >
                  <Plus size={18} className="mr-1" />
                  Add Your First Person
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPeople.map(person => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
      
      {/* Add Person Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <PersonForm
            onSubmit={handleAddPerson}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PeoplePage;