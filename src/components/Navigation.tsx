import { Link, useLocation } from "react-router-dom";
import { Home, Map, Building2, BarChart3, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Map", href: "/map", icon: Map },
  { name: "Shelters", href: "/shelters", icon: Building2 },
  { name: "Summary", href: "/summary", icon: BarChart3 },
];

export default function Navigation({ isMobile = false, onItemClick }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className={cn(
      "bg-card border-r border-border",
      isMobile ? "flex flex-col w-full" : "w-64 min-h-screen flex flex-col"
    )}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AidAtlas</h1>
            <p className="text-sm text-muted-foreground">Emergency Response</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}