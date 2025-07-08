// Sample data for AidAtlas demo

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  address: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  category: 'medical' | 'rescue' | 'infrastructure' | 'evacuation' | 'other';
}

export interface Hazard {
  id: string;
  title: string;
  type: 'flood' | 'road-closure' | 'power-outage' | 'structural-damage' | 'debris';
  location: { lat: number; lng: number };
  address: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedAt: string;
  isActive: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  capacity: number;
  currentOccupancy: number;
  status: 'open' | 'full' | 'closed';
  amenities: string[];
  contactPhone: string;
  lastUpdated: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  read: boolean;
  sender: string;
  type: 'alert' | 'update' | 'request' | 'notification';
}

// Sample incidents
export const sampleIncidents: Incident[] = [
  {
    id: '1',
    title: 'Family Trapped on Roof',
    description: 'Family of 4 trapped on rooftop due to flooding, requesting immediate rescue',
    location: { lat: 25.7617, lng: -80.1918 },
    address: '123 Harbor View Dr, Miami, FL',
    priority: 'critical',
    status: 'open',
    reportedBy: 'Emergency Call Center',
    reportedAt: '2024-01-15T08:30:00Z',
    category: 'rescue'
  },
  {
    id: '2',
    title: 'Medical Emergency - Dialysis Patient',
    description: 'Elderly patient requires dialysis treatment, unable to reach hospital',
    location: { lat: 25.7907, lng: -80.1300 },
    address: '456 Ocean Dr, Miami Beach, FL',
    priority: 'high',
    status: 'in-progress',
    reportedBy: 'Family Member',
    reportedAt: '2024-01-15T09:15:00Z',
    assignedTo: 'Unit 12',
    category: 'medical'
  },
  {
    id: '3',
    title: 'Evacuation Request - Nursing Home',
    description: '24 residents need evacuation from flooded nursing home facility',
    location: { lat: 25.7317, lng: -80.2694 },
    address: '789 Sunset Blvd, Miami, FL',
    priority: 'high',
    status: 'open',
    reportedBy: 'Facility Manager',
    reportedAt: '2024-01-15T07:45:00Z',
    category: 'evacuation'
  }
];

// Sample hazards
export const sampleHazards: Hazard[] = [
  {
    id: '1',
    title: 'Severe Flooding - Downtown Area',
    type: 'flood',
    location: { lat: 25.7617, lng: -80.1918 },
    address: 'Downtown Miami, FL',
    severity: 'critical',
    description: 'Water levels 4-6 feet, multiple roads impassable',
    reportedAt: '2024-01-15T06:00:00Z',
    isActive: true
  },
  {
    id: '2',
    title: 'Bridge Closure - Key Biscayne',
    type: 'road-closure',
    location: { lat: 25.7317, lng: -80.1918 },
    address: 'Rickenbacker Causeway, Miami, FL',
    severity: 'high',
    description: 'Bridge closed due to high winds and flooding',
    reportedAt: '2024-01-15T05:30:00Z',
    isActive: true
  },
  {
    id: '3',
    title: 'Power Outage - Coral Gables',
    type: 'power-outage',
    location: { lat: 25.7217, lng: -80.2694 },
    address: 'Coral Gables, FL',
    severity: 'medium',
    description: 'Power lines down, affecting 5,000+ residents',
    reportedAt: '2024-01-15T07:00:00Z',
    isActive: true
  }
];

// Sample shelters
export const sampleShelters: Shelter[] = [
  {
    id: '1',
    name: 'Miami Convention Center',
    address: '1901 Convention Center Dr, Miami Beach, FL',
    location: { lat: 25.7907, lng: -80.1300 },
    capacity: 500,
    currentOccupancy: 342,
    status: 'open',
    amenities: ['Food Service', 'Medical Station', 'Pet Area', 'Wi-Fi'],
    contactPhone: '(305) 673-7311',
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'American Airlines Arena',
    address: '601 Biscayne Blvd, Miami, FL',
    location: { lat: 25.7814, lng: -80.1870 },
    capacity: 800,
    currentOccupancy: 156,
    status: 'open',
    amenities: ['Food Service', 'Medical Station', 'Family Area', 'Showers'],
    contactPhone: '(786) 777-1000',
    lastUpdated: '2024-01-15T09:45:00Z'
  },
  {
    id: '3',
    name: 'Miami Senior High School',
    address: '2450 SW 1st St, Miami, FL',
    location: { lat: 25.7617, lng: -80.2201 },
    capacity: 300,
    currentOccupancy: 300,
    status: 'full',
    amenities: ['Food Service', 'Medical Station'],
    contactPhone: '(305) 854-3321',
    lastUpdated: '2024-01-15T08:30:00Z'
  }
];

// Sample messages
export const sampleMessages: Message[] = [
  {
    id: '1',
    title: 'URGENT: Mass Evacuation Required',
    content: 'Immediate evacuation needed for Harbor View District. Water levels rising rapidly.',
    priority: 'urgent',
    timestamp: '2024-01-15T10:15:00Z',
    read: false,
    sender: 'Emergency Operations Center',
    type: 'alert'
  },
  {
    id: '2',
    title: 'New Shelter Opened',
    content: 'Additional shelter capacity now available at Miami Dade College.',
    priority: 'medium',
    timestamp: '2024-01-15T09:30:00Z',
    read: false,
    sender: 'Shelter Coordination',
    type: 'update'
  },
  {
    id: '3',
    title: 'Medical Supply Request',
    content: 'Urgent request for insulin and diabetes supplies at Convention Center shelter.',
    priority: 'high',
    timestamp: '2024-01-15T08:45:00Z',
    read: true,
    sender: 'Medical Team Alpha',
    type: 'request'
  }
];