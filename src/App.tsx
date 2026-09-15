import React, { useState } from 'react';
import Map from './components/Map';
import  LiveLocationAlert  from './components/LiveLocationAlert';
import Statistics from './components/Statistics';
import IncidentList from './components/IncidentList';
import ReportIncident from './components/ReportIncident';
import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';
import AreaSearch from './components/AreaSearch';
import RoutePlanner from './components/RoutePlanner';
import { CrimeIncident, CrimeStatistics } from './types';

const sampleIncidents: CrimeIncident[] = [
  {
    id: '1',
    type: 'Theft',
    description: 'Mobile phone snatching near railway station',
    latitude: 11.0168,
    longitude: 76.9558,
    reported_at: '2024-03-10T14:30:00Z',
    severity: 'medium',
    status: 'investigating',
    location_details: 'Near Coimbatore Junction'
  },
  {
    id: '2',
    type: 'Vehicle Theft',
    description: 'Car stolen from residential area',
    latitude: 11.0250,
    longitude: 76.9650,
    reported_at: '2024-03-09T18:15:00Z',
    severity: 'high',
    status: 'reported',
    location_details: 'RS Puram, Near PSG College'
  },
  {
    id: '3',
    type: 'Vandalism',
    description: 'Shop windows damaged during night',
    latitude: 11.0300,
    longitude: 76.9700,
    reported_at: '2024-03-08T09:45:00Z',
    severity: 'low',
    status: 'resolved',
    location_details: 'Gandhipuram Bus Stand Area'
  },
  {
    id: '4',
    type: 'Robbery',
    description: 'Armed robbery at jewelry store',
    latitude: 11.0200,
    longitude: 76.9600,
    reported_at: '2024-03-11T20:15:00Z',
    severity: 'high',
    status: 'investigating',
    location_details: 'Town Hall, Cross Cut Road'
  },
  {
    id: '5',
    type: 'Assault',
    description: 'Physical altercation at restaurant',
    latitude: 11.0280,
    longitude: 76.9680,
    reported_at: '2024-03-10T22:30:00Z',
    severity: 'medium',
    status: 'resolved',
    location_details: 'Race Course, Near Golf Club'
  },
  {
    id: '6',
    type: 'Burglary',
    description: 'House break-in reported in residential area',
    latitude: 11.0478,
    longitude: 76.9950,
    reported_at: '2024-03-12T03:15:00Z',
    severity: 'high',
    status: 'investigating',
    location_details: 'Peelamedu, Near Airport'
  },
  {
    id: '7',
    type: 'Theft',
    description: 'Shoplifting incident at mall',
    latitude: 11.0147,
    longitude: 77.0291,
    reported_at: '2024-03-11T16:45:00Z',
    severity: 'low',
    status: 'resolved',
    location_details: 'Hopes College, Avinashi Road'
  },
  {
    id: '8',
    type: 'Vehicle Theft',
    description: 'Motorcycle stolen from parking',
    latitude: 10.9925,
    longitude: 76.9745,
    reported_at: '2024-03-12T14:20:00Z',
    severity: 'medium',
    status: 'reported',
    location_details: 'Ukkadam Bus Stand'
  },
  {
    id: '9',
    type: 'Vandalism',
    description: 'Public property damaged',
    latitude: 11.0328,
    longitude: 76.9354,
    reported_at: '2024-03-12T08:30:00Z',
    severity: 'medium',
    status: 'investigating',
    location_details: 'Vadavalli Main Road'
  },
  {
    id: '10',
    type: 'Robbery',
    description: 'Chain snatching incident',
    latitude: 11.0614,
    longitude: 76.9852,
    reported_at: '2024-03-11T19:10:00Z',
    severity: 'high',
    status: 'reported',
    location_details: 'Ganapathy, Temple Area'
  },
  {
    id: '11',
    type: 'Burglary',
    description: 'Shop break-in during early hours',
    latitude: 11.0156,
    longitude: 76.9558,
    reported_at: '2024-03-12T04:30:00Z',
    severity: 'high',
    status: 'investigating',
    location_details: 'Oppanakara Street'
  },
  {
    id: '12',
    type: 'Vehicle Theft',
    description: 'Auto rickshaw stolen',
    latitude: 11.0247,
    longitude: 76.9117,
    reported_at: '2024-03-11T23:15:00Z',
    severity: 'medium',
    status: 'reported',
    location_details: 'Thudiyalur Main Road'
  },
  {
    id: '13',
    type: 'Assault',
    description: 'Street fight reported',
    latitude: 11.0397,
    longitude: 77.0266,
    reported_at: '2024-03-12T21:45:00Z',
    severity: 'medium',
    status: 'investigating',
    location_details: 'Singanallur Bus Stand'
  },
  {
    id: '14',
    type: 'Theft',
    description: 'Purse snatching incident',
    latitude: 11.0223,
    longitude: 76.9232,
    reported_at: '2024-03-12T17:20:00Z',
    severity: 'medium',
    status: 'reported',
    location_details: 'Saibaba Colony'
  },
  {
    id: '15',
    type: 'Vandalism',
    description: 'Vehicle damaged in parking lot',
    latitude: 11.0082,
    longitude: 76.9562,
    reported_at: '2024-03-12T13:10:00Z',
    severity: 'low',
    status: 'resolved',
    location_details: 'Near Town Hall'
  }
];

const sampleStatistics: CrimeStatistics[] = [
  { type: 'Theft', count: 35 },
  { type: 'Vehicle Theft', count: 28 },
  { type: 'Vandalism', count: 15 },
  { type: 'Assault', count: 12 },
  { type: 'Burglary', count: 18 },
  { type: 'Robbery', count: 22 }
];

function App() {
  const [incidents] = useState<CrimeIncident[]>(sampleIncidents);
  const [statistics] = useState<CrimeStatistics[]>(sampleStatistics);
  const [activeTab, setActiveTab] = useState<'map' | 'stats' | 'list' | 'report' | 'area' | 'route'>('map');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleReport = (incident: Omit<CrimeIncident, 'id' | 'status' | 'reported_at'>) => {
    console.log('Reporting incident:', incident);
    setIsReportModalOpen(false);
  };

  const filteredIncidents = incidents.filter(incident => 
    incident.location_details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 py-6 mt-24 mb-20">
        {activeTab === 'map' && <Map incidents={filteredIncidents} />}
        {activeTab === 'stats' && <Statistics data={statistics} />}
        {activeTab === 'list' && <IncidentList incidents={filteredIncidents} />}
        {activeTab === 'area' && <AreaSearch />}
        {activeTab === 'route' && <RoutePlanner />}
        {activeTab === 'report' && (
          <div className="p-4">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Report New Incident
            </button>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {isReportModalOpen && (
        <ReportIncident
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReport}
        />
      )}
    </div>
  );
}

export default App;