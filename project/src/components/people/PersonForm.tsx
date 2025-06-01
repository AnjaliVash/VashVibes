import React, { useState, useEffect } from 'react';
import { Person } from '../../types';
import { generateId } from '../../utils/storageUtils';
import { X } from 'lucide-react';

interface PersonFormProps {
  initialPerson?: Partial<Person>;
  onSubmit: (person: Person) => void;
  onCancel: () => void;
}

const PersonForm: React.FC<PersonFormProps> = ({ initialPerson, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialPerson?.name || '');
  const [profileImage, setProfileImage] = useState(initialPerson?.profileImage || '');
  const [birthdate, setBirthdate] = useState(initialPerson?.birthdate || '');
  const [notes, setNotes] = useState(initialPerson?.notes || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isUpdate = !!initialPerson?.id;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const person: Person = {
      id: initialPerson?.id || generateId(),
      name: name.trim(),
      profileImage: profileImage.trim() || undefined,
      birthdate: birthdate || undefined,
      notes: notes.trim() || undefined
    };
    
    onSubmit(person);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {isUpdate ? 'Edit Person' : 'Add New Person'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image URL
          </label>
          <input
            id="profileImage"
            type="text"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter image URL"
          />
          {profileImage && (
            <div className="mt-2 flex justify-center">
              <img 
                src={profileImage} 
                alt="Profile preview" 
                className="h-20 w-20 object-cover rounded-full border-2 border-gray-200"
                onError={() => setProfileImage('')}
              />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Add any additional information"
          ></textarea>
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
          >
            {isUpdate ? 'Update' : 'Add'} Person
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;