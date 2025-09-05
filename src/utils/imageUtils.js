/**
 * Utility functions for handling image URLs and avatars
 */

/**
 * Get the full image URL from a relative path or filename
 * @param {string} imagePath - The image path or filename
 * @returns {string} The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /, remove the leading slash
  if (imagePath.startsWith('/')) {
    imagePath = imagePath.substring(1);
  }
  
  // Check if the path already contains 'uploads' to prevent duplication
  if (imagePath.includes('uploads/')) {
    // If it already has uploads, just prepend the base URL
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${imagePath}`;
  }
  
  // Construct the full URL using the uploads directory
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/uploads/${imagePath}`;
};

/**
 * Get the default avatar URL when no profile picture is available
 * @returns {string} The default avatar URL
 */
export const getDefaultAvatarUrl = () => {
  // Return a default avatar image or use a placeholder service
  return '/Logo/logo.png'; // Using the logo as default avatar
};

/**
 * Check if an image URL is valid
 * @param {string} url - The image URL to validate
 * @returns {boolean} True if the URL is valid
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Get a fallback image URL if the primary image fails to load
 * @param {string} primaryUrl - The primary image URL
 * @param {string} fallbackUrl - The fallback image URL
 * @returns {string} The fallback URL
 */
export const getFallbackImageUrl = (primaryUrl, fallbackUrl = null) => {
  if (primaryUrl && isValidImageUrl(primaryUrl)) {
    return primaryUrl;
  }
  
  return fallbackUrl || getDefaultAvatarUrl();
};

/**
 * Create an image with fallback handling
 * @param {string} src - The image source URL
 * @param {string} alt - Alt text for the image
 * @param {Object} props - Additional props for the img element
 * @returns {Object} Image element with error handling
 */
export const createImageWithFallback = (src, alt, props = {}) => {
  const defaultProps = {
    src: src || getDefaultAvatarUrl(),
    alt: alt || 'Profile Picture',
    onError: (e) => {
      console.warn(`Image failed to load: ${e.target.src}, using fallback`);
      e.target.src = getDefaultAvatarUrl();
      e.target.onerror = null; // Prevent infinite loop
    },
    ...props
  };
  
  return defaultProps;
};
