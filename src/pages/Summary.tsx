import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Menu, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Building2, 
  Shield,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import { sampleIncidents, sampleHazards, sampleShelters, sampleMessages } from "@/data/sampleData";

export default function Summary() {
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Calculate comprehensive statistics
  const stats = {
    incidents: {
      total: sampleIncidents.length,
      open: sampleIncidents.filter(i => i.status === 'open').length,
      inProgress: sampleIncidents.filter(i => i.status === 'in-progress').length,
      resolved: sampleIncidents.filter(i => i.status === 'resolved').length,
      critical: sampleIncidents.filter(i => i.priority === 'critical').length,
      high: sampleIncidents.filter(i => i.priority === 'high').length,
      medical: sampleIncidents.filter(i => i.category === 'medical').length,
      rescue: sampleIncidents.filter(i => i.category === 'rescue').length,
      evacuation: sampleIncidents.filter(i => i.category === 'evacuation').length,
    },
    hazards: {
      total: sampleHazards.length,
      active: sampleHazards.filter(h => h.isActive).length,
      critical: sampleHazards.filter(h => h.severity === 'critical').length,
      high: sampleHazards.filter(h => h.severity === 'high').length,
      flood: sampleHazards.filter(h => h.type === 'flood').length,
      roadClosure: sampleHazards.filter(h => h.type === 'road-closure').length,
      powerOutage: sampleHazards.filter(h => h.type === 'power-outage').length,
    },
    shelters: {
      total: sampleShelters.length,
      open: sampleShelters.filter(s => s.status === 'open').length,
      full: sampleShelters.filter(s => s.status === 'full').length,
      closed: sampleShelters.filter(s => s.status === 'closed').length,
      totalCapacity: sampleShelters.reduce((sum, s) => sum + s.capacity, 0),
      currentOccupancy: sampleShelters.reduce((sum, s) => sum + s.currentOccupancy, 0),
    },
    messages: {
      total: sampleMessages.length,
      unread: sampleMessages.filter(m => !m.read).length,
      urgent: sampleMessages.filter(m => m.priority === 'urgent').length,
      high: sampleMessages.filter(m => m.priority === 'high').length,
    }
  };

  const occupancyRate = (stats.shelters.currentOccupancy / stats.shelters.totalCapacity) * 100;
  const resolutionRate = (stats.incidents.resolved / stats.incidents.total) * 100;

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
              <h1 className="text-2xl font-bold text-foreground">Operations Summary</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.incidents.open + stats.incidents.inProgress}</div>
                <p className="text-xs text-destructive">
                  {stats.incidents.critical} critical priority
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Hazards</CardTitle>
                <Shield className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.hazards.active}</div>
                <p className="text-xs text-warning">
                  {stats.hazards.critical} critical severity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shelter Capacity</CardTitle>
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(occupancyRate)}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.shelters.currentOccupancy} of {stats.shelters.totalCapacity} occupied
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(resolutionRate)}%</div>
                <p className="text-xs text-success">
                  {stats.incidents.resolved} of {stats.incidents.total} resolved
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incident Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Incident Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Incidents</span>
                    <span className="font-semibold">{stats.incidents.total}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open</span>
                      <span className="text-warning font-medium">{stats.incidents.open}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">In Progress</span>
                      <span className="text-primary font-medium">{stats.incidents.inProgress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolved</span>
                      <span className="text-success font-medium">{stats.incidents.resolved}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">By Priority</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Critical</span>
                        <span className="text-destructive font-medium">{stats.incidents.critical}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">High</span>
                        <span className="text-warning font-medium">{stats.incidents.high}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">By Category</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Medical</span>
                        <span className="font-medium">{stats.incidents.medical}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Rescue</span>
                        <span className="font-medium">{stats.incidents.rescue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Evacuation</span>
                        <span className="font-medium">{stats.incidents.evacuation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hazard & Shelter Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Resource Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hazards */}
                <div className="space-y-3">
                  <h4 className="font-medium">Active Hazards</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Active</span>
                      <span className="font-semibold">{stats.hazards.active}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Critical Severity</span>
                      <span className="text-destructive font-medium">{stats.hazards.critical}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Severity</span>
                      <span className="text-warning font-medium">{stats.hazards.high}</span>
                    </div>
                  </div>
                </div>

                {/* Shelters */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Shelter Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Shelters</span>
                      <span className="font-semibold">{stats.shelters.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open</span>
                      <span className="text-success font-medium">{stats.shelters.open}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">At Capacity</span>
                      <span className="text-warning font-medium">{stats.shelters.full}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Overall Occupancy</span>
                      <span className="font-medium">{Math.round(occupancyRate)}%</span>
                    </div>
                    <Progress value={occupancyRate} className="h-2" />
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Communications</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Messages</span>
                      <span className="font-semibold">{stats.messages.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Unread</span>
                      <span className="text-warning font-medium">{stats.messages.unread}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Urgent Priority</span>
                      <span className="text-destructive font-medium">{stats.messages.urgent}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operational Status */}
          <Card>
            <CardHeader>
              <CardTitle>Operational Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-2">
                    {stats.incidents.open + stats.incidents.inProgress}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Incidents Requiring Attention
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">
                    {stats.shelters.totalCapacity - stats.shelters.currentOccupancy}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available Shelter Capacity
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.hazards.active}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Hazards Monitored
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}