import { format } from 'date-fns';
import { CrimeIncident } from '../types';
import { AlertTriangle, CheckCircle, Search, MapPin, Filter, Map, Clock, AlertOctagon, CalendarClock, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IncidentListProps {
  incidents: CrimeIncident[];
}

export default function IncidentList({ incidents }: IncidentListProps) {
  const [selectedIncident, setSelectedIncident] = useState<CrimeIncident | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Static city options
  const cities = ['all', 'Coimbatore', 'Tirupur'];
  
  // Add city-specific hotspots
  const cityHotspots = {
    'Coimbatore': [
      { area: 'Ukkadam', crimeType: 'Theft', frequency: 'High' },
      { area: 'Gandhipuram', crimeType: 'Vehicle Theft', frequency: 'Medium' },
      { area: 'R.S. Puram', crimeType: 'Burglary', frequency: 'Medium' },
      { area: 'Peelamedu', crimeType: 'Chain Snatching', frequency: 'High' },
      { area: 'Saibaba Colony', crimeType: 'Property Disputes', frequency: 'Medium' }
    ],
    'Tirupur': [
      { area: 'Avinashi Road', crimeType: 'Theft', frequency: 'Medium' },
      { area: 'Palladam', crimeType: 'Industrial Disputes', frequency: 'High' },
      { area: 'Veerapandi', crimeType: 'Robbery', frequency: 'Medium' },
      { area: 'Mangalam', crimeType: 'Assault', frequency: 'Medium' },
      { area: 'Tirupur North', crimeType: 'Labor Disputes', frequency: 'High' }
    ]
  };

  // Filter incidents based on filters
  const filteredIncidents = incidents.filter(incident => {
    const matchesCity = selectedCity === 'all' || incident.city === selectedCity;
    const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || incident.status === selectedStatus;
    
    return matchesCity && matchesSeverity && matchesStatus;
  });

  // Sort incidents
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'severity') {
      const severityRank = { low: 1, medium: 2, high: 3 };
      const rankA = severityRank[a.severity as keyof typeof severityRank];
      const rankB = severityRank[b.severity as keyof typeof severityRank];
      return sortOrder === 'asc' ? rankA - rankB : rankB - rankA;
    }
    return 0;
  });

  // Calculate incident statistics
  const totalIncidents = filteredIncidents.length;
  const coimbatoreCount = filteredIncidents.filter(i => i.city === 'Coimbatore').length;
  const tirupurCount = filteredIncidents.filter(i => i.city === 'Tirupur').length;
  const highSeverityCount = filteredIncidents.filter(i => i.severity === 'high').length;
  const resolvedCount = filteredIncidents.filter(i => i.status === 'resolved').length;

  // Toggle sort order when sort criteria changes
  useEffect(() => {
    setSortOrder('desc');
  }, [sortBy]);

  // Get hotspots for the selected city
  const activeHotspots = selectedCity !== 'all' 
    ? cityHotspots[selectedCity as keyof typeof cityHotspots] 
    : [...cityHotspots['Coimbatore'], ...cityHotspots['Tirupur']];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl overflow-hidden p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Crime Incidents {selectedCity !== 'all' ? `in ${selectedCity}` : 'in Coimbatore & Tirupur'}
        </h2>
        
        <div className="flex gap-3">
          {/* Filter toggle button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Incidents</p>
            <p className="text-2xl font-bold">{totalIncidents}</p>
          </div>
          <AlertOctagon className="w-10 h-10 text-blue-500" />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Coimbatore</p>
            <p className="text-2xl font-bold">{coimbatoreCount}</p>
          </div>
          <MapPin className="w-10 h-10 text-purple-500" />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Tirupur</p>
            <p className="text-2xl font-bold">{tirupurCount}</p>
          </div>
          <MapPin className="w-10 h-10 text-yellow-500" />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="text-2xl font-bold">{resolvedCount}</p>
          </div>
          <Shield className="w-10 h-10 text-green-500" />
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* City filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Both Cities</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tirupur">Tirupur</option>
            </select>
          </div>
          
          {/* Severity filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          {/* Sort options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="severity">Severity</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded border border-gray-300 hover:bg-gray-100"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Crime Hotspots Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Crime Hotspots {selectedCity !== 'all' ? `in ${selectedCity}` : 'in Coimbatore & Tirupur'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeHotspots.map((hotspot, index) => (
            <div key={index} className="border-l-4 border-red-500 pl-3 py-2">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">{hotspot.area}</h4>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-semibold
                  ${hotspot.frequency === 'High' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}
                `}>
                  {hotspot.frequency} Risk
                </span>
              </div>
              <p className="text-gray-600">Common Crime: {hotspot.crimeType}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* City-specific crime trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Coimbatore Crime Trends */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Coimbatore Crime Trends</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-2 mr-2"></span>
              <p className="text-sm text-gray-700">Chain snatching incidents increased by 15% in Peelamedu and R.S. Puram areas</p>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
              <p className="text-sm text-gray-700">Vehicle thefts decreased by 20% in Gandhipuram following increased police patrolling</p>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-2"></span>
              <p className="text-sm text-gray-700">Ukkadam market area reports steady rise in pickpocketing cases during weekends</p>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
              <p className="text-sm text-gray-700">Saibaba Colony residential theft cases down 30% after community watch program implementation</p>
            </li>
          </ul>
        </div>
        
        {/* Tirupur Crime Trends */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Tirupur Crime Trends</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-2 mr-2"></span>
              <p className="text-sm text-gray-700">Labor disputes at textile units in Palladam increased by 25% this quarter</p>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></span>
              <p className="text-sm text-gray-700">Road accidents on Avinashi Road reduced by 40% after new traffic measures</p>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-2"></span>
              <p className="text-sm text-gray-700">Theft reports in industrial areas remain consistently high near Mangalam</p>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
              <p className="text-sm text-gray-700">Factory property disputes in Veerapandi resolved through new mediation program</p>
            </li>
          </ul>
        </div>
      </div>
      
      {/* No results message */}
      {sortedIncidents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <AlertOctagon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No incidents found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      )}
      
      {/* Incidents list */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Incidents</h3>
      <div className="space-y-4">
        {sortedIncidents.map((incident) => (
          <div
            key={incident.id}
            className={`bg-white p-5 hover:bg-blue-50 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center rounded-lg shadow-sm transition duration-200 ease-in-out border-l-4 
              ${incident.city === 'Coimbatore' ? 'border-purple-500' : 'border-yellow-500'}`}
            onClick={() => setSelectedIncident(incident)}
          >
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{incident.type}</h3>
                <span className="text-sm text-gray-600 inline-flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {incident.city}, {incident.location}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{incident.description}</p>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center text-xs text-gray-500">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" />
                  {format(new Date(incident.reported_at), 'PPp')}
                </span>
                
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                  ${incident.severity === 'high' ? 'bg-red-100 text-red-800' :
                    incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}
                `}>
                  {incident.severity.toUpperCase()}
                </span>
                
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                  ${incident.status === 'reported' ? 'bg-purple-100 text-purple-800' :
                    incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                    'bg-teal-100 text-teal-800'}
                `}>
                  {incident.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex mt-3 md:mt-0">
              {incident.status === 'reported' && (
                <AlertTriangle className="w-6 h-6 text-purple-500" />
              )}
              {incident.status === 'investigating' && (
                <Search className="w-6 h-6 text-blue-500" />
              )}
              {incident.status === 'resolved' && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Emergency contact information */}
      <div className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-700">Coimbatore</h4>
            <ul className="text-sm text-blue-900">
              <li className="mb-1">Police Control Room: 0422-2300970</li>
              <li className="mb-1">City Police Commissioner: 0422-2300901</li>
              <li className="mb-1">Traffic Police: 0422-2301640</li>
              <li>Women Helpline: 0422-2300999</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700">Tirupur</h4>
            <ul className="text-sm text-blue-900">
              <li className="mb-1">Police Control Room: 0421-2200100</li>
              <li className="mb-1">City Police Commissioner: 0421-2200200</li>
              <li className="mb-1">Traffic Police: 0421-2200300</li>
              <li>Women Helpline: 0421-2200400</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Detailed incident modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 
                  ${selectedIncident.city === 'Coimbatore' ? 'bg-purple-500' : 'bg-yellow-500'}`}>
                </span>
                <h3 className="text-2xl font-bold text-gray-900">{selectedIncident.type}</h3>
              </div>
              <span className={`
                inline-block px-3 py-1 rounded-full text-xs font-semibold ml-2
                ${selectedIncident.severity === 'high' ? 'bg-red-100 text-red-800' :
                  selectedIncident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'}
              `}>
                {selectedIncident.severity.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedIncident.city}, {selectedIncident.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CalendarClock className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Reported At</p>
                  <p className="font-medium">{format(new Date(selectedIncident.reported_at), 'PPp')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <AlertOctagon className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{selectedIncident.status}</p>
                </div>
              </div>
              
              {selectedIncident.resolved_at && (
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Resolved At</p>
                    <p className="font-medium">{format(new Date(selectedIncident.resolved_at), 'PPp')}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{selectedIncident.description}</p>
            </div>

            {/* Local Safety Tips based on incident type */}
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Safety Tips</h4>
              {selectedIncident.type.toLowerCase().includes('theft') && (
                <ul className="list-disc list-inside text-yellow-800 text-sm">
                  <li>Keep valuables out of sight when in public places</li>
                  <li>Be aware of your surroundings, especially in crowded areas</li>
                  <li>Install adequate lighting and security systems at home and business</li>
                  <li>Report suspicious activities to local police immediately</li>
                </ul>
              )}
              {selectedIncident.type.toLowerCase().includes('assault') && (
                <ul className="list-disc list-inside text-yellow-800 text-sm">
                  <li>Avoid poorly lit and isolated areas, especially at night</li>
                  <li>Travel in groups when possible</li>
                  <li>Keep emergency contacts easily accessible</li>
                  <li>Consider taking self-defense classes</li>
                </ul>
              )}
              {(!selectedIncident.type.toLowerCase().includes('theft') && 
                !selectedIncident.type.toLowerCase().includes('assault')) && (
                <ul className="list-disc list-inside text-yellow-800 text-sm">
                  <li>Save emergency numbers on your phone</li>
                  <li>Stay updated with local crime alerts for your neighborhood</li>
                  <li>Join or form community watch programs</li>
                  <li>Report any suspicious activities to authorities</li>
                </ul>
              )}
            </div>
            
            {selectedIncident.actions && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Actions Taken</h4>
                <ul className="list-disc list-inside text-gray-800 bg-gray-50 p-4 rounded-lg">
                  {selectedIncident.actions.map((action, index) => (
                    <li key={index} className="mb-1">{action}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Close
              </button>
              
              {selectedIncident.status !== 'resolved' && (
                <button
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
                >
                  <Map className="w-4 h-4 mr-2" />
                  View on Map
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}