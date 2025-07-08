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
import { sampleIncidents, sampleMessages, sampleShelters } from "@/data/sampleData";

export default function Dashboard() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  const stats = {
    totalIncidents: sampleIncidents.length,
    openIncidents: sampleIncidents.filter(i => i.status === 'open').length,
    inProgressIncidents: sampleIncidents.filter(i => i.status === 'in-progress').length,
    resolvedIncidents: sampleIncidents.filter(i => i.status === 'resolved').length,
    criticalIncidents: sampleIncidents.filter(i => i.priority === 'critical').length,
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
            <Button className="bg-secondary hover:bg-secondary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Incident
            </Button>
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

          {/* Main Dashboard Grid */}
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
                    {sampleMessages.map((message) => (
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
                    {sampleIncidents.map((incident) => (
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