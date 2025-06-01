import { Person, Photo, Relationship, SearchResult } from '../types';

// Parse natural language query to identify search parameters
export const parseSearchQuery = (
  query: string,
  people: Person[],
  relationships: Relationship[]
): { personIds: string[], includeWith: boolean } => {
  const queryLower = query.toLowerCase();
  const personIds: string[] = [];
  let includeWith = false;

  // Find if there's a primary person mentioned
  const primaryPerson = people.find(person => 
    queryLower.includes(person.name.toLowerCase())
  );

  if (primaryPerson) {
    personIds.push(primaryPerson.id);
    
    // Check for relationship keywords
    const relationKeywords = [
      "father", "mother", "dad", "mom", "parent",
      "son", "daughter", "child",
      "brother", "sister", "sibling",
      "husband", "wife", "spouse",
      "grandfather", "grandmother", "grandparent", "bade papa", "bade mummy",
      "grandson", "granddaughter", "grandchild",
      "uncle", "aunt", "nephew", "niece", "cousin"
    ];

    // Check if query contains relationship terms
    const relationTerms = relationKeywords.filter(term => 
      queryLower.includes(term.toLowerCase())
    );

    if (relationTerms.length > 0) {
      // Map generic terms to our relationship types
      const relationMap: Record<string, string[]> = {
        'parent': ['father', 'mother', 'dad', 'mom', 'parent'],
        'child': ['son', 'daughter', 'child'],
        'sibling': ['brother', 'sister', 'sibling'],
        'spouse': ['husband', 'wife', 'spouse'],
        'grandparent': ['grandfather', 'grandmother', 'grandparent', 'bade papa', 'bade mummy'],
        'grandchild': ['grandson', 'granddaughter', 'grandchild'],
        'uncle/aunt': ['uncle', 'aunt'],
        'nephew/niece': ['nephew', 'niece'],
        'cousin': ['cousin']
      };

      // Find the relationship type
      let relationType: string | undefined;
      for (const [type, terms] of Object.entries(relationMap)) {
        if (terms.some(term => relationTerms.includes(term))) {
          relationType = type;
          break;
        }
      }

      // Special case for "Bade Papa" and "Bade Mummy" which are specific people
      if (relationTerms.includes('bade papa') || relationTerms.includes('bade mummy')) {
        const specificPerson = people.find(person => 
          queryLower.includes('bade papa') ? person.name.toLowerCase() === 'bade papa' : 
          queryLower.includes('bade mummy') ? person.name.toLowerCase() === 'bade mummy' : 
          false
        );
        
        if (specificPerson) {
          personIds.push(specificPerson.id);
        }
      }
      // For other relationship types
      else if (relationType) {
        // Find related people based on relationship type
        const relatedPeopleIds = relationships
          .filter(rel => 
            (rel.person1Id === primaryPerson.id && rel.relationshipType.includes(relationType!)) ||
            (rel.person2Id === primaryPerson.id && rel.relationshipType.includes(relationType!))
          )
          .map(rel => rel.person1Id === primaryPerson.id ? rel.person2Id : rel.person1Id);
        
        personIds.push(...relatedPeopleIds);
      }
    }
  }

  // Check if we should look for photos with all mentioned people together
  if (queryLower.includes('together') || queryLower.includes('with') || queryLower.includes('and')) {
    includeWith = true;
  }

  return { personIds, includeWith };
};

// Search for photos based on the parsed query
export const searchPhotos = (
  query: string,
  people: Person[],
  relationships: Relationship[],
  photos: Photo[]
): SearchResult => {
  const { personIds, includeWith } = parseSearchQuery(query, people, relationships);
  
  let filteredPhotos: Photo[];
  
  if (includeWith && personIds.length > 1) {
    // Find photos with all the mentioned people
    filteredPhotos = photos.filter(photo => 
      personIds.every(personId => 
        photo.tags.some(tag => tag.personId === personId)
      )
    );
  } else if (personIds.length > 0) {
    // Find photos with any of the mentioned people
    filteredPhotos = photos.filter(photo => 
      photo.tags.some(tag => 
        personIds.includes(tag.personId)
      )
    );
  } else {
    // If no specific people identified, look for keywords in event or description
    const keywords = query.toLowerCase().split(' ')
      .filter(word => word.length > 3);
    
    filteredPhotos = photos.filter(photo => 
      keywords.some(keyword => 
        (photo.event?.toLowerCase().includes(keyword) || 
         photo.description?.toLowerCase().includes(keyword) ||
         photo.location?.toLowerCase().includes(keyword))
      )
    );
  }
  
  return {
    photos: filteredPhotos,
    query
  };
};