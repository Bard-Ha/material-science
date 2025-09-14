import { ReactNode } from "react";
import { Atom, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Atom className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Simien Materials AI</h1>
                <p className="text-xs text-muted-foreground">Advanced Material Discovery Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#dashboard" className="text-primary font-medium">Dashboard</a>
              <a href="#discovery" className="text-foreground hover:text-primary transition-colors">Discovery</a>
              <a href="#database" className="text-muted-foreground hover:text-foreground transition-colors">Database</a>
              <a href="#analysis" className="text-muted-foreground hover:text-foreground transition-colors">Analysis</a>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground text-sm font-medium">AM</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-6">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">AI Predictions Today</span>
                    <span className="text-sm font-medium text-primary">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Success Rate</span>
                    <span className="text-sm font-medium text-accent">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Ethiopian Materials</span>
                    <span className="text-sm font-medium text-secondary">1,247</span>
                  </div>
                </div>
              </div>

              {/* Recent Searches */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Recent Searches</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                    <div className="text-left">
                      <div className="text-sm font-medium">High-strength Steel</div>
                      <div className="text-xs text-muted-foreground">Tensile: 800-1200 MPa</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                    <div className="text-left">
                      <div className="text-sm font-medium">Thermal Barrier Coating</div>
                      <div className="text-xs text-muted-foreground">1400°C resistance</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                    <div className="text-left">
                      <div className="text-sm font-medium">Conductive Polymer</div>
                      <div className="text-xs text-muted-foreground">σ: 10³ S/m</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Ethiopian Materials Focus */}
              <Card className="bg-gradient-to-r from-ethiopian-green via-ethiopian-yellow to-ethiopian-red">
                <CardContent className="p-4">
                  <div className="bg-card rounded-md p-3">
                    <h4 className="text-sm font-medium text-foreground mb-2">🇪🇹 Local Resources</h4>
                    <p className="text-xs text-muted-foreground">Explore Ethiopia's rich mineral deposits and traditional materials</p>
                    <Button size="sm" className="mt-2">Explore</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
