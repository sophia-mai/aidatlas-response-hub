import { useEffect,useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Menu, 
  X, 
  Building2, 
  Users, 
  Phone, 
  MapPin, 
  Search,
  ExternalLink,
  Wifi,
  UtensilsCrossed,
  Heart,
  Car
} from "lucide-react";
import { sampleShelters } from "@/data/sampleData";
import IncidentMap from "@/components/IncidentMap";
import { DirectionsRenderer } from "@react-google-maps/api";
import { useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import type { Hazard } from "@/data/sampleData";

function routeCrossesHazard(routePoints, hazards, radiusMeters = 50) {
  if (!window.google || !window.google.maps) return false;
  const { computeDistanceBetween } = window.google.maps.geometry.spherical;
  return hazards.some(hazard => {
    const hazardLatLng = new window.google.maps.LatLng(hazard.location.lat, hazard.location.lng);
    return routePoints.some(pt => {
      const ptLatLng = new window.google.maps.LatLng(pt.lat(), pt.lng());
      return computeDistanceBetween(ptLatLng, hazardLatLng) < radiusMeters;
    });
  });
}

export default function Shelters() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredShelters = sampleShelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shelter.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getShelterStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-success text-success-foreground';
      case 'full': return 'bg-warning text-warning-foreground';
      case 'closed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 75) return 'text-warning';
    return 'text-success';
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'food service': return <UtensilsCrossed className="w-4 h-4" />;
      case 'medical station': return <Heart className="w-4 h-4" />;
      case 'wi-fi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const stats = {
    total: sampleShelters.length,
    open: sampleShelters.filter(s => s.status === 'open').length,
    full: sampleShelters.filter(s => s.status === 'full').length,
    closed: sampleShelters.filter(s => s.status === 'closed').length,
    totalCapacity: sampleShelters.reduce((sum, s) => sum + s.capacity, 0),
    totalOccupancy: sampleShelters.reduce((sum, s) => sum + s.currentOccupancy, 0),
  };

  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsToShelter, setDirectionsToShelter] = useState<null | { shelter: typeof sampleShelters[0] }>(null);
  // For centering map on route/shelter
  const mapRef = useRef<any>(null);

  const [directionsRequest, setDirectionsRequest] = useState<{
    origin: { lat: number, lng: number },
    destination: { lat: number, lng: number },
    lastHazardIds?: string[]
  } | null>(null);
  const [hazards, setHazards] = useState<Hazard[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "hazards"), (snap) => {
      setHazards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Hazard[]);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (
      !directionsResult ||
      !hazards.length ||
      !directionsRequest
    ) return;

    // Polyline points of the displayed route
    const routePoints = directionsResult.routes[0].overview_path;
    const blocked = routeCrossesHazard(routePoints, hazards);

    if (blocked) {
      alert(
        "Warning: A new hazard is now blocking your current route. A safer route will be calculated if possible!"
      );

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: directionsRequest.origin,
          destination: directionsRequest.destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            setDirectionsResult(result);
          } else {
            alert(
              "No alternative safe route could be found at this time. Proceed with caution or choose another shelter."
            );
          }
        }
      );
    }
  }, [hazards, directionsResult, directionsRequest]);




  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation Overlay */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileNav(false)} />
          <div className="relative w-72 h-full bg-card">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" onClick={() => setShowMobileNav(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Navigation isMobile onItemClick={() => setShowMobileNav(false)} />
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Navigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowMobileNav(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Shelter Information</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shelters</CardTitle>
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-success">
                  {stats.open} currently open
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Capacity</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCapacity - stats.totalOccupancy}</div>
                <p className="text-xs text-muted-foreground">
                  of {stats.totalCapacity} total capacity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOccupancy}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.totalOccupancy / stats.totalCapacity) * 100)}% occupied
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.full}</div>
                <p className="text-xs text-warning">
                  shelters at capacity
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Shelters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Map with Exit Directions overlay and route */}
          <div className="relative w-full h-96 mb-8">
            <IncidentMap
              center={directionsToShelter ? directionsToShelter.shelter.location : undefined}
              directions={directionsResult}
              shelters={sampleShelters}
              onMapClick={() => {}}
              onIncidentClick={() => {}}
              pendingMarker={null}
              hazards={hazards}
            />
            {directionsToShelter && (
              <Button
                variant="destructive"
                className="absolute top-4 right-4 z-50"
                onClick={() => {
                  setDirectionsResult(null);
                  setDirectionsToShelter(null);
                }}
              >
                Exit Directions
              </Button>
            )}
          </div>


          {/* Shelter List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShelters.map((shelter) => (
              <Card key={shelter.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{shelter.name}</CardTitle>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {shelter.address}
                      </div>
                    </div>
                    <Badge className={getShelterStatusColor(shelter.status)}>
                      {shelter.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  {/* Capacity Information */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Occupancy</span>
                      <span className={`text-sm font-bold ${getOccupancyColor(shelter.currentOccupancy, shelter.capacity)}`}>
                        {shelter.currentOccupancy}/{shelter.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          shelter.currentOccupancy / shelter.capacity >= 0.9 ? 'bg-destructive' :
                          shelter.currentOccupancy / shelter.capacity >= 0.75 ? 'bg-warning' :
                          'bg-success'
                        }`}
                        style={{ width: `${Math.min((shelter.currentOccupancy / shelter.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {shelter.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Actions */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{shelter.contactPhone}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={async () => {
                          if (!window.navigator.geolocation || !shelter.location) {
                            alert("Geolocation not supported.");
                            return;
                          }
                          navigator.geolocation.getCurrentPosition(async pos => {
                            const origin = {
                              lat: pos.coords.latitude,
                              lng: pos.coords.longitude
                            };
                            const destination = shelter.location;
                            const directionsService = new window.google.maps.DirectionsService();
                            directionsService.route(
                              {
                                origin,
                                destination,
                                travelMode: window.google.maps.TravelMode.DRIVING,
                              },
                              (result, status) => {
                                if (status === window.google.maps.DirectionsStatus.OK && result) {
                                  setDirectionsResult(result);
                                  setDirectionsToShelter({ shelter }); // Save which shelter
                                  setDirectionsRequest({ origin, destination });
                                } else {
                                  alert("Could not find directions.");
                                }
                              }
                            );
                          }, (err) => {
                            alert("Could not get your location.");
                          });
                        }}
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Directions
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Last updated: {new Date(shelter.lastUpdated).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredShelters.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No shelters found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}