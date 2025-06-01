import { AppState, Person, Photo, Relationship } from "../types";

// Demo data with sample family members and photos
export const initialPeople: Person[] = [
  {
    id: "p1",
    name: "Anjali",
    profileImage: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    birthdate: "1990-05-15",
  },
  {
    id: "p2",
    name: "Raj",
    profileImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    birthdate: "1988-10-20",
  },
  {
    id: "p3",
    name: "Bade Papa",
    profileImage: "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    birthdate: "1960-03-12",
  },
  {
    id: "p4",
    name: "Bade Mummy",
    profileImage: "https://images.pexels.com/photos/3152046/pexels-photo-3152046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    birthdate: "1962-07-28",
  },
  {
    id: "p5",
    name: "Maya",
    profileImage: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    birthdate: "1992-11-30",
  }
];

export const initialRelationships: Relationship[] = [
  {
    id: "r1",
    person1Id: "p1",
    person2Id: "p3",
    relationshipType: "child"
  },
  {
    id: "r2",
    person1Id: "p3",
    person2Id: "p1",
    relationshipType: "parent"
  },
  {
    id: "r3",
    person1Id: "p1",
    person2Id: "p4",
    relationshipType: "child"
  },
  {
    id: "r4",
    person1Id: "p4",
    person2Id: "p1",
    relationshipType: "parent"
  },
  {
    id: "r5",
    person1Id: "p3",
    person2Id: "p4",
    relationshipType: "spouse"
  },
  {
    id: "r6",
    person1Id: "p4",
    person2Id: "p3",
    relationshipType: "spouse"
  },
  {
    id: "r7",
    person1Id: "p1",
    person2Id: "p2",
    relationshipType: "spouse"
  },
  {
    id: "r8",
    person1Id: "p2",
    person2Id: "p1",
    relationshipType: "spouse"
  },
  {
    id: "r9",
    person1Id: "p1",
    person2Id: "p5",
    relationshipType: "sibling"
  },
  {
    id: "r10",
    person1Id: "p5",
    person2Id: "p1",
    relationshipType: "sibling"
  }
];

export const initialPhotos: Photo[] = [
  {
    id: "photo1",
    url: "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    date: "2023-01-15",
    event: "Family Dinner",
    location: "Home",
    description: "Family dinner celebration",
    tags: [
      { id: "t1", personId: "p1", photoId: "photo1" },
      { id: "t2", personId: "p2", photoId: "photo1" }
    ]
  },
  {
    id: "photo2",
    url: "https://images.pexels.com/photos/3767420/pexels-photo-3767420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    date: "2023-02-20",
    event: "Birthday Party",
    location: "Garden",
    description: "Anjali's birthday celebration",
    tags: [
      { id: "t3", personId: "p1", photoId: "photo2" },
      { id: "t4", personId: "p3", photoId: "photo2" },
      { id: "t5", personId: "p4", photoId: "photo2" }
    ]
  },
  {
    id: "photo3",
    url: "https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    date: "2022-12-25",
    event: "Christmas",
    location: "Living Room",
    description: "Christmas family gathering",
    tags: [
      { id: "t6", personId: "p3", photoId: "photo3" },
      { id: "t7", personId: "p4", photoId: "photo3" }
    ]
  },
  {
    id: "photo4",
    url: "https://images.pexels.com/photos/1157940/pexels-photo-1157940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    date: "2023-03-10",
    event: "Picnic",
    location: "Park",
    description: "Family picnic at the park",
    tags: [
      { id: "t8", personId: "p1", photoId: "photo4" },
      { id: "t9", personId: "p5", photoId: "photo4" }
    ]
  },
  {
    id: "photo5",
    url: "https://images.pexels.com/photos/1471235/pexels-photo-1471235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    date: "2023-04-05",
    event: "Vacation",
    location: "Beach",
    description: "Family vacation at the beach",
    tags: [
      { id: "t10", personId: "p1", photoId: "photo5" },
      { id: "t11", personId: "p2", photoId: "photo5" },
      { id: "t12", personId: "p5", photoId: "photo5" }
    ]
  }
];

export const initialAppState: AppState = {
  people: initialPeople,
  relationships: initialRelationships,
  photos: initialPhotos
};