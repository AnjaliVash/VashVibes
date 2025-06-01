export interface Person {
  id: string;
  name: string;
  profileImage?: string;
  birthdate?: string;
  notes?: string;
}

export interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  relationshipType: RelationshipType;
}

export type RelationshipType = 
  | "parent" 
  | "child" 
  | "sibling" 
  | "spouse" 
  | "grandparent" 
  | "grandchild"
  | "uncle/aunt" 
  | "nephew/niece" 
  | "cousin" 
  | "in-law"
  | "other";

export interface Photo {
  id: string;
  url: string;
  date?: string;
  location?: string;
  event?: string;
  description?: string;
  tags: PhotoTag[];
}

export interface PhotoTag {
  id: string;
  personId: string;
  photoId: string;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AppState {
  people: Person[];
  relationships: Relationship[];
  photos: Photo[];
}

export interface SearchResult {
  photos: Photo[];
  query: string;
}