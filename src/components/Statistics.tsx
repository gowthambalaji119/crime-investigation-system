import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart as ChartBar, PieChart as PieChartIcon, RefreshCw, Search } from 'lucide-react';

interface CrimeStatistics {
  type: string;
  count: number;
  location: string;
  status: string;
  city: string;
  timestamp?: string;
}

interface StatisticsProps {
  initialData?: CrimeStatistics[];
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#D946EF'];

const CRIME_TYPES = [
  'Theft',
  'Vehicle Theft',
  'Burglary',
  'Chain Snatching',
  'Cybercrime',
  'Public Nuisance',
  'Traffic Violations',
  'Assault',
  'Drug-related',
  'Fraud'
];

const COIMBATORE_LOCATIONS = [
  'Gandhipuram',
  'Ukkadam',
  'Saibaba Colony',
  'RS Puram',
  'Singanallur',
  'Peelamedu',
  'Sulur',
  'Kuniyamuthur',
  'Saravanampatti',
  'Podanur',
  'Thudiyalur',
  'Ramanathapuram',
  'Periyanaickenpalayam',
  'Vadavalli',
  'Kovaipudur',
  'Sundarapuram',
  'Koundampalayam',
  'Town Hall',
  'Race Course',
  'Hope College'
];

const TIRUPUR_LOCATIONS = [
  'Avinashi Road',
  'Mangalam Road',
  'Palladam Road',
  'Dharapuram Road',
  'Kangeyam Road',
  'Chettipalayam',
  'Veerapandi',
  'Nallur',
  'Anupparpalayam',
  'Tirupur New Bus Stand',
  'Tirupur Railway Station',
  'Vellakoil',
  'Palladam',
  'Avinashi',
  'Mudalipalayam',
  'K.N.Colony',
  'P.N. Road',
  'S.R. Nagar',
  'Kongu Nagar',
  'SIDCO Industrial Estate'
];

const STATUS = ['Recent', '2 hours ago', '5 hours ago', '1 day ago', '2 days ago', '1 week ago', '2 weeks ago'];
const CITIES = ['Coimbatore', 'Tirupur'];

// Generate initial sample data
const generateSampleData = (): CrimeStatistics[] => {
  const coimbatoreData = Array.from({ length: 10 }, () => ({
    type: CRIME_TYPES[Math.floor(Math.random() * CRIME_TYPES.length)],
    location: COIMBATORE_LOCATIONS[Math.floor(Math.random() * COIMBATORE_LOCATIONS.length)],
    count: Math.floor(Math.random() * 10) + 1,
    status: STATUS[Math.floor(Math.random() * STATUS.length)],
    city: 'Coimbatore',
    timestamp: new Date().toLocaleTimeString()
  }));

  const tirupurData = Array.from({ length: 10 }, () => ({
    type: CRIME_TYPES[Math.floor(Math.random() * CRIME_TYPES.length)],
    location: TIRUPUR_LOCATIONS[Math.floor(Math.random() * TIRUPUR_LOCATIONS.length)],
    count: Math.floor(Math.random() * 10) + 1,
    status: STATUS[Math.floor(Math.random() * STATUS.length)],
    city: 'Tirupur',
    timestamp: new Date().toLocaleTimeString()
  }));

  return [...coimbatoreData, ...tirupurData];
};

const customTooltipStyle = {
  backgroundColor: '#FFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export default function Statistics({ initialData }: StatisticsProps) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [data, setData] = useState<CrimeStatistics[]>(initialData || generateSampleData());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Generate random crime report
  const generateCrimeReport = () => {
    const city = Math.random() > 0.5 ? 'Coimbatore' : 'Tirupur';
    const locations = city === 'Coimbatore' ? COIMBATORE_LOCATIONS : TIRUPUR_LOCATIONS;
    
    const newCrime: CrimeStatistics = {
      type: CRIME_TYPES[Math.floor(Math.random() * CRIME_TYPES.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      count: Math.floor(Math.random() * 10) + 1,
      status: STATUS[Math.floor(Math.random() * STATUS.length)],
      city: city,
      timestamp: new Date().toLocaleTimeString()
    };
    return newCrime;
  };

  // Update data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      setData(prevData => {
        const newReport = generateCrimeReport();
        const updatedData = [...prevData, newReport];
        if (updatedData.length > 40) { // Increased capacity for both cities
          updatedData.shift(); // Remove oldest report if more than 40
        }
        return updatedData;
      });
      setLastUpdate(new Date());
      setLoading(false);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Filter data based on selected city and search query
  const filteredData = data.filter(item => {
    const matchesCity = selectedCity === 'All' || item.city === selectedCity;
    const matchesSearch = searchQuery === '' || 
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCity && matchesSearch;
  });

  const totalIncidents = filteredData.reduce((sum, item) => sum + item.count, 0);
  const mostCommonCrime = filteredData.length > 0 
    ? filteredData.reduce((prev, current) => (prev.count > current.count ? prev : current)).type
    : 'N/A';
  const recentReports = filteredData.filter(d => d.status === 'Recent').length;

  // Handle manual refresh
  const handleRefresh = () => {
    setLoading(true);
    const newReport = generateCrimeReport();
    setData(prevData => {
      const updatedData = [...prevData, newReport];
      if (updatedData.length > 40) {
        updatedData.shift();
      }
      return updatedData;
    });
    setLastUpdate(new Date());
    setLoading(false);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Crime Statistics Dashboard</h2>
            <p className="text-gray-500 mt-1">{selectedCity === 'All' ? 'Coimbatore & Tirupur' : selectedCity} Metropolitan Area</p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
            <div className="text-sm text-gray-500 flex items-center">
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              <RefreshCw 
                className={`ml-2 w-4 h-4 cursor-pointer ${loading ? 'animate-spin' : 'hover:rotate-180 transition-transform'}`}
                onClick={handleRefresh}
              />
            </div>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  chartType === 'bar' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ChartBar className="w-5 h-5" />
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  chartType === 'pie' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <PieChartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search location or crime type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCity('All')}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                selectedCity === 'All' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Cities
            </button>
            <button
              onClick={() => setSelectedCity('Coimbatore')}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                selectedCity === 'Coimbatore' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Coimbatore
            </button>
            <button
              onClick={() => setSelectedCity('Tirupur')}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                selectedCity === 'Tirupur' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tirupur
            </button>
          </div>
        </div>

        <div className="h-[500px] p-4 bg-gray-50 rounded-lg">
          {filteredData.length > 0 ? (
            chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="type"
                    tick={{ fill: '#4B5563', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={70}
                  />
                  <YAxis tick={{ fill: '#4B5563' }} />
                  <Tooltip 
                    contentStyle={customTooltipStyle}
                    formatter={(value, name, props) => {
                      if (name === 'count') {
                        return [value, 'Count'];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Type: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Incidents"
                    fill="#3B82F6"
                    radius={[8, 8, 0, 0]}
                    label={{ position: 'top', fill: '#4B5563', fontSize: 12 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={180}
                    innerRadius={80}
                    dataKey="count"
                    nameKey="type"
                    paddingAngle={2}
                  >
                    {filteredData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={customTooltipStyle}
                    formatter={(value, name, props) => [value, 'Count']}
                    labelFormatter={(label) => `Type: ${label}`}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">No data found for the selected filters</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
          <h3 className="text-lg font-semibold text-gray-700">Total Incidents</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalIncidents}</p>
          <p className="text-sm text-gray-500 mt-1">
            {selectedCity === 'All' ? 'Across all locations' : `In ${selectedCity}`}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
          <h3 className="text-lg font-semibold text-gray-700">Most Common Crime</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">{mostCommonCrime}</p>
          <p className="text-sm text-gray-500 mt-1">Highest reported incident</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
          <h3 className="text-lg font-semibold text-gray-700">Recent Reports</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">{recentReports}</p>
          <p className="text-sm text-gray-500 mt-1">In the last hour</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Live Crime Reports</h3>
          <span className="text-sm text-gray-500">Auto-updates every minute</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">City</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Crime Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Count</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((crime, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 border-b">{crime.timestamp}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        crime.city === 'Coimbatore' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {crime.city}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">{crime.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 border-b">{crime.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 border-b">{crime.count}</td>
                    <td className="px-4 py-3 text-sm border-b">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        crime.status === 'Recent' ? 'bg-green-100 text-green-800' :
                        crime.status?.includes('hours') ? 'bg-yellow-100 text-yellow-800' :
                        crime.status?.includes('week') ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {crime.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No crime reports found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}