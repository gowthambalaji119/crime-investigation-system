import React, { useState, useEffect } from "react";
import { ShieldCheck, PhoneCall, Bell, MapPin, AlertTriangle, X, Check, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface AlertNotification {
  message: string;
  location: string;
}

interface ReportFormData {
  description: string;
  location: string;
  email: string;
}

interface ReportHistory {
  id: string;
  description: string;
  location: string;
  email: string;
  timestamp: string;
}

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<AlertNotification>({ message: "", location: "" });
  const [notificationCount, setNotificationCount] = useState(0);
  
  // New states for report form
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportFormData, setReportFormData] = useState<ReportFormData>({
    description: "",
    location: "",
    email: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  
  // Report history states
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleEmergencyCall = () => {
    window.location.href = "tel:100"; // Makes the emergency call
  };

  // Load reports from localStorage on component mount
  useEffect(() => {
    const savedReports = localStorage.getItem('crimeReports');
    if (savedReports) {
      setReportHistory(JSON.parse(savedReports));
    }
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          setReportFormData({
            ...reportFormData,
            location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportFormData({
      ...reportFormData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new report object with timestamp and ID
    const newReport: ReportHistory = {
      id: Date.now().toString(),
      ...reportFormData,
      timestamp: new Date().toLocaleString()
    };
    
    // Update report history
    const updatedHistory = [newReport, ...reportHistory];
    setReportHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('crimeReports', JSON.stringify(updatedHistory));
    
    // Reset form
    setReportFormData({
      description: "",
      location: "",
      email: ""
    });
    
    // Close form and show success message
    setShowReportForm(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Sample locations in Coimbatore
  const locationAlerts: AlertNotification[] = [
    {
      location: "Gandhipuram",
      message: "Multiple phone snatchings reported near bus stand. Stay vigilant."
    },
    {
      location: "RS Puram",
      message: "Recent vehicle theft reported. Use secure parking spots only."
    },
    {
      location: "Peelamedu",
      message: "ATM skimming devices found. Check ATM before use."
    },
    {
      location: "Singanallur",
      message: "Chain snatching incidents reported in evening hours. Be careful."
    },
    {
      location: "Race Course",
      message: "Vehicle break-ins reported in parking areas. Don't leave valuables visible."
    },
    {
      location: "Saibaba Colony",
      message: "House burglaries reported. Ensure doors and windows are locked."
    },
    {
      location: "Ukkadam",
      message: "Pickpocketing reported in market area. Secure your belongings."
    },
    {
      location: "Town Hall",
      message: "Avoid isolated areas after 9 PM. Multiple mugging incidents reported."
    },
    {
      location: "Hopes College",
      message: "Students targeted for mobile thefts. Keep devices secure."
    },
    {
      location: "Ramanathapuram",
      message: "Two-wheeler thefts reported overnight. Use additional locks."
    }
  ];

  useEffect(() => {
    // Show a new notification every 10 seconds
    const intervalId = setInterval(() => {
      const randomAlert = locationAlerts[Math.floor(Math.random() * locationAlerts.length)];
      setCurrentAlert(randomAlert);
      setShowNotification(true);
      setNotificationCount(prev => prev + 1);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000); // 5 seconds
    }, 100000); // 10000 ms = 10 seconds

    // Show first notification immediately on load
    const initialAlert = locationAlerts[Math.floor(Math.random() * locationAlerts.length)];
    setCurrentAlert(initialAlert);
    setShowNotification(true);
    setNotificationCount(1);
    
    // Hide first notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
<div className="flex items-center gap-4 cursor-pointer hover:bg-blue-50 rounded-full p-2 transition-all">
  <img 
    src="/images/image.png" 
    alt="Crime Investigation Platform Logo" 
    className="w-35 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-3"
  />
  <h1 className="text-3xl font-extrabold text-gray-900 hover:text-blue-600 transition-all duration-200">
    Crime Investigation System
  </h1>
</div>
            {/* Notification Bell, Report Button and Emergency Contact */}
            <div className="flex items-center gap-4">
              {/* Report Crime Button */}
              <button
                onClick={() => setShowReportForm(true)}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-200"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-semibold">Report Crime</span>
              </button>
              
              {/* My Reports Button */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-600 transition-all ease-in-out duration-200"
              >
                <Clock className="w-5 h-5" />
                <span className="text-sm font-semibold">My Reports</span>
                {reportHistory.length > 0 && (
                  <span className="inline-flex items-center justify-center bg-white text-purple-600 text-xs font-bold rounded-full h-5 w-5 ml-1">
                    {reportHistory.length}
                  </span>
                )}
              </button>
              
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  className="relative p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-all duration-200"
                  onClick={() => {
                    const randomAlert = locationAlerts[Math.floor(Math.random() * locationAlerts.length)];
                    setCurrentAlert(randomAlert);
                    setShowNotification(true);
                    setNotificationCount(prev => prev + 1);
                    
                    // Hide notification after 5 seconds
                    setTimeout(() => {
                      setShowNotification(false);
                    }, 5000);
                  }}
                >
                  <Bell className="w-6 h-6 text-blue-600" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Emergency Contact */}
              <div
                onClick={handleEmergencyCall}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600 transition-all ease-in-out duration-200"
              >
                <PhoneCall className="w-6 h-6" />
                <span className="text-sm font-semibold">Emergency: 100</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message Animation (at top) */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-success-fade">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center">
              <Check className="h-6 w-6 text-white mr-3" />
              <p className="font-medium">Report submitted successfully!</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Popup Notification */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-out">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-2xl max-w-lg w-full">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-blue-200" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center mb-1">
                  <MapPin className="h-4 w-4 text-red-300 mr-1" />
                  <p className="text-sm font-bold text-red-300">{currentAlert.location}</p>
                </div>
                <p className="text-sm font-medium">{currentAlert.message}</p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="ml-auto flex-shrink-0 text-blue-200 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Reports History Drawer */}
      {showHistory && (
        <div className="fixed inset-x-0 top-16 z-40 animate-slide-down bg-white shadow-xl rounded-b-lg max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">My Crime Reports</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {reportHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't submitted any reports yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportHistory.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-red-500 mr-1" />
                        <p className="text-sm font-medium text-gray-900">{report.location}</p>
                      </div>
                      <span className="text-xs text-gray-500">{report.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">{report.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Crime Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Report a Crime</h3>
                      <button
                        onClick={() => setShowReportForm(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Incident Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                          placeholder="Describe what happened..."
                          value={reportFormData.description}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="location"
                            id="location"
                            required
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter location or use current location"
                            value={reportFormData.location}
                            onChange={handleInputChange}
                          />
                          <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 text-gray-500 sm:text-sm"
                          >
                            {isLocating ? "Getting..." : "Current"}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <div className="relative flex items-stretch flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              required
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border p-2"
                              placeholder="your@email.com"
                              value={reportFormData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                        >
                          Submit Report
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 5s ease-in-out;
        }
        
        @keyframes successFade {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
        .animate-success-fade {
          animation: successFade 3s ease-in-out;
        }
        
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}