import { Person, Relationship, RelationshipType } from '../types';

// Find relationship between two people
export const findRelationship = (
  person1Id: string,
  person2Id: string,
  relationships: Relationship[]
): Relationship | undefined => {
  return relationships.find(
    rel => rel.person1Id === person1Id && rel.person2Id === person2Id
  );
};

// Get all relationships for a person
export const getRelationshipsForPerson = (
  personId: string,
  relationships: Relationship[]
): Relationship[] => {
  return relationships.filter(
    rel => rel.person1Id === personId || rel.person2Id === personId
  );
};

// Get all people related to a person with specific relationship type
export const getRelatedPeople = (
  personId: string,
  relationshipType: RelationshipType,
  relationships: Relationship[],
  people: Person[]
): Person[] => {
  const relatedPeopleIds = relationships
    .filter(
      rel => 
        (rel.person1Id === personId && rel.relationshipType === relationshipType) ||
        (rel.person2Id === personId && getOppositeRelationship(rel.relationshipType) === relationshipType)
    )
    .map(rel => rel.person1Id === personId ? rel.person2Id : rel.person1Id);

  return people.filter(person => relatedPeopleIds.includes(person.id));
};

// Get the opposite relationship type
export const getOppositeRelationship = (
  relationshipType: RelationshipType
): RelationshipType => {
  switch (relationshipType) {
    case 'parent':
      return 'child';
    case 'child':
      return 'parent';
    case 'grandparent':
      return 'grandchild';
    case 'grandchild':
      return 'grandparent';
    case 'uncle/aunt':
      return 'nephew/niece';
    case 'nephew/niece':
      return 'uncle/aunt';
    case 'sibling':
    case 'spouse':
    case 'cousin':
    case 'in-law':
    case 'other':
      return relationshipType;
  }
};

// Generate readable relationship label
export const getRelationshipLabel = (
  relationshipType: RelationshipType,
  personName: string
): string => {
  switch (relationshipType) {
    case 'parent':
      return `Parent of ${personName}`;
    case 'child':
      return `Child of ${personName}`;
    case 'sibling':
      return `Sibling of ${personName}`;
    case 'spouse':
      return `Spouse of ${personName}`;
    case 'grandparent':
      return `Grandparent of ${personName}`;
    case 'grandchild':
      return `Grandchild of ${personName}`;
    case 'uncle/aunt':
      return `Uncle/Aunt of ${personName}`;
    case 'nephew/niece':
      return `Nephew/Niece of ${personName}`;
    case 'cousin':
      return `Cousin of ${personName}`;
    case 'in-law':
      return `In-law of ${personName}`;
    case 'other':
      return `Related to ${personName}`;
  }
};