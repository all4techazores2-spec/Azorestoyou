
// Azores4you - Global Configuration
export const OFFICIAL_DOMAIN = 'azorestoyou.pt';
export const RENDER_BACKEND = 'https://azorestoyou-1.onrender.com';
export const LOCAL_BACKEND = 'http://localhost:3001';

export const isLocal = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
};

export const API_BASE_URL = isLocal() ? LOCAL_BACKEND : RENDER_BACKEND;
export const FRONTEND_URL = `https://${OFFICIAL_DOMAIN}`;

export const BUSINESS_TYPE_TO_ENDPOINT: Record<string, string> = {
  'restaurant': 'restaurants',
  'hotel': 'hotels',
  'al': 'hotels',
  'accommodation': 'hotels',
  'car': 'cars',
  'rentcar': 'cars',
  'beauty': 'beauty',
  'hair': 'beauty',
  'barber': 'beauty',
  'nails': 'beauty',
  'spa': 'beauty',
  'glow': 'beauty',
  'zen': 'beauty',
  'diva': 'beauty',
  'art': 'beauty',
  'shop': 'shops',
  'clothing': 'shops',
  'electronics': 'shops',
  'grocery': 'shops',
  'crafts': 'shops',
  'perfume': 'perfumes',
  'perfumes': 'perfumes',
  'service': 'services',
  'gardening': 'services',
  'architect': 'services',
  'engineer': 'services',
  'hvac': 'services',
  'office': 'offices',
  'cowork': 'offices',
  'it_services': 'it_services',
  'animal': 'animals',
  'animals': 'animals',
  'real_estate': 'real_estate',
  'gym': 'gyms',
  'gyms': 'gyms',
  'stand': 'stands',
  'stands': 'stands',
  'auto_repair': 'auto_repairs',
  'auto_repairs': 'auto_repairs',
  'auto_electronics': 'auto_electronics',
  'used_market': 'used_market'
};

/**
 * Converts a regular Google Maps URL to an embed-friendly URL.
 */
export const getGoogleMapsEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already an embed URL or has output=embed, keep it but ensure output=embed
  if (url.includes('/embed/') || url.includes('output=embed')) {
    return url.includes('output=embed') ? url : `${url}${url.includes('?') ? '&' : '?'}output=embed`;
  }
  
  // Google Maps links
  if (url.includes('google.com/maps') || url.includes('maps.app.goo.gl')) {
    // 1. Try to extract coordinates (@37.77,-25.31)
    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=pt&z=16&output=embed`;
    }
    
    // 2. Try to extract place name (/place/NAME)
    const placeMatch = url.match(/\/place\/([^\/]+)/);
    if (placeMatch) {
      return `https://maps.google.com/maps?q=${placeMatch[1]}&hl=pt&z=16&output=embed`;
    }

    // 3. Direct search links
    if (url.includes('?q=')) {
      try {
        const urlObj = new URL(url);
        const q = urlObj.searchParams.get('q');
        if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&hl=pt&z=16&output=embed`;
      } catch (e) {
        // Fallback if URL is malformed
      }
    }

    // Fallback: Force output=embed on original link
    return `${url}${url.includes('?') ? '&' : '?'}output=embed`;
  }
  
  return url;
};
