import React, { useState } from 'react';
import { Navigation, AlertTriangle, MapPin, Shield, Loader, Clock, ThumbsUp, Bell, Calendar, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteLocation {
  name: string;
  coordinates: [number, number];
  crimeStats: {
    low: number;
    medium: number;
    high: number;
    total: number;
  };
}

// Known dangerous spots (fictional for demonstration)
const dangerSpots = [
  { coordinates: [11.0200, 76.9600], severity: 'high', description: 'Theft hotspot' },
  { coordinates: [11.0350, 76.9800], severity: 'medium', description: 'Street harassment reports' },
  { coordinates: [11.0400, 76.9500], severity: 'high', description: 'Vehicle break-ins' },
  { coordinates: [11.0220, 77.0100], severity: 'medium', description: 'Pickpocketing area' },
  { coordinates: [11.0275, 76.9400], severity: 'low', description: 'Minor incidents reported' },
];

const locationData: { [key: string]: RouteLocation } = {
  'Townhall': {
    name: 'Townhall',
    coordinates: [11.0168, 76.9558],
    crimeStats: {
      low: 15,
      medium: 8,
      high: 5,
      total: 28
    }
  },
  'RS Puram': {
    name: 'RS Puram',
    coordinates: [11.0250, 76.9650],
    crimeStats: {
      low: 12,
      medium: 6,
      high: 3,
      total: 21
    }
  },
  'Gandhipuram': {
    name: 'Gandhipuram',
    coordinates: [11.0300, 76.9700],
    crimeStats: {
      low: 18,
      medium: 10,
      high: 6,
      total: 34
    }
  },
  'Peelamedu': {
    name: 'Peelamedu',
    coordinates: [11.0478, 76.9950],
    crimeStats: {
      low: 14,
      medium: 7,
      high: 4,
      total: 25
    }
  },
  'Saibaba Colony': {
    name: 'Saibaba Colony',
    coordinates: [11.0223, 76.9232],
    crimeStats: {
      low: 10,
      medium: 5,
      high: 2,
      total: 17
    }
  },
  'Selvapuram': {
    name: 'Selvapuram',
    coordinates: [11.0147, 77.0291],
    crimeStats: {
      low: 16,
      medium: 9,
      high: 4,
      total: 29
    }
  }
};

const getStreetRoutes = (start: RouteLocation, end: RouteLocation): [number, number][][] => {
  // Helper function to add random variation to a coordinate
  const addVariation = (coordinate: number, maxVariation: number): number => {
    return coordinate + (Math.random() - 0.5) * maxVariation;
  };

  // Generate points along a street grid pattern with random variations for realism
  const generateRealisticRoute = (
    startPoint: [number, number],
    endPoint: [number, number],
    numSegments: number,
    maxVariation: number,
    isMainRoute: boolean
  ): [number, number][] => {
    const route: [number, number][] = [startPoint];
    
    // Calculate overall direction
    const latDiff = endPoint[0] - startPoint[0];
    const lngDiff = endPoint[1] - startPoint[1];
    
    // Calculate segment sizes
    const latStep = latDiff / numSegments;
    const lngStep = lngDiff / numSegments;
    
    // Generate intermediate points with street grid patterns
    let currentLat = startPoint[0];
    let currentLng = startPoint[1];
    
    // For primary routes, follow more main streets (straighter lines with occasional turns)
    // For alternative routes, take more side streets (more turns)
    const turnPoints = isMainRoute ? [0.3, 0.7] : [0.2, 0.4, 0.6, 0.8];
    
    for (let i = 1; i <= numSegments; i++) {
      // Add street-like patterns (maintain lat or lng for segments to simulate streets)
      if (turnPoints.includes(i / numSegments)) {
        // At turn points, change direction (simulate turning at intersections)
        if (i % 2 === 0) {
          // Move mostly east/west at this segment
          currentLat = addVariation(currentLat + latStep * 0.2, maxVariation);
          currentLng = addVariation(currentLng + lngStep * 0.8, maxVariation);
        } else {
          // Move mostly north/south at this segment
          currentLat = addVariation(currentLat + latStep * 0.8, maxVariation);
          currentLng = addVariation(currentLng + lngStep * 0.2, maxVariation);
        }
      } else {
        // Regular segments follow the grid
        if (Math.abs(latDiff) > Math.abs(lngDiff)) {
          // If route is more north-south oriented
          if (i % 2 === 0) {
            currentLat = addVariation(startPoint[0] + latStep * i, maxVariation);
            currentLng = addVariation(currentLng, maxVariation);
          } else {
            currentLat = addVariation(currentLat, maxVariation);
            currentLng = addVariation(startPoint[1] + lngStep * i, maxVariation);
          }
        } else {
          // If route is more east-west oriented
          if (i % 2 === 0) {
            currentLat = addVariation(currentLat, maxVariation);
            currentLng = addVariation(startPoint[1] + lngStep * i, maxVariation);
          } else {
            currentLat = addVariation(startPoint[0] + latStep * i, maxVariation);
            currentLng = addVariation(currentLng, maxVariation);
          }
        }
      }
      
      route.push([currentLat, currentLng]);
    }
    
    // Ensure the route ends exactly at the destination
    route.push(endPoint);
    
    return route;
  };

  // Calculate distance between locations to determine appropriate complexity
  const calculateDistance = (a: [number, number], b: [number, number]): number => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  };
  
  const distance = calculateDistance(start.coordinates, end.coordinates);
  
  // More segments for longer distances
  const numSegments = Math.max(5, Math.ceil(distance * 1000));
  
  // Primary route - follows main streets, more direct
  const primaryRoute = generateRealisticRoute(
    start.coordinates,
    end.coordinates,
    numSegments,
    0.0002, // Less variation for main routes
    true
  );
  
  // Alternative route - takes more side streets, less direct
  const alternativeRoute = generateRealisticRoute(
    start.coordinates,
    end.coordinates,
    numSegments + 2, // More segments for alternative route
    0.0004, // More variation for alternative routes
    false
  );
  
  return [primaryRoute, alternativeRoute];
};

// Calculate route stats based on proximity to danger spots
const calculateRouteStats = (route: [number, number][]): {
  safetyScore: number; 
  dangerPoints: Array<{point: [number, number], severity: string, description: string}>
} => {
  const dangerPoints: Array<{point: [number, number], severity: string, description: string}> = [];
  let totalRisk = 0;
  
  // Check each point in the route for proximity to danger spots
  route.forEach(point => {
    dangerSpots.forEach(spot => {
      const distance = Math.sqrt(
        Math.pow(point[0] - spot.coordinates[0], 2) + 
        Math.pow(point[1] - spot.coordinates[1], 2)
      );
      
      // If route passes close to a danger spot
      if (distance < 0.003) {
        dangerPoints.push({
          point,
          severity: spot.severity,
          description: spot.description
        });
        
        // Add to risk score based on severity
        if (spot.severity === 'high') totalRisk += 3;
        else if (spot.severity === 'medium') totalRisk += 2;
        else totalRisk += 1;
      }
    });
  });
  
  // Calculate safety score (0-100, higher is safer)
  const safetyScore = Math.max(0, 100 - (totalRisk * 5));
  
  return { safetyScore, dangerPoints };
};

export default function RoutePlanner() {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    start?: RouteLocation;
    destination?: RouteLocation;
    showStats: boolean;
    routes?: [number, number][][];
    routeStats?: {
      primary: { safetyScore: number; dangerPoints: Array<{point: [number, number], severity: string, description: string}> };
      alternative: { safetyScore: number; dangerPoints: Array<{point: [number, number], severity: string, description: string}> };
    };
    estimatedTime?: { primary: number; alternative: number }; // in minutes
  }>({ showStats: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = locationData[startLocation];
    const dest = locationData[destination];
    
    if (start && dest) {
      setIsLoading(true);
      setRouteInfo({ showStats: false });

      // Simulate API call for route calculation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const streetRoutes = getStreetRoutes(start, dest);
      
      // Calculate stats for both routes
      const primaryStats = calculateRouteStats(streetRoutes[0]);
      const alternativeStats = calculateRouteStats(streetRoutes[1]);
      
      // Calculate estimated time (fictional)
      const calculateTime = (route: [number, number][], safetyScore: number): number => {
        // Base time calculation on route length and complexity
        let totalDistance = 0;
        for (let i = 1; i < route.length; i++) {
          totalDistance += Math.sqrt(
            Math.pow(route[i][0] - route[i-1][0], 2) + 
            Math.pow(route[i][1] - route[i-1][1], 2)
          );
        }
        
        // Convert to minutes (these are arbitrary values for demonstration)
        const baseMinutes = totalDistance * 10000;
        
        // Adjust for safety (safer routes are faster)
        return Math.round(baseMinutes * (1 + (100 - safetyScore) / 200));
      };
      
      setRouteInfo({
        start,
        destination: dest,
        showStats: true,
        routes: streetRoutes,
        routeStats: {
          primary: primaryStats,
          alternative: alternativeStats
        },
        estimatedTime: {
          primary: calculateTime(streetRoutes[0], primaryStats.safetyScore),
          alternative: calculateTime(streetRoutes[1], alternativeStats.safetyScore)
        }
      });
      setIsLoading(false);
    }
  };

  const getSafetyLevel = (stats: RouteLocation['crimeStats']) => {
    const riskScore = (stats.high * 3 + stats.medium * 2 + stats.low) / stats.total;
    if (riskScore < 1.5) return 'Low Risk';
    if (riskScore < 2) return 'Medium Risk';
    return 'High Risk';
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'Low Risk': return 'text-green-600';
      case 'Medium Risk': return 'text-yellow-600';
      case 'High Risk': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-400';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Navigation className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Route Planner</h2>
        </div>

        {isLoading && (
          <div className="h-96 mb-6 rounded-lg border bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-gray-600">Calculating safest route...</p>
              <p className="text-sm text-gray-500">Analyzing crime data and street patterns</p>
            </div>
          </div>
        )}

        {!isLoading && routeInfo.showStats && routeInfo.start && routeInfo.destination && routeInfo.routes && routeInfo.routeStats && (
          <div className="h-96 mb-6 rounded-lg overflow-hidden border">
            <MapContainer
              center={routeInfo.start.coordinates}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Start Marker */}
              <Marker position={routeInfo.start.coordinates}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">Start: {routeInfo.start.name}</h3>
                    <p className="text-sm text-gray-600">Risk Level: {getSafetyLevel(routeInfo.start.crimeStats)}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker position={routeInfo.destination.coordinates}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">End: {routeInfo.destination.name}</h3>
                    <p className="text-sm text-gray-600">Risk Level: {getSafetyLevel(routeInfo.destination.crimeStats)}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Danger spots */}
              {dangerSpots.map((spot, index) => (
                <CircleMarker
                  key={`danger-${index}`}
                  center={spot.coordinates}
                  radius={5}
                  pathOptions={{
                    color: spot.severity === 'high' ? '#DC2626' : spot.severity === 'medium' ? '#F97316' : '#FACC15',
                    fillColor: spot.severity === 'high' ? '#DC2626' : spot.severity === 'medium' ? '#F97316' : '#FACC15',
                    fillOpacity: 0.7
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-red-600">Warning Area</h3>
                      <p className="text-sm">{spot.description}</p>
                      <p className="text-xs text-gray-600 mt-1">Severity: {spot.severity}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Route Lines */}
              {routeInfo.routes?.map((route, index) => (
                <Polyline
                  key={index}
                  positions={route}
                  pathOptions={{
                    color: index === 0 ? '#3B82F6' : '#10B981',
                    weight: 5,
                    opacity: index === 0 ? 0.8 : 0.6,
                    dashArray: index === 0 ? undefined : '10, 10'
                  }}
                />
              ))}

              {/* Danger points along routes */}
              {routeInfo.routeStats.primary.dangerPoints.map((point, idx) => (
                <CircleMarker
                  key={`primary-danger-${idx}`}
                  center={point.point}
                  radius={4}
                  pathOptions={{
                    color: '#3B82F6',
                    fillColor: point.severity === 'high' ? '#DC2626' : point.severity === 'medium' ? '#F97316' : '#FACC15',
                    fillOpacity: 0.8
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-blue-600">Primary Route Alert</h3>
                      <p className="text-sm">{point.description}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
              
              {routeInfo.routeStats.alternative.dangerPoints.map((point, idx) => (
                <CircleMarker
                  key={`alt-danger-${idx}`}
                  center={point.point}
                  radius={4}
                  pathOptions={{
                    color: '#10B981',
                    fillColor: point.severity === 'high' ? '#DC2626' : point.severity === 'medium' ? '#F97316' : '#FACC15',
                    fillOpacity: 0.8
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-green-600">Alternative Route Alert</h3>
                      <p className="text-sm">{point.description}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                Start Location
              </label>
              <select
                id="start"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="">Select start location</option>
                {Object.keys(locationData).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="">Select destination</option>
                {Object.keys(locationData).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !startLocation || !destination}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Calculating Route...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5" />
                Find Safe Route
              </>
            )}
          </button>
        </form>

        {!isLoading && routeInfo.showStats && routeInfo.start && routeInfo.destination && routeInfo.routes && routeInfo.routeStats && (
          <div className="mt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">{routeInfo.start.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Incidents:</span>
                    <span className="font-semibold">{routeInfo.start.crimeStats.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Safety Level:</span>
                    <span className={`font-semibold ${getSafetyColor(getSafetyLevel(routeInfo.start.crimeStats))}`}>
                      {getSafetyLevel(routeInfo.start.crimeStats)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">{routeInfo.destination.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Incidents:</span>
                    <span className="font-semibold">{routeInfo.destination.crimeStats.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Safety Level:</span>
                    <span className={`font-semibold ${getSafetyColor(getSafetyLevel(routeInfo.destination.crimeStats))}`}>
                      {getSafetyLevel(routeInfo.destination.crimeStats)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg text-blue-800">Route Safety Analysis</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-blue-800 flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      Primary Route
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      routeInfo.routeStats.primary.safetyScore > 75 ? 'bg-green-100 text-green-800' : 
                      routeInfo.routeStats.primary.safetyScore > 50 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      Safety Score: {routeInfo.routeStats.primary.safetyScore}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Estimated time: {routeInfo.estimatedTime?.primary} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Risk points: {routeInfo.routeStats.primary.dangerPoints.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-green-800 flex items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                      Alternative Route
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      routeInfo.routeStats.alternative.safetyScore > 75 ? 'bg-green-100 text-green-800' : 
                      routeInfo.routeStats.alternative.safetyScore > 50 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      Safety Score: {routeInfo.routeStats.alternative.safetyScore}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Estimated time: {routeInfo.estimatedTime?.alternative} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Risk points: {routeInfo.routeStats.alternative.dangerPoints.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-md mb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">Safety Alerts</span>
                </h4>
                <div className="space-y-3">
                  {routeInfo.routeStats.primary.dangerPoints.length > 0 && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                      <div className="font-medium text-red-700 mb-1">Primary Route Alerts</div>
                      <ul className="space-y-2 text-sm">
                        {routeInfo.routeStats.primary.dangerPoints.slice(0, 3).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className={`mt-1 w-2 h-2 rounded-full ${getSeverityColor(point.severity)}`}></div>
                            <span>{point.description} ({point.severity} risk)</span>
                          </li>
                        ))}
                        {routeInfo.routeStats.primary.dangerPoints.length > 3 && (
                          <li className="italic text-xs text-gray-500">
                            +{routeInfo.routeStats.primary.dangerPoints.length - 3} more alerts
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {routeInfo.routeStats.alternative.dangerPoints.length > 0 && (
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <div className="font-medium text-yellow-700 mb-1">Alternative Route Alerts</div>
                      <ul className="space-y-2 text-sm">
                        {routeInfo.routeStats.alternative.dangerPoints.slice(0, 3).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className={`mt-1 w-2 h-2 rounded-full ${getSeverityColor(point.severity)}`}></div>
                            <span>{point.description} ({point.severity} risk)</span>
                          </li>
                        ))}
                        {routeInfo.routeStats.alternative.dangerPoints.length > 3 && (
                          <li className="italic text-xs text-gray-500">
                            +{routeInfo.routeStats.alternative.dangerPoints.length - 3} more alerts
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-md">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
  <Calendar className="w-5 h-5 text-blue-600" />
  <span>Recommended Times</span>
</h4>
<div className="space-y-2 text-sm">
  <p>
    <span className="font-medium">Morning (6AM-9AM):</span>{" "}
    {routeInfo.routeStats.primary.safetyScore > routeInfo.routeStats.alternative.safetyScore
      ? "Primary route recommended"
      : "Alternative route recommended"}
  </p>
  <p>
    <span className="font-medium">Evening (5PM-8PM):</span>{" "}
    {routeInfo.routeStats.alternative.safetyScore > 70
      ? "Alternative route recommended"
      : "Primary route with caution"}
  </p>
</div>
</div>

<div className="bg-white rounded-lg p-4 shadow-md">
  <h4 className="font-semibold mb-3 flex items-center gap-2">
    <Info className="w-5 h-5 text-blue-600" />
    <span>Safety Tips</span>
  </h4>
  <ul className="space-y-2 text-sm list-disc pl-5">
    <li>Stay alert and aware of your surroundings</li>
    <li>Avoid displaying valuable items in public</li>
    <li>Share your location with trusted contacts</li>
    <li>Follow marked pedestrian paths</li>
    <li>Consider alternative transportation after dark</li>
  </ul>
</div>
</div>

<div className="flex justify-center mt-4">
  <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors">
    <ThumbsUp className="w-5 h-5" />
    <span>This route was helpful</span>
  </button>
</div>
</div>
</div>
)}
</div>
</div>
);
}