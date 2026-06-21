import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass, RefreshCw, AlertCircle } from 'lucide-react';

interface TrailMapProps {
  gpxXml: string;
  name: string;
  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
  distance?: string;
  duration?: string;
  difficulty?: string;
  isTrackingActive?: boolean;
}

interface GpxData {
  coordinates: [number, number][];
  startPoint: [number, number] | null;
  endPoint: [number, number] | null;
  totalPoints: number;
  bounds: [number, number][] | null;
}

// Haversine Formula for distance between points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const parseGpxToCoordinates = (gpxXml: string): GpxData => {
  const coords: [number, number][] = [];
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxXml, "text/xml");
    
    // Check for parse error
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      console.warn("GPX XML parse error detected");
      return { coordinates: [], startPoint: null, endPoint: null, totalPoints: 0, bounds: null };
    }

    const points = xmlDoc.querySelectorAll("trkpt, rtept, wpt");
    points.forEach((pt) => {
      const lat = parseFloat(pt.getAttribute("lat") || "");
      const lon = parseFloat(pt.getAttribute("lon") || "");
      if (!isNaN(lat) && !isNaN(lon)) {
        coords.push([lat, lon]);
      }
    });
  } catch (e) {
    console.error("Error parsing GPX XML:", e);
  }
  
  if (coords.length === 0) {
    return { coordinates: [], startPoint: null, endPoint: null, totalPoints: 0, bounds: null };
  }
  
  return {
    coordinates: coords,
    startPoint: coords[0],
    endPoint: coords[coords.length - 1],
    totalPoints: coords.length,
    bounds: coords
  };
};

// Custom DIV icons to completely bypass bundler relative image path issues
const startIcon = L.divIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-md text-white font-black text-[9px] uppercase tracking-tighter">Início</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const endIcon = L.divIcon({
  html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-md text-white font-black text-[9px] uppercase tracking-tighter">Fim</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const userIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center w-6 h-6">
    <div class="absolute inset-0 rounded-full bg-blue-500 opacity-40 animate-ping"></div>
    <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg"></div>
  </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const TrailMap: React.FC<TrailMapProps> = ({
  gpxXml,
  name,
  startLat,
  startLng,
  endLat,
  endLng,
  distance,
  duration,
  difficulty,
  isTrackingActive = false
}) => {
  const [gpxData, setGpxData] = useState<GpxData | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userDistanceToStart, setUserDistanceToStart] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Parse GPX on mount or change
  useEffect(() => {
    if (gpxXml) {
      const parsed = parseGpxToCoordinates(gpxXml);
      setGpxData(parsed);
    } else {
      setGpxData(null);
    }
  }, [gpxXml]);

  // Handle auto-tracking when isTrackingActive prop becomes true
  useEffect(() => {
    if (isTrackingActive) {
      enableLiveTracking();
    } else {
      disableLiveTracking();
    }
    return () => disableLiveTracking();
  }, [isTrackingActive, gpxData]);

  const centerRoute = () => {
    if (mapInstance && gpxData?.bounds && gpxData.bounds.length > 0) {
      mapInstance.fitBounds(gpxData.bounds as L.LatLngBoundsExpression, { padding: [40, 40] });
    }
  };

  const centerUser = () => {
    if (mapInstance && userLocation) {
      mapInstance.setView(userLocation, 16);
    }
  };

  const disableLiveTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const enableLiveTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("A geolocalização não é suportada por este navegador.");
      return;
    }

    setLocationError(null);
    setIsLocating(true);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const uLoc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(uLoc);
        setIsLocating(false);

        // Center map on user if live tracking is active
        if (mapInstance) {
          mapInstance.setView(uLoc, 16);
        }

        // Calculate distance to start point
        const startPoint = gpxData?.startPoint || (startLat && startLng ? [startLat, startLng] as [number, number] : null);
        if (startPoint) {
          const dist = calculateDistance(uLoc[0], uLoc[1], startPoint[0], startPoint[1]);
          setUserDistanceToStart(dist);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationError("Não foi possível obter a sua localização.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    setWatchId(id);
  };

  const handleRequestLocation = () => {
    if (watchId !== null) {
      // Toggle off if clicked again while active
      disableLiveTracking();
      setUserLocation(null);
      setUserDistanceToStart(null);
      return;
    }
    enableLiveTracking();
  };

  if (!gpxData || gpxData.coordinates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center text-slate-400">
        <AlertCircle size={40} className="mb-2 text-slate-350" />
        <span className="text-sm font-black uppercase tracking-wider">Não foi possível carregar o percurso</span>
        <span className="text-xs font-bold text-slate-400 mt-1">O ficheiro GPX associado ao trilho é inválido ou está vazio.</span>
      </div>
    );
  }

  // Fallback points if GPX lacks tags but parses general coords
  const mapStart: [number, number] = gpxData.startPoint || [startLat || 0, startLng || 0];
  const mapEnd: [number, number] = gpxData.endPoint || [endLat || 0, endLng || 0];

  return (
    <div className="space-y-4">
      {/* Map Canvas Card */}
      <div className="relative rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-md bg-slate-100 h-[320px] sm:h-[380px] lg:h-[420px] w-full z-10">
        <MapContainer
          center={mapStart}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          ref={setMapInstance}
          zoomControl={false} // Disable default zoom to place custom buttons
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Main Route Line */}
          <Polyline
            positions={gpxData.coordinates}
            color="#2563eb"
            weight={4}
            opacity={0.8}
          />

          {/* Start Marker */}
          <Marker position={mapStart} icon={startIcon}>
            <Popup>
              <div className="text-center font-bold text-xs p-1">
                <span className="text-emerald-600 block mb-0.5">Início do Percurso</span>
                <span className="text-slate-700">{name}</span>
              </div>
            </Popup>
          </Marker>

          {/* End Marker */}
          <Marker position={mapEnd} icon={endIcon}>
            <Popup>
              <div className="text-center font-bold text-xs p-1">
                <span className="text-rose-600 block mb-0.5">Fim do Percurso</span>
                <span className="text-slate-700">{name}</span>
              </div>
            </Popup>
          </Marker>

          {/* Live User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="text-center font-bold text-xs p-1 text-blue-600">
                  A sua localização atual
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Map Control Buttons overlay (Premium Styling) */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[400] pointer-events-auto">
          <button
            onClick={centerRoute}
            title="Centrar Percurso"
            className="p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-lg border border-slate-100 active:scale-95 transition-all flex items-center justify-center"
          >
            <Compass size={18} />
          </button>
          
          {userLocation && (
            <button
              onClick={centerUser}
              title="Centrar em Mim"
              className="p-3 bg-white hover:bg-blue-50 text-blue-600 rounded-full shadow-lg border border-slate-100 active:scale-95 transition-all flex items-center justify-center"
            >
              <Navigation size={18} />
            </button>
          )}

          <button
            onClick={handleRequestLocation}
            title={watchId !== null ? "Parar Geolocalização" : "Usar minha localização"}
            className={`p-3 rounded-full shadow-lg border active:scale-95 transition-all flex items-center justify-center ${
              watchId !== null 
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' 
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-100'
            }`}
          >
            {isLocating ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Navigation size={18} className={watchId !== null ? 'fill-current' : ''} />
            )}
          </button>
        </div>
      </div>

      {/* Geolocation Alerts & Distance Status (Premium Look) */}
      {userDistanceToStart !== null && (
        <div className="p-4 bg-blue-50/80 backdrop-blur border border-blue-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Navigation className="w-5 h-5 text-blue-500 animate-pulse shrink-0" />
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Distância ao Trilho</p>
            <p className="text-xs font-bold text-blue-800 mt-0.5">
              Está a <strong className="text-sm font-black">{userDistanceToStart.toFixed(1)} km</strong> do início do trilho.
            </p>
          </div>
        </div>
      )}

      {locationError && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-xs font-bold text-rose-700">{locationError}</p>
        </div>
      )}
    </div>
  );
};

export default TrailMap;
