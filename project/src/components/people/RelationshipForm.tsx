import React, { useState, useEffect } from 'react';
import { Person, Relationship, RelationshipType } from '../../types';
import { generateId } from '../../utils/storageUtils';
import { X } from 'lucide-react';
import { getOppositeRelationship } from '../../utils/relationshipUtils';

interface RelationshipFormProps {
  people: Person[];
  relationships: Relationship[];
  initialPerson?: Person;
  onSubmit: (relationship1: Relationship, relationship2: Relationship) => void;
  onCancel: () => void;
}

const RelationshipForm: React.FC<RelationshipFormProps> = ({
  people,
  relationships,
  initialPerson,
  onSubmit,
  onCancel
}) => {
  const [person1Id, setPerson1Id] = useState(initialPerson?.id || '');
  const [person2Id, setPerson2Id] = useState('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('other');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter out people already in relationships with person1, if selected
  const availablePeople = people.filter(person => {
    if (!person1Id || person.id === person1Id) return false;
    
    // Check if this relationship already exists
    const existingRelationship = relationships.some(
      rel => 
        (rel.person1Id === person1Id && rel.person2Id === person.id) ||
        (rel.person1Id === person.id && rel.person2Id === person1Id)
    );
    
    return !existingRelationship;
  });

  const relationshipOptions: { value: RelationshipType; label: string }[] = [
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'uncle/aunt', label: 'Uncle/Aunt' },
    { value: 'nephew/niece', label: 'Nephew/Niece' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'in-law', label: 'In-law' },
    { value: 'other', label: 'Other' }
  ];

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!person1Id) {
      newErrors.person1 = 'First person is required';
    }
    
    if (!person2Id) {
      newErrors.person2 = 'Second person is required';
    }
    
    if (person1Id === person2Id) {
      newErrors.person2 = 'Cannot create a relationship with the same person';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Create two-way relationship
    const relationship1: Relationship = {
      id: generateId(),
      person1Id,
      person2Id,
      relationshipType
    };
    
    const relationship2: Relationship = {
      id: generateId(),
      person1Id: person2Id,
      person2Id: person1Id,
      relationshipType: getOppositeRelationship(relationshipType)
    };
    
    onSubmit(relationship1, relationship2);
  };

  // Set person1 if initialPerson is provided
  useEffect(() => {
    if (initialPerson) {
      setPerson1Id(initialPerson.id);
    }
  }, [initialPerson]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add New Relationship</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="person1" className="block text-sm font-medium text-gray-700 mb-1">
            First Person *
          </label>
          <select
            id="person1"
            value={person1Id}
            onChange={(e) => setPerson1Id(e.target.value)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              errors.person1 ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={!!initialPerson}
          >
            <option value="">Select a person</option>
            {people.map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          {errors.person1 && (
            <p className="mt-1 text-sm text-red-600">{errors.person1}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
            Relationship Type *
          </label>
          <select
            id="relationship"
            value={relationshipType}
            onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            {relationshipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="person2" className="block text-sm font-medium text-gray-700 mb-1">
            Second Person *
          </label>
          <select
            id="person2"
            value={person2Id}
            onChange={(e) => setPerson2Id(e.target.value)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              errors.person2 ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a person</option>
            {availablePeople.map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          {errors.person2 && (
            <p className="mt-1 text-sm text-red-600">{errors.person2}</p>
          )}
          {availablePeople.length === 0 && person1Id && (
            <p className="mt-1 text-sm text-amber-600">
              No available people to create a relationship with. All possible relationships already exist.
            </p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            disabled={availablePeople.length === 0}
          >
            Add Relationship
          </button>
        </div>
      </form>
    </div>
  );
};

export default RelationshipForm;