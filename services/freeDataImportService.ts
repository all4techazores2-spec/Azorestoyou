// Service to fetch real data from OpenStreetMap and Wikidata APIs with fallbacks and deduplication

export interface ImportItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  island: string;
  municipality: string;
  parish: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  socialLinks?: string;
  coordinates: { lat: number; lng: number };
  description: string;
  tags?: string[];
  source: 'OpenStreetMap' | 'Wikidata';
  sourceId: string;
  status: 'draft';
  isDraft: boolean;
  needsReview: boolean;
  imageUrl?: string;
  isDuplicate?: boolean;
}

// Island coordinates configuration
export const ISLANDS_CONFIG: Record<string, { code: string; lat: number; lon: number; radius: number }> = {
  'São Miguel': { code: 'PDL', lat: 37.7412, lon: -25.6756, radius: 50000 },
  'Terceira': { code: 'TER', lat: 38.6597, lon: -27.2219, radius: 45000 },
  'Faial': { code: 'HOR', lat: 38.5370, lon: -28.6267, radius: 30000 },
  'Pico': { code: 'PIX', lat: 38.5360, lon: -28.5265, radius: 45000 },
  'São Jorge': { code: 'SJZ', lat: 38.6828, lon: -28.2133, radius: 45000 },
  'Graciosa': { code: 'GRW', lat: 39.0865, lon: -28.0062, radius: 25000 },
  'Flores': { code: 'FLW', lat: 39.4585, lon: -31.1303, radius: 30000 },
  'Corvo': { code: 'CVU', lat: 39.6715, lon: -31.1138, radius: 12000 },
  'Santa Maria': { code: 'SMA', lat: 36.9490, lon: -25.1490, radius: 30000 },
};

// Overpass API URL Fallbacks
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter'
];

// Helper to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Haversine distance formula (meters)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// String similarity checker (Levenshtein distance based)
export function getSimilarity(s1: string, s2: string): number {
  const longer = s1.toLowerCase().trim();
  const shorter = s2.toLowerCase().trim();
  if (longer.length === 0) return 0;
  
  const editDistance = (str1: string, str2: string): number => {
    const costs = [];
    for (let i = 0; i <= str1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= str2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[str2.length] = lastValue;
    }
    return costs[str2.length];
  };

  const distance = editDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Check duplicates against existing database items
export function checkDuplicates(newItem: ImportItem, existingItems: any[]): boolean {
  for (const item of existingItems) {
    if (!item) continue;
    
    // 1. Check Source ID
    if (item.sourceId && item.sourceId === newItem.sourceId) {
      return true;
    }

    // 2. Check identical website or phone (if valid)
    if (newItem.website && newItem.website !== 'por confirmar' && item.website === newItem.website) {
      return true;
    }
    if (newItem.phone && newItem.phone !== 'por confirmar' && item.phone === newItem.phone) {
      return true;
    }

    // 3. Coordinate distance < 50 meters AND name similarity > 0.8
    if (newItem.coordinates && item.latitude && item.longitude) {
      const dist = calculateDistance(
        newItem.coordinates.lat,
        newItem.coordinates.lng,
        parseFloat(item.latitude),
        parseFloat(item.longitude)
      );
      const name1 = newItem.name || '';
      const name2 = item.name || item.title || '';
      if (dist < 50 && getSimilarity(name1, name2) > 0.75) {
        return true;
      }
    }
  }
  return false;
}

// Fetch from OpenStreetMap using Overpass API with Fallbacks
export async function searchOpenStreetMapPlaces(params: {
  category: string;
  subcategory: string;
  island: string;
  limit: number;
}): Promise<ImportItem[]> {
  const { category, subcategory, island, limit } = params;
  const config = ISLANDS_CONFIG[island];
  if (!config) return [];

  // LocalStorage Cache Key
  const cacheKey = `ai_import_${category}_${island}_${subcategory || 'all'}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        console.log("OSM Cache Hit:", cacheKey);
        return data.slice(0, limit);
      }
    } catch (_) {
      localStorage.removeItem(cacheKey);
    }
  }

  // Define tags mapping based on selection
  let queryTags = '';
  const cNorm = category.toLowerCase();
  
  // Resolve limit with hard safety limit of 100
  const resolvedLimit = Math.min(typeof limit === 'number' ? limit : 10, 100);
  
  if (cNorm.includes('restaurante')) {
    queryTags = `nwr["amenity"~"restaurant|cafe|bar|fast_food"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('alojamento')) {
    queryTags = `nwr["tourism"~"hotel|guest_house|hostel|apartment|chalet"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('rent-a-car') || cNorm.includes('rentcar')) {
    queryTags = `nwr["amenity"="car_rental"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('oficina') || cNorm.includes('reparação auto')) {
    queryTags = `nwr["shop"~"car_repair"]["craft"~"car_repair"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('animal') || cNorm.includes('pet')) {
    queryTags = `nwr["shop"="pet"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('farmácia')) {
    queryTags = `nwr["amenity"="pharmacy"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('ginásio')) {
    queryTags = `nwr["leisure"="fitness_centre"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('supermercado')) {
    queryTags = `nwr["shop"~"supermarket|convenience"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('beleza') || cNorm.includes('cabeleireiro') || cNorm.includes('barbeiro')) {
    queryTags = `nwr["shop"~"hairdresser|beauty"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('ponto') || cNorm.includes('turístico') || cNorm.includes('poi')) {
    queryTags = `nwr["tourism"~"attraction|museum|viewpoint"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('trilho')) {
    queryTags = `nwr["route"="hiking"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('táxi') || cNorm.includes('taxi')) {
    queryTags = `nwr["amenity"="taxi"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('autocarro') || cNorm.includes('bus')) {
    queryTags = `nwr["highway"="bus_stop"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('evento')) {
    queryTags = `nwr["amenity"~"theatre|cinema|community_centre"](around:${config.radius},${config.lat},${config.lon});`;
  } else if (cNorm.includes('municíp') || cNorm.includes('junta') || cNorm.includes('freguesia')) {
    queryTags = `nwr["amenity"="townhall"](around:${config.radius},${config.lat},${config.lon});`;
  } else {
    // Generic fallback query using basic amenity search
    queryTags = `nwr["amenity"](around:${config.radius},${config.lat},${config.lon});`;
  }

  const overpassQuery = `[out:json][timeout:15]; (${queryTags}); out center;`;

  let lastError: any = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      console.log(`Querying OSM Overpass endpoint: ${endpoint}`);
      const res = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(overpassQuery)}`
      }, 9000);
      
      if (!res.ok) throw new Error(`OSM Server returned ${res.status}`);
      const data = await res.json();
      
      const rawElements = data.elements || [];
      const normalizedItems: ImportItem[] = rawElements.map((el: any) => {
        const tags = el.tags || {};
        const lat = el.lat || (el.center && el.center.lat) || config.lat;
        const lon = el.lon || (el.center && el.center.lon) || config.lon;
        return {
          id: `OSM_${el.id}`,
          name: tags.name || tags.operator || `${category} OSM ${el.id}`,
          category: category,
          subcategory: subcategory || tags.shop || tags.amenity || tags.route || 'Geral',
          island: config.code,
          municipality: tags['addr:city'] || 'por confirmar',
          parish: tags['addr:suburb'] || 'por confirmar',
          address: tags['addr:street'] ? `${tags['addr:street']}${tags['addr:housenumber'] ? ', ' + tags['addr:housenumber'] : ''}` : 'por confirmar',
          phone: tags.phone || tags['contact:phone'] || 'por confirmar',
          email: tags.email || tags['contact:email'] || 'por confirmar',
          website: tags.website || tags['contact:website'] || 'por confirmar',
          coordinates: { lat, lng: lon },
          description: tags.description || `Ponto registado via OpenStreetMap.`,
          source: 'OpenStreetMap',
          sourceId: el.id.toString(),
          status: 'draft',
          isDraft: true,
          needsReview: true,
          imageUrl: getPlaceholderImage(category)
        };
      });

      // Cache all results
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: normalizedItems }));
      return normalizedItems.slice(0, resolvedLimit);
    } catch (err: any) {
      console.warn(`Endpoint failed: ${endpoint}. Error: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error("Todos os servidores Overpass falharam.");
}

// Fetch from Wikidata Tourism
export async function searchWikidataTourism(params: {
  island: string;
  limit: number;
}): Promise<ImportItem[]> {
  const { island, limit } = params;
  const config = ISLANDS_CONFIG[island];
  if (!config) return [];

  // Resolve limit with hard safety limit of 100
  const resolvedLimit = Math.min(typeof limit === 'number' ? limit : 10, 100);

  const cacheKey = `wikidata_import_tourism_${island}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        console.log("Wikidata Cache Hit:", cacheKey);
        return data.slice(0, resolvedLimit);
      }
    } catch (_) {
      localStorage.removeItem(cacheKey);
    }
  }

  const sparqlQuery = `
    SELECT ?place ?placeLabel ?desc ?lat ?lon ?wikipedia ?image WHERE {
      SERVICE wikibase:around {
        ?place wdt:P625 ?location .
        bd:serviceParam bd:address "Point(${config.lon} ${config.lat})"^^geo:wktLiteral .
        bd:serviceParam bd:radius "${config.radius / 1000}" .
      }
      VALUES ?class { wd:Q11446 wd:Q412629 wd:Q4989906 wd:Q233 wd:Q34038 wd:Q33506 wd:Q570116 wd:Q12280 wd:Q184824 }
      ?place wdt:P31 ?class .
      ?place p:P625/ps:P625 ?location .
      BIND(geof:latitude(?location) AS ?lat)
      BIND(geof:longitude(?location) AS ?lon)
      OPTIONAL { ?place schema:description ?desc . FILTER(LANG(?desc) = "pt") }
      OPTIONAL {
        ?wikipedia schema:about ?place ;
                   schema:isPartOf <https://pt.wikipedia.org/> .
      }
      OPTIONAL { ?place wdt:P18 ?image . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en". }
    } LIMIT ${resolvedLimit}
  `;

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  
  try {
    const res = await fetchWithTimeout(url, {
      headers: { 'Accept': 'application/sparql-results+json', 'User-Agent': 'AzoresToYouAIImport/1.0' }
    }, 10000);
    
    if (!res.ok) throw new Error("Wikidata endpoint failed");
    const data = await res.json();
    
    const bindings = data.results?.bindings || [];
    const normalizedItems: ImportItem[] = bindings.map((b: any) => {
      const sourceId = b.place.value.split('/').pop() || Date.now().toString();
      return {
        id: `WKD_${sourceId}`,
        name: b.placeLabel?.value || 'Ponto de Interesse',
        category: 'Pontos Turísticos',
        subcategory: 'Atração',
        island: config.code,
        municipality: 'por confirmar',
        parish: 'por confirmar',
        address: 'por confirmar',
        phone: 'por confirmar',
        email: 'por confirmar',
        website: b.wikipedia?.value || 'por confirmar',
        coordinates: { lat: parseFloat(b.lat.value), lng: parseFloat(b.lon.value) },
        description: b.desc?.value || `Local turístico relevante em ${island} importado da Wikidata.`,
        source: 'Wikidata',
        sourceId: sourceId,
        status: 'draft',
        isDraft: true,
        needsReview: true,
        imageUrl: b.image?.value || 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&auto=format&fit=crop'
      };
    });

    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: normalizedItems }));
    return normalizedItems.slice(0, resolvedLimit);
  } catch (error) {
    console.error("Wikidata import failed:", error);
    throw error;
  }
}

// Get category placeholder images
function getPlaceholderImage(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes('restaurante')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop';
  } else if (cat.includes('alojamento')) {
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop';
  } else if (cat.includes('trilho')) {
    return 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&auto=format&fit=crop';
  } else if (cat.includes('beleza') || cat.includes('cabeleireiro') || cat.includes('barbeiro')) {
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop';
  } else if (cat.includes('animal') || cat.includes('pet')) {
    return 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop';
  } else if (cat.includes('evento')) {
    return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop';
}
