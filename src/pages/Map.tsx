import { useState } from "react";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Menu, X, Plus, MapPin, AlertTriangle, Shield, Building2, Zap, Construction, Waves } from "lucide-react";
import { sampleIncidents, sampleHazards, sampleShelters, Incident } from "@/data/sampleData";
import IncidentMap from "@/components/IncidentMap";

export default function Map() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents);
  const [showNewIncidentForm, setShowNewIncidentForm] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    priority: 'medium',
    category: 'other',
    lat: "",
    lng: "",
  });
  

  // Quick-add new incident
  function handleSubmitIncident() {
    if (!form.title || !form.address) return;
    setIncidents([{
      id: String(Math.random()*1e8|0),
      title: form.title,
      description: form.description,
      location: { lat: 25.77, lng: -80.19 },
      address: form.address,
      priority: form.priority as any,
      status: "open",
      reportedBy: "Responder",
      reportedAt: new Date().toISOString(),
      category: form.category as any,
    }, ...incidents]);
    setShowNewIncidentForm(false);
    setForm({ title: '', description: '', address: '', priority: 'medium', category: 'other', lat: null, lng: null });
  }

  const getHazardIcon = (type: string) => {
    switch (type) {
      case 'flood': return <Waves className="w-4 h-4" />;
      case 'power-outage': return <Zap className="w-4 h-4" />;
      case 'structural-damage': return <Construction className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const getShelterStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-success text-success-foreground';
      case 'full': return 'bg-warning text-warning-foreground';
      case 'closed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Filtering (advanced: could filter markers too)
  const showIncidents = selectedFilter === 'all' || selectedFilter === 'incidents';
  const showHazards   = selectedFilter === 'all' || selectedFilter === 'hazards';
  const showShelters  = selectedFilter === 'all' || selectedFilter === 'shelters';

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
              <h1 className="text-2xl font-bold text-foreground">Response Map</h1>
            </div>
            <Dialog open={showNewIncidentForm} onOpenChange={setShowNewIncidentForm}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Incident
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Report New Incident</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Label>Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Brief description of the incident"
                  />
                  <Label>Address/Location</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Street address or coordinates"
                  />
                  <Label>Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Detailed description of the situation"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priority</Label>
                      <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="rescue">Rescue</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="evacuation">Evacuation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="button" onClick={handleSubmitIncident} className="flex-1">
                      Submit Report
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewIncidentForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Map Area */}
          <div className="flex-1 relative" style={{ minHeight: 480 }}>
            <IncidentMap
              incidents={incidents}
              hazards={sampleHazards}
              shelters={sampleShelters}
              onMapClick={latlng => {
                setClickedLatLng(latlng);      // save clicked coordinates
                setShowNewIncidentForm(true);  // open dialog
              }}
              onIncidentClick={incident => {}}
            />
            {/* Map Filters */}
            <div className="absolute top-4 left-4 space-y-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >All</Button>
              <Button
                variant={selectedFilter === 'incidents' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('incidents')}
              >Incidents</Button>
              <Button
                variant={selectedFilter === 'hazards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('hazards')}
              >Hazards</Button>
              <Button
                variant={selectedFilter === 'shelters' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('shelters')}
              >Shelters</Button>
            </div>
          </div>
          {/* Side Panel */}
          <div className="w-80 border-l border-border bg-card p-4 space-y-4 overflow-y-auto">
            <h3 className="font-semibold text-foreground">Map Legend & Details</h3>
            {/* Incidents */}
            {showIncidents && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-warning" />
                    Active Incidents ({incidents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="p-2 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">{incident.title}</h4>
                        <Badge className={getSeverityColor(incident.priority)}>
                          {incident.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{incident.address}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {/* Hazards */}
            {showHazards && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-destructive" />
                    Active Hazards ({sampleHazards.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sampleHazards.map((hazard) => (
                    <div key={hazard.id} className="p-2 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {getHazardIcon(hazard.type)}
                          <h4 className="text-sm font-medium">{hazard.title}</h4>
                        </div>
                        <Badge className={getSeverityColor(hazard.severity)}>
                          {hazard.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{hazard.address}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {/* Shelters */}
            {showShelters && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-success" />
                    Shelters ({sampleShelters.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sampleShelters.map((shelter) => (
                    <div key={shelter.id} className="p-2 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">{shelter.name}</h4>
                        <Badge className={getShelterStatusColor(shelter.status)}>
                          {shelter.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{shelter.address}</p>
                      <p className="text-xs text-muted-foreground">{shelter.currentOccupancy}/{shelter.capacity} occupied</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}