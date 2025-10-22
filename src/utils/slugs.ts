/**
 * Convert a string to a URL-friendly slug
 * @param text The text to convert
 * @returns URL-friendly slug
 */
export const createSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Convert a slug back to a readable name (capitalize words)
 * @param slug The slug to convert
 * @returns Readable name
 */
export const slugToName = (slug: string): string => {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};