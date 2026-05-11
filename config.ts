
// Azores4you - Global Configuration
export const OFFICIAL_DOMAIN = 'azorestoyou.pt';
export const RENDER_BACKEND = 'https://azorestoyou-1.onrender.com';
export const LOCAL_BACKEND = 'http://localhost:3001';

export const isLocal = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
};

export const API_BASE_URL = isLocal() ? LOCAL_BACKEND : ''; 
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
  
  // Clean URL
  const cleanUrl = url.trim();

  // If it's already an embed URL or has output=embed, keep it but ensure output=embed
  if (cleanUrl.includes('/embed/') || cleanUrl.includes('output=embed')) {
    return cleanUrl.includes('output=embed') ? cleanUrl : `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}output=embed`;
  }
  
  // Google Maps links
  if (cleanUrl.includes('google.com/maps') || cleanUrl.includes('maps.app.goo.gl')) {
    // 1. Try to extract coordinates (@37.77,-25.31)
    const coordMatch = cleanUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&hl=pt&z=16&output=embed`;
    }
    
    // 2. Try to extract place name (/place/NAME)
    const placeMatch = cleanUrl.match(/\/place\/([^\/]+)/);
    if (placeMatch) {
      return `https://maps.google.com/maps?q=${placeMatch[1]}&hl=pt&z=16&output=embed`;
    }

    // 3. Directions link (/dir/A/B)
    if (cleanUrl.includes('google.com/maps/dir/')) {
        const parts = cleanUrl.split('/');
        const dirIndex = parts.indexOf('dir');
        const dest = parts[dirIndex + 2]; // Usually the second point in /dir/PointA/PointB
        if (dest) return `https://maps.google.com/maps?q=${dest}&hl=pt&z=16&output=embed`;
    }

    // 4. Direct search links in maps
    if (cleanUrl.includes('?q=')) {
      try {
        const urlObj = new URL(cleanUrl);
        const q = urlObj.searchParams.get('q');
        if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&hl=pt&z=16&output=embed`;
      } catch (e) {}
    }

    // Fallback: Force output=embed on original link
    return `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}output=embed`;
  }

  // Handle generic Google Search links that might be passed as locations
  if (cleanUrl.includes('google.com/search')) {
      try {
        const urlObj = new URL(cleanUrl);
        const q = urlObj.searchParams.get('q');
        if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&hl=pt&z=16&output=embed`;
      } catch (e) {}
  }
  
  // If it's a plain address or something else, try to use it as a search query
  if (!cleanUrl.startsWith('http')) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(cleanUrl)}&hl=pt&z=16&output=embed`;
  }

  return cleanUrl;
};
