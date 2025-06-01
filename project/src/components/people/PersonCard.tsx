import React from 'react';
import { Person } from '../../types';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/storageUtils';

interface PersonCardProps {
  person: Person;
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <Link 
      to={`/people/${person.id}`}
      className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg bg-white transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-52 bg-gray-200">
        {person.profileImage ? (
          <img 
            src={person.profileImage} 
            alt={person.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <User size={64} className="text-blue-400" />
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{person.name}</h3>
        
        {person.birthdate && (
          <p className="text-sm text-gray-600 mb-2">
            Born: {formatDate(person.birthdate)}
          </p>
        )}
        
        {person.notes && (
          <p className="text-sm text-gray-600 line-clamp-2">{person.notes}</p>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <span className="text-sm text-blue-600 font-medium">View Profile</span>
      </div>
    </Link>
  );
};

export default PersonCard;