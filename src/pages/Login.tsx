import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - accept any credentials for demo
    if (credentials.username && credentials.password) {
      onLogin();
      navigate("/dashboard");
      toast({
        title: "Login Successful",
        description: "Welcome to AidAtlas Emergency Response System",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">AidAtlas</h1>
              <p className="text-xl text-muted-foreground">Emergency Response Platform</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Coordinating disaster response with precision and care
            </h2>
            
            <p className="text-lg text-muted-foreground">
              AidAtlas empowers first responders with real-time situational awareness, 
              streamlined incident management, and comprehensive resource coordination 
              during hurricane and flood emergencies.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
                <AlertTriangle className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Real-time Alerts</p>
                  <p className="text-sm text-muted-foreground">Instant notifications</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Live Mapping</p>
                  <p className="text-sm text-muted-foreground">Interactive hazard tracking</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
                <Users className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-medium text-foreground">Resource Management</p>
                  <p className="text-sm text-muted-foreground">Shelter coordination</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Responder Login</CardTitle>
              <CardDescription>
                Access the emergency response dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Access Dashboard
                </Button>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Demo: Use any username/password to login
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}