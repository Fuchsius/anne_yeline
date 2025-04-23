/**
 * Formats image URLs to ensure they're correctly displayed
 * @param {string} imageUrl - The raw image URL from the API
 * @param {string} fallbackUrl - Optional fallback image if URL is invalid
 * @returns {string} Properly formatted image URL
 */
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path, make sure it starts with a slash
  if (!imageUrl.startsWith('/')) {
    imageUrl = '/' + imageUrl;
  }
  
  // Prepend the backend URL
  return `${import.meta.env.VITE_API_URL.split('/api')[0]}${imageUrl}`;
};

/**
 * Debug helper to check image loading issues
 * @param {string} url - The image URL to debug
 */
export const debugImageUrl = (url) => {
  console.log('Image URL being processed:', url);
  
  // Check if the URL is accessible with a fetch
  fetch(url, { method: 'HEAD' })
    .then(response => {
      console.log(`Image URL ${url} status: ${response.status}`);
    })
    .catch(error => {
      console.error(`Failed to access image URL ${url}:`, error);
    });
    
  return url;  // Return the original URL
};

// Simple function to get a data URL for a placeholder
export const getPlaceholderImage = (text = 'No Image') => {
  const svg = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"></rect>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial" 
        font-size="12px" 
        fill="#9ca3af" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}; 