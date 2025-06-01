import { v4 as uuidv4 } from 'uuid';

// Convert a file to a base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Generate a unique ID
export const generateId = (): string => {
  return uuidv4();
};

// Format date for display
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Group photos by date
export const groupPhotosByDate = (photos: { date?: string }[]): Record<string, typeof photos> => {
  const grouped: Record<string, typeof photos> = {};
  
  photos.forEach(photo => {
    const date = photo.date ? new Date(photo.date).toISOString().split('T')[0] : 'No Date';
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(photo);
  });
  
  return grouped;
};

// Group photos by event
export const groupPhotosByEvent = (photos: { event?: string }[]): Record<string, typeof photos> => {
  const grouped: Record<string, typeof photos> = {};
  
  photos.forEach(photo => {
    const event = photo.event || 'Uncategorized';
    if (!grouped[event]) {
      grouped[event] = [];
    }
    grouped[event].push(photo);
  });
  
  return grouped;
};