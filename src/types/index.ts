export interface CrimeIncident {
  id: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  reported_at: string;
  severity: 'low' | 'medium' | 'high';
  status: 'reported' | 'investigating' | 'resolved';
  location_details: string;
}

export interface CrimeStatistics {
  type: string;
  count: number;
}