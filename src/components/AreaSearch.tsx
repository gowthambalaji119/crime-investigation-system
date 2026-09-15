import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface AreaStats {
  name: string;
  stats: {
    low: number;
    medium: number;
    high: number;
  };
}

const areaStatistics: AreaStats[] = [
  { name: 'Gandhipuram', stats: { low: 55, medium: 35, high: 10 } },
  { name: 'RS Puram', stats: { low: 65, medium: 25, high: 10 } },
  { name: 'Townhall', stats: { low: 50, medium: 30, high: 20 } },
  { name: 'Selvapuram', stats: { low: 60, medium: 25, high: 15 } },
  { name: 'Rathinapuri', stats: { low: 40, medium: 50, high: 10 } },
  { name: 'Tatabad', stats: { low: 45, medium: 40, high: 15 } },
  { name: 'Peelamedu', stats: { low: 45, medium: 45, high: 10 } },
  { name: 'Saibaba Colony', stats: { low: 70, medium: 20, high: 10 } },
  { name: 'Ukkadam', stats: { low: 55, medium: 30, high: 15 } },
  { name: 'Singanallur', stats: { low: 60, medium: 30, high: 10 } },
  { name: 'Ganapathy', stats: { low: 50, medium: 40, high: 10 } },
  { name: 'Sidhapudur', stats: { low: 45, medium: 40, high: 15 } },
  { name: 'Saravanampatti', stats: { low: 65, medium: 25, high: 10 } },
  { name: 'Vadavalli', stats: { low: 60, medium: 30, high: 10 } },
  { name: 'Thudiyalur', stats: { low: 55, medium: 35, high: 10 } },
  { name: 'Podanur', stats: { low: 50, medium: 40, high: 10 } },
  { name: 'Kurichi', stats: { low: 45, medium: 40, high: 15 } },
  { name: 'Sundarapuram', stats: { low: 55, medium: 30, high: 15 } },
  { name: 'Ramanathapuram', stats: { low: 60, medium: 30, high: 10 } },
  { name: 'Kuniyamuthur', stats: { low: 50, medium: 35, high: 15 } },
  { name: 'Chinniampalayam', stats: { low: 55, medium: 30, high: 15 } },
  { name: 'Periyanaickenpalayam', stats: { low: 60, medium: 25, high: 15 } },
  { name: 'Kovaipudur', stats: { low: 65, medium: 25, high: 10 } }
];

export default function AreaSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAreas = areaStatistics.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Area Search & Statistics</h2>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredAreas.map((area) => (
            <div key={area.name} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">{area.name}</h3>
              </div>
              <div className="space-y-2">
                {['low', 'medium', 'high'].map((risk) => (
                  <div key={risk} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{risk.charAt(0).toUpperCase() + risk.slice(1)} Risk:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${risk === 'low' ? 'bg-green-500' : risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'} rounded-full`}
                          style={{ width: `${area.stats[risk]}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{area.stats[risk]}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
