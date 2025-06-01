import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Person, Photo, PhotoTag, Relationship } from '../types';
import { initialAppState } from '../data/initialData';

type Action = 
  | { type: 'ADD_PERSON'; payload: Person }
  | { type: 'UPDATE_PERSON'; payload: Person }
  | { type: 'DELETE_PERSON'; payload: string }
  | { type: 'ADD_PHOTO'; payload: Photo }
  | { type: 'UPDATE_PHOTO'; payload: Photo }
  | { type: 'DELETE_PHOTO'; payload: string }
  | { type: 'ADD_RELATIONSHIP'; payload: Relationship }
  | { type: 'UPDATE_RELATIONSHIP'; payload: Relationship }
  | { type: 'DELETE_RELATIONSHIP'; payload: string }
  | { type: 'ADD_TAG'; payload: PhotoTag }
  | { type: 'REMOVE_TAG'; payload: { photoId: string; tagId: string } }
  | { type: 'SET_STATE'; payload: AppState };

interface AppContextType {
  state: AppState;
  addPerson: (person: Person) => void;
  updatePerson: (person: Person) => void;
  deletePerson: (id: string) => void;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => void;
  addRelationship: (relationship: Relationship) => void;
  updateRelationship: (relationship: Relationship) => void;
  deleteRelationship: (id: string) => void;
  addTag: (tag: PhotoTag) => void;
  removeTag: (photoId: string, tagId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_PERSON':
      return {
        ...state,
        people: [...state.people, action.payload]
      };
    case 'UPDATE_PERSON':
      return {
        ...state,
        people: state.people.map(person => 
          person.id === action.payload.id ? action.payload : person
        )
      };
    case 'DELETE_PERSON':
      return {
        ...state,
        people: state.people.filter(person => person.id !== action.payload),
        relationships: state.relationships.filter(
          rel => rel.person1Id !== action.payload && rel.person2Id !== action.payload
        ),
        photos: state.photos.map(photo => ({
          ...photo,
          tags: photo.tags.filter(tag => tag.personId !== action.payload)
        }))
      };
    case 'ADD_PHOTO':
      return {
        ...state,
        photos: [...state.photos, action.payload]
      };
    case 'UPDATE_PHOTO':
      return {
        ...state,
        photos: state.photos.map(photo => 
          photo.id === action.payload.id ? action.payload : photo
        )
      };
    case 'DELETE_PHOTO':
      return {
        ...state,
        photos: state.photos.filter(photo => photo.id !== action.payload)
      };
    case 'ADD_RELATIONSHIP':
      return {
        ...state,
        relationships: [...state.relationships, action.payload]
      };
    case 'UPDATE_RELATIONSHIP':
      return {
        ...state,
        relationships: state.relationships.map(rel => 
          rel.id === action.payload.id ? action.payload : rel
        )
      };
    case 'DELETE_RELATIONSHIP':
      return {
        ...state,
        relationships: state.relationships.filter(rel => rel.id !== action.payload)
      };
    case 'ADD_TAG':
      return {
        ...state,
        photos: state.photos.map(photo => 
          photo.id === action.payload.photoId
            ? { ...photo, tags: [...photo.tags, action.payload] }
            : photo
        )
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        photos: state.photos.map(photo => 
          photo.id === action.payload.photoId
            ? { ...photo, tags: photo.tags.filter(tag => tag.id !== action.payload.tagId) }
            : photo
        )
      };
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('familyFacesAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'SET_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error parsing saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('familyFacesAppState', JSON.stringify(state));
  }, [state]);

  const addPerson = (person: Person) => {
    dispatch({ type: 'ADD_PERSON', payload: person });
  };

  const updatePerson = (person: Person) => {
    dispatch({ type: 'UPDATE_PERSON', payload: person });
  };

  const deletePerson = (id: string) => {
    dispatch({ type: 'DELETE_PERSON', payload: id });
  };

  const addPhoto = (photo: Photo) => {
    dispatch({ type: 'ADD_PHOTO', payload: photo });
  };

  const updatePhoto = (photo: Photo) => {
    dispatch({ type: 'UPDATE_PHOTO', payload: photo });
  };

  const deletePhoto = (id: string) => {
    dispatch({ type: 'DELETE_PHOTO', payload: id });
  };

  const addRelationship = (relationship: Relationship) => {
    dispatch({ type: 'ADD_RELATIONSHIP', payload: relationship });
  };

  const updateRelationship = (relationship: Relationship) => {
    dispatch({ type: 'UPDATE_RELATIONSHIP', payload: relationship });
  };

  const deleteRelationship = (id: string) => {
    dispatch({ type: 'DELETE_RELATIONSHIP', payload: id });
  };

  const addTag = (tag: PhotoTag) => {
    dispatch({ type: 'ADD_TAG', payload: tag });
  };

  const removeTag = (photoId: string, tagId: string) => {
    dispatch({ type: 'REMOVE_TAG', payload: { photoId, tagId } });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addPerson,
        updatePerson,
        deletePerson,
        addPhoto,
        updatePhoto,
        deletePhoto,
        addRelationship,
        updateRelationship,
        deleteRelationship,
        addTag,
        removeTag
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};