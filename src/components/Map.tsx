import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap, Marker } from 'react-leaflet';
import { Shield, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CrimeIncident {
  id: string;
  type: string;
  severity: string;
  latitude: number;
  longitude: number;
  location: string;
  description: string;
  reported_at: string;
  solved: boolean;
  zone: string;
}

interface MapProps {
  incidents?: CrimeIncident[];
}

// Sample data (unchanged)
const sampleIncidents: CrimeIncident[] = [
  // Central Zone Incidents
  {
    id: "C001",
    type: "Vehicle Theft",
    severity: "medium",
    latitude: 11.0018,
    longitude: 76.9661,
    location: "Town Hall Area",
    description: "Two-wheeler stolen from parking area",
    reported_at: "2025-02-15T14:30:00",
    solved: true,
    zone: "Central"
  },
  {
    id: "C002",
    type: "Pickpocketing",
    severity: "low",
    latitude: 11.0072,
    longitude: 76.9556,
    location: "R.S. Puram Market",
    description: "Wallet stolen in crowded market area",
    reported_at: "2025-02-18T10:15:00",
    solved: false,
    zone: "Central"
  },
  {
    id: "C003",
    type: "Burglary",
    severity: "high",
    latitude: 11.0183,
    longitude: 76.9789,
    location: "Gandhipuram Commercial Area",
    description: "Shop break-in during night hours",
    reported_at: "2025-02-20T03:15:00",
    solved: true,
    zone: "Central"
  },

  // North Zone Incidents
  {
    id: "N001",
    type: "House Break-in",
    severity: "high",
    latitude: 11.0267,
    longitude: 76.9515,
    location: "Saibaba Colony",
    description: "Attempted break-in at residential property",
    reported_at: "2025-02-10T02:30:00",
    solved: true,
    zone: "North"
  },
  {
    id: "N002",
    type: "Traffic Violation",
    severity: "low",
    latitude: 11.0368,
    longitude: 76.9440,
    location: "Thudiyalur Road",
    description: "Multiple signal violations reported",
    reported_at: "2025-02-21T09:45:00",
    solved: true,
    zone: "North"
  },

  // East Zone Incidents
  {
    id: "E001",
    type: "Cybercrime",
    severity: "high",
    latitude: 11.0265,
    longitude: 77.0012,
    location: "Peelamedu Tech Park",
    description: "Online banking fraud reported",
    reported_at: "2025-02-14T16:20:00",
    solved: false,
    zone: "East"
  },
  {
    id: "E002",
    type: "Vehicle Accident",
    severity: "medium",
    latitude: 11.0004,
    longitude: 77.0297,
    location: "Singanallur Junction",
    description: "Multi-vehicle collision",
    reported_at: "2025-02-19T18:30:00",
    solved: true,
    zone: "East"
  },

  // South Zone Incidents
  {
    id: "S001",
    type: "Property Dispute",
    severity: "medium",
    latitude: 10.9924,
    longitude: 76.9617,
    location: "Ukkadam Area",
    description: "Dispute over commercial property",
    reported_at: "2025-02-16T11:20:00",
    solved: false,
    zone: "South"
  },
  {
    id: "S002",
    type: "Shop Lifting",
    severity: "low",
    latitude: 10.9950,
    longitude: 76.9900,
    location: "Ramanathapuram Mall",
    description: "Retail theft incident",
    reported_at: "2025-02-17T15:45:00",
    solved: true,
    zone: "South"
  },

  // West Zone Incidents
  {
    id: "W001",
    type: "Vandalism",
    severity: "medium",
    latitude: 10.9800,
    longitude: 76.9200,
    location: "Perur Temple Area",
    description: "Public property damage",
    reported_at: "2025-02-22T20:15:00",
    solved: false,
    zone: "West"
  },
  {
    id: "W002",
    type: "Drug Related",
    severity: "high",
    latitude: 10.9920,
    longitude: 76.9090,
    location: "KG Chavadi",
    description: "Illegal substance seizure",
    reported_at: "2025-02-13T23:30:00",
    solved: true,
    zone: "West"
  }
];

const policeStations = [
  // City Center & Main Areas
  { name: 'Coimbatore Central Police Station', lat: 11.0018, lng: 76.9661, type: 'police', zone: 'Central' },
  { name: 'R.S. Puram Police Station', lat: 11.0072, lng: 76.9556, type: 'police', zone: 'Central' },
  { name: 'Race Course Police Station', lat: 11.0016, lng: 76.9715, type: 'police', zone: 'Central' },
  { name: 'Gandhipuram Police Station', lat: 11.0183, lng: 76.9789, type: 'police', zone: 'Central' },
  { name: 'Town Hall Police Station', lat: 11.0046, lng: 76.9630, type: 'police', zone: 'Central' },
  
  // North Coimbatore
  { name: 'Saibaba Colony Police Station', lat: 11.0267, lng: 76.9515, type: 'police', zone: 'North' },
  { name: 'Koundampalayam Police Station', lat: 11.0368, lng: 76.9440, type: 'police', zone: 'North' },
  { name: 'Thudiyalur Police Station', lat: 11.0840, lng: 76.9510, type: 'police', zone: 'North' },
  { name: 'NGGO Colony Police Station', lat: 11.0290, lng: 76.9486, type: 'police', zone: 'North' },
  { name: 'Vadavalli Police Station', lat: 11.0240, lng: 76.9000, type: 'police', zone: 'North' },
  
  // East Coimbatore
  { name: 'Peelamedu Police Station', lat: 11.0265, lng: 77.0012, type: 'police', zone: 'East' },
  { name: 'Singanallur Police Station', lat: 11.0004, lng: 77.0297, type: 'police', zone: 'East' },
  { name: 'Hopes College Police Station', lat: 11.0222, lng: 77.0259, type: 'police', zone: 'East' },
  { name: 'Saravanampatti Police Station', lat: 11.0800, lng: 77.0010, type: 'police', zone: 'East' },
  { name: 'Railway Police Station', lat: 11.0153, lng: 76.9675, type: 'police', zone: 'East' },
  
  // South Coimbatore
  { name: 'Ukkadam Police Station', lat: 10.9924, lng: 76.9617, type: 'police', zone: 'South' },
  { name: 'Kuniyamuthur Police Station', lat: 10.9600, lng: 76.9500, type: 'police', zone: 'South' },
  { name: 'Podanur Police Station', lat: 10.9800, lng: 76.9940, type: 'police', zone: 'South' },
  { name: 'Kurichi Police Station', lat: 10.9700, lng: 76.9800, type: 'police', zone: 'South' },
  { name: 'Ramanathapuram Police Station', lat: 10.9950, lng: 76.9900, type: 'police', zone: 'South' },
  
  // West Coimbatore
  { name: 'Tirupur North Police Station', lat: 11.1071, lng: 77.3398, type: 'police', zone: 'Central', city: 'Tirupur' },
  { name: 'Tirupur Central Police Station', lat: 11.1053, lng: 77.3461, type: 'police', zone: 'Central', city: 'Tirupur' },
  { name: 'Khaderpet Police Station', lat: 11.1065, lng: 77.3420, type: 'police', zone: 'Central', city: 'Tirupur' },
  
  // North Tirupur
  { name: 'Nallur Police Station', lat: 11.1268, lng: 77.3551, type: 'police', zone: 'North', city: 'Tirupur' },
  { name: 'Avinashi Road Police Station', lat: 11.1350, lng: 77.3428, type: 'police', zone: 'North', city: 'Tirupur' },
  
  // South Tirupur
  { name: 'Palladam Road Police Station', lat: 11.0783, lng: 77.3373, type: 'police', zone: 'South', city: 'Tirupur' },
  { name: 'Mangalam Police Station', lat: 11.0680, lng: 77.3410, type: 'police', zone: 'South', city: 'Tirupur' },
  
  // East Tirupur
  { name: 'Veerapandi Police Station', lat: 11.1152, lng: 77.3704, type: 'police', zone: 'East', city: 'Tirupur' },
  { name: 'Anupparpalayam Police Station', lat: 11.1064, lng: 77.3692, type: 'police', zone: 'East', city: 'Tirupur' },
  
  // West Tirupur
  { name: 'Dharapuram Road Police Station', lat: 11.0986, lng: 77.3137, type: 'police', zone: 'West', city: 'Tirupur' },
  { name: 'KVR Nagar Police Station', lat: 11.1043, lng: 77.3208, type: 'police', zone: 'West', city: 'Tirupur' },
  { name: 'Dharapuram Road Police Station', lat: 11.0986, lng: 77.3137, type: 'police', zone: 'West', city: 'Tirupur' },
  { name: 'KVR Nagar Police Station', lat: 11.1043, lng: 77.3208, type: 'police', zone: 'West', city: 'Tirupur' },
  { name: 'Perur Police Station', lat: 10.9800, lng: 76.9200, type: 'police', zone: 'West' },
  { name: 'KG Chavadi Police Station', lat: 10.9920, lng: 76.9090, type: 'police', zone: 'West' },
  { name: 'Kovaipudur Police Station', lat: 10.9500, lng: 76.9300, type: 'police', zone: 'West' },
  { name: 'Sundakkamuthur Police Station', lat: 10.9700, lng: 76.9400, type: 'police', zone: 'West' },
  
  // Special Units
  { name: 'Traffic Police Station North', lat: 11.0190, lng: 76.9670, type: 'police', zone: 'Special' },
  { name: 'Traffic Police Station South', lat: 10.9900, lng: 76.9600, type: 'police', zone: 'Special' },
  { name: 'Cyber Crime Police Station', lat: 11.0160, lng: 76.9558, type: 'police', zone: 'Special' },
  { name: 'All Women Police Station', lat: 11.0150, lng: 76.9640, type: 'police', zone: 'Special' },
  { name: 'Crime Branch CID', lat: 11.0170, lng: 76.9680, type: 'police', zone: 'Special' }
];

// Component to handle user's location and update map view
function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });

    map.on('locationfound', (e: any) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 14);
    });

    map.on('locationerror', (e: any) => {
      setError(e.message);
      console.error('Error getting location: ', e);
    });

    return () => {
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map]);

  // Custom icon for user location
  const userIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItY2lyY2xlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzAwN2JmZiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTcgMjEuMXYtMmE0IDQgMCAwIDEgNC00aDJhNCA0IDAgMCAxIDQgNHYyIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <strong>Your Location</strong>
          <p className="text-xs mt-1">Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}</p>
        </div>
      </Popup>
    </Marker>
  );
}

// Component to prompt user for location permission - UPDATED
function LocationPrompt({ onAllowLocation, onDenyLocation }: { 
  onAllowLocation: () => void; 
  onDenyLocation: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-start justify-center pt-4 z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
        <h2 className="text-xl font-bold mb-4">Location Access</h2>
        <p className="mb-6">This app uses your location to show crime incidents near you. Would you like to share your location?</p>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onDenyLocation} 
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            No Thanks
          </button>
          <button 
            onClick={onAllowLocation} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Allow Location
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Map({ incidents = sampleIncidents }: MapProps) {
  const [selectedIncident, setSelectedIncident] = useState<CrimeIncident | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredIncidents, setFilteredIncidents] = useState(incidents);
  const [recentReports, setRecentReports] = useState<CrimeIncident[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [zoneFilter, setZoneFilter] = useState<string | null>(null);

  // Default center coordinates for the map
  const defaultCenter: [number, number] = [11.0168, 76.9558]; // Coimbatore center

  // Filter incidents based on filters
  useEffect(() => {
    let filtered = [...incidents];
    
    if (severityFilter) {
      filtered = filtered.filter(incident => incident.severity === severityFilter);
    }

    if (zoneFilter) {
      filtered = filtered.filter(incident => incident.zone === zoneFilter);
    }

    setFilteredIncidents(filtered);
  }, [incidents, severityFilter, zoneFilter]);

  // Generate new reports every minute
  const generateNewReport = () => {
    const types = ['Theft', 'Traffic Violation', 'Disturbance', 'Suspicious Activity'];
    const zones = ['North', 'South', 'East', 'West', 'Central'];
    const severities = ['low', 'medium', 'high'];
    const locations = ['Market Area', 'Residential Zone', 'Commercial District', 'Main Road'];
    
    return {
      id: `NEW${Math.random().toString(36).substr(2, 9)}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      latitude: 11.0168 + (Math.random() - 0.5) * 0.1,
      longitude: 76.9558 + (Math.random() - 0.5) * 0.1,
      location: locations[Math.floor(Math.random() * locations.length)],
      description: 'New incident reported',
      reported_at: new Date().toISOString(),
      solved: false,
      zone: zones[Math.floor(Math.random() * zones.length)]
    };
  };

  // Update recent reports every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newReport = generateNewReport();
      setRecentReports(prev => [newReport, ...prev].slice(0, 5));
      setLastRefresh(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'Central': return '#1e40af';
      case 'North': return '#1d4ed8';
      case 'South': return '#2563eb';
      case 'East': return '#3b82f6';
      case 'West': return '#60a5fa';
      case 'Special': return '#6d28d9';
      default: return '#3b82f6';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#dc2626';
      case 'medium': return '#ea580c';
      case 'low': return '#16a34a';
      default: return '#2563eb';
    }
  };

  const handleAllowLocation = () => {
    setShowLocationPrompt(false);
    setLocationAllowed(true);
  };

  const handleDenyLocation = () => {
    setShowLocationPrompt(false);
    setLocationAllowed(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Location Permission Prompt - UPDATED */}
      {showLocationPrompt && (
        <LocationPrompt 
          onAllowLocation={handleAllowLocation} 
          onDenyLocation={handleDenyLocation} 
        />
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex gap-4 items-center justify-end">
          <select
            className="border rounded-lg px-4 py-2"
            value={severityFilter || ''}
            onChange={(e) => setSeverityFilter(e.target.value || null)}
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="border rounded-lg px-4 py-2"
            value={zoneFilter || ''}
            onChange={(e) => setZoneFilter(e.target.value || null)}
          >
            <option value="">All Zones</option>
            <option value="Central">Central</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="Special">Special</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[50vh] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer 
          center={defaultCenter} 
          zoom={12} 
          className="h-full w-full"
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* User Location Marker - only show if permission granted */}
          {locationAllowed && <LocationMarker />}

          {/* Police Station Markers */}
          {policeStations.map((station, index) => (
            <CircleMarker
              key={index}
              center={[station.lat, station.lng]}
              radius={8}
              fillColor={getZoneColor(station.zone)}
              color="#ffffff"
              weight={2}
              fillOpacity={0.9}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(station);
                  setSelectedIncident(null);
                }
              }}
            >
              <Popup>
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-sm">{station.name}</div>
                  <div className="text-xs text-gray-600">{station.zone} Zone</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Crime Incident Markers */}
          {filteredIncidents.map((incident) => (
            <CircleMarker
              key={incident.id}
              center={[incident.latitude, incident.longitude]}
              radius={6}
              fillColor={getSeverityColor(incident.severity)}
              color="#000000"
              weight={1}
              fillOpacity={0.9}
              eventHandlers={{
                click: () => {
                  setSelectedIncident(incident);
                  setSelectedLocation(null);
                }
              }}
            >
              <Popup>
                <div className="text-sm font-semibold">{incident.type}</div>
                <p className="text-xs">Date: {format(new Date(incident.reported_at), 'dd/MM/yyyy HH:mm')}</p>
                <p className="text-xs">Status: {incident.solved ? 'Solved' : 'Not Solved'}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
          <h3 className="font-semibold mb-2">Police Stations by Zone</h3>
          <div className="grid grid-cols-1 gap-2">
            {['Central', 'North', 'South', 'East', 'West', 'Special'].map((zone) => (
              <div key={zone} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: getZoneColor(zone) }}
                />
                <span className="text-sm">{zone}</span>
              </div>
            ))}
          </div>
          <h3 className="font-semibold mt-4 mb-2">Incident Severity</h3>
          <div className="grid grid-cols-1 gap-2">
            {['high', 'medium', 'low'].map((severity) => (
              <div key={severity} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: getSeverityColor(severity) }}
                />
                <span className="text-sm capitalize">{severity}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white"></div>
              </div>
              <span className="text-sm">Your Location</span>
            </div>
          </div>
        </div>

        {/* Incident Details Panel */}
        {selectedIncident && (
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {selectedIncident.severity === 'high' && <AlertTriangle className="text-red-600" size={20} />}
                {selectedIncident.severity === 'medium' && <Info className="text-orange-600" size={20} />}
                {selectedIncident.severity === 'low' && <Shield className="text-green-600" size={20} />}
                <h3 className="font-semibold">{selectedIncident.type}</h3>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mt-2 space-y-2">
              <p className="text-sm">{selectedIncident.description}</p>
              <div className="text-xs text-gray-600">
                <p>Location: {selectedIncident.location}</p>
                <p>Reported: {format(new Date(selectedIncident.reported_at), 'dd/MM/yyyy HH:mm')}</p>
                <p>Zone: {selectedIncident.zone}</p>
                <p>Status: {selectedIncident.solved ? 
                  <span className="text-green-600">Solved</span> : 
                  <span className="text-red-600">Under Investigation</span>
                }</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Incidents List and Recent Reports */}
      <div className="grid grid-cols-2 gap-4">
        {/* Incident List */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">All Incidents</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredIncidents.map(incident => (
              <div 
                key={incident.id}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="flex items-center gap-2">
                  {incident.severity === 'high' && <AlertTriangle className="text-red-600" size={16} />}
                  {incident.severity === 'medium' && <Info className="text-orange-600" size={16} />}
                  {incident.severity === 'low' && <Shield className="text-green-600" size={16} />}
                  <span className="font-medium">{incident.type}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{incident.location}</p>
                  <p>{format(new Date(incident.reported_at), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RefreshCw size={16} className="animate-spin" />
              <span>Last updated: {format(lastRefresh, 'HH:mm:ss')}</span>
            </div>
          </div>
          <div className="space-y-2">
            {recentReports.map(report => (
              <div key={report.id} className="p-3 border rounded bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{report.type}</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{
                    backgroundColor: getSeverityColor(report.severity),
                    color: 'white'
                  }}>
                    {report.severity}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{report.zone} Zone</p>
                  <p>{format(new Date(report.reported_at), 'HH:mm:ss')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}