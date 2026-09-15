import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CrimeIncident } from '../types';

interface ReportIncidentProps {
  onClose: () => void;
}

export default function ReportIncident({ onClose }: ReportIncidentProps) {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    latitude: 11.0168,
    longitude: 76.9558,
    severity: 'medium' as 'low' | 'medium' | 'high',
    location_details: ''
  });

  const [recentReports, setRecentReports] = useState<CrimeIncident[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load reports from localStorage when the component mounts
  useEffect(() => {
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      setRecentReports(JSON.parse(savedReports));
    }
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (recentReports.length > 0) {
      localStorage.setItem('reports', JSON.stringify(recentReports));
    }
  }, [recentReports]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport = {
      ...formData,
      id: Date.now(),
      status: 'Pending',
      reported_at: new Date().toISOString()
    };

    setRecentReports([newReport, ...recentReports]);
    localStorage.setItem('reports', JSON.stringify([newReport, ...recentReports]));
    setSuccessMessage('Incident reported successfully!');
    setFormData({
      type: '',
      description: '',
      latitude: 11.0168,
      longitude: 76.9558,
      severity: 'medium',
      location_details: ''
    });
    setTimeout(() => setSuccessMessage(null), 3000); // Hide success message after 3 seconds
  };

  const handleDelete = (id: number) => {
    const updatedReports = recentReports.filter(report => report.id !== id);
    setRecentReports(updatedReports);
    localStorage.setItem('reports', JSON.stringify(updatedReports));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Report Incident</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 mb-4 rounded-md">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Select type</option>
                <option value="Theft">Theft</option>
                <option value="Vehicle Theft">Vehicle Theft</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Assault">Assault</option>
                <option value="Burglary">Burglary</option>
                <option value="Robbery">Robbery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Details</label>
              <input
                type="text"
                required
                value={formData.location_details}
                onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="e.g., Near Coimbatore Junction"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                required
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>

        {/* Recent Reports Section */}
        <div className="p-4 mt-6">
          <h3 className="text-lg font-semibold">Recent Reports</h3>
          <div className="space-y-4 mt-4">
            {recentReports.length === 0 ? (
              <p>No recent reports.</p>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                  <div className="flex flex-col">
                    <p className="font-semibold">{report.type}</p>
                    <p className="text-sm">{report.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
