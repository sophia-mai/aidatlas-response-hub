import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Building2, 
  MapPin,
  Bell,
  Menu,
  X
} from "lucide-react";
import { sampleIncidents, sampleMessages, sampleShelters, Incident } from "@/data/sampleData";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  // You may want to share this state via context for cross-page add
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents);
  const [messages, setMessages] = useState(sampleMessages);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    priority: "medium",
    category: "other",
  });
  // Add New Incident Handler
  function handleAddIncident() {
    if (!form.title || !form.description || !form.address) return;
    const newIncident: Incident = {
      id: String(Math.random()*100000|0),
      title: form.title,
      description: form.description,
      location: { lat: 25.77, lng: -80.19 },
      address: form.address,
      priority: form.priority as any,
      status: "open",
      reportedBy: "Responder",
      reportedAt: new Date().toISOString(),
      category: form.category as any,
    };
    setIncidents([newIncident, ...incidents]);
    setMessages([
      {
        id: String(Math.random()*100000|0),
        title: "New Incident Reported",
        content: newIncident.title,
        priority: newIncident.priority as any,
        timestamp: new Date().toISOString(),
        read: false,
        sender: "System",
        type: "alert",
      },
      ...messages,
    ]);
    setForm({ title: "", description: "", address: "", priority: "medium", category: "other" });
    setAddOpen(false);
  }
  
  // Stats
  const stats = {
    totalIncidents: incidents.length,
    openIncidents: incidents.filter(i => i.status === 'open').length,
    inProgressIncidents: incidents.filter(i => i.status === 'in-progress').length,
    resolvedIncidents: incidents.filter(i => i.status === 'resolved').length,
    criticalIncidents: incidents.filter(i => i.priority === 'critical').length,
    totalShelters: sampleShelters.length,
    openShelters: sampleShelters.filter(s => s.status === 'open').length,
    totalCapacity: sampleShelters.reduce((sum, s) => sum + s.capacity, 0),
    currentOccupancy: sampleShelters.reduce((sum, s) => sum + s.currentOccupancy, 0),
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'urgent': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-warning text-warning-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation Overlay */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileNav(false)} />
          <div className="relative w-72 h-full bg-card">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileNav(false)}
              >
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
              <h1 className="text-2xl font-bold text-foreground">Response Dashboard</h1>
            </div>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Incident
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Incident</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Family Trapped"
                  />
                  <Label>Address</Label>
                  <Input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="e.g. 123 Main St, Miami"
                  />
                  <Label>Description</Label>
                  <Input
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the incident"
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
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
                    <div className="flex-1">
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
                  <Button className="w-full mt-2" onClick={handleAddIncident}>Add Incident</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalIncidents}</div>
                <p className="text-xs text-destructive">
                  {stats.criticalIncidents} critical
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openIncidents}</div>
                <p className="text-xs text-warning">
                  {stats.inProgressIncidents} in progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Shelters</CardTitle>
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openShelters}</div>
                <p className="text-xs text-success">
                  {stats.totalCapacity - stats.currentOccupancy} capacity available
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shelter Occupancy</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentOccupancy}</div>
                <p className="text-xs text-muted-foreground">
                  of {stats.totalCapacity} capacity
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages/Alerts */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Messages & Alerts
                </CardTitle>
                <CardDescription>
                  Latest communications and system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {messages.slice(0,10).map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          message.priority === 'urgent' ? 'border-l-destructive bg-destructive/5' :
                          message.priority === 'high' ? 'border-l-warning bg-warning/5' :
                          'border-l-primary bg-primary/5'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-foreground">{message.title}</h4>
                              <Badge className={getPriorityColor(message.priority)}>
                                {message.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{message.sender}</span>
                              <span>{new Date(message.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Recent Incidents
                </CardTitle>
                <CardDescription>
                  Latest reported incidents requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {incidents.slice(0,10).map((incident) => (
                      <div key={incident.id} className="p-3 rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-foreground">
                            {incident.title}
                          </h4>
                          <Badge className={getPriorityColor(incident.priority)}>
                            {incident.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {incident.address}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(incident.reportedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}