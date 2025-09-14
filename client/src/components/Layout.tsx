import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Atom, Bell, BarChart3, Zap, Database, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LayoutProps {
  children: ReactNode;
}

interface NavLinkProps {
  href: string;
  icon: any;
  children: ReactNode;
}

function NavLink({ href, icon: Icon, children }: NavLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href}>
      <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
        isActive 
          ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white' 
          : 'text-purple-300 hover:text-white hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30'
      }`}>
        <Icon className="h-4 w-4" />
        <span className="font-medium">{children}</span>
      </div>
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background quantum effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Atom className="text-white text-xl animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Simien Materials AI</h1>
                <p className="text-xs text-purple-300/80">Quantum Material Discovery Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <NavLink href="/dashboard" icon={Zap}>Dashboard</NavLink>
              <NavLink href="/analysis" icon={BarChart3}>Analysis</NavLink>
              <NavLink href="#database" icon={Database}>Database</NavLink>
              <NavLink href="#ai" icon={Brain}>AI Lab</NavLink>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">AM</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-72 bg-black/30 backdrop-blur-md border-r border-purple-500/20 min-h-screen">
          <div className="p-6">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wide flex items-center">
                  <Sparkles className="h-3 w-3 mr-2" />
                  Quantum Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <span className="text-sm text-purple-200">AI Predictions Today</span>
                    <span className="text-lg font-bold text-cyan-400">47</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-sm text-green-200">Success Rate</span>
                    <span className="text-lg font-bold text-green-400">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <span className="text-sm text-blue-200">Ethiopian Materials</span>
                    <span className="text-lg font-bold text-blue-400">1,247</span>
                  </div>
                </div>
              </div>

              {/* Recent Searches */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wide flex items-center">
                  <Brain className="h-3 w-3 mr-2" />
                  Recent Quantum Analysis
                </h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 rounded-lg">
                    <div className="text-left">
                      <div className="text-sm font-medium text-purple-100">High-strength Steel</div>
                      <div className="text-xs text-purple-400">Tensile: 800-1200 MPa</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 rounded-lg">
                    <div className="text-left">
                      <div className="text-sm font-medium text-cyan-100">Thermal Barrier Coating</div>
                      <div className="text-xs text-cyan-400">1400°C resistance</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-green-500/10 border border-transparent hover:border-green-500/30 rounded-lg">
                    <div className="text-left">
                      <div className="text-sm font-medium text-green-100">Conductive Polymer</div>
                      <div className="text-xs text-green-400">σ: 10³ S/m</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Ethiopian Materials Focus */}
              <Card className="bg-gradient-to-br from-emerald-500/20 via-yellow-500/20 to-red-500/20 border border-yellow-500/30 shadow-lg">
                <CardContent className="p-4">
                  <div className="bg-black/40 backdrop-blur-sm rounded-md p-4 border border-yellow-500/20">
                    <h4 className="text-sm font-medium text-yellow-300 mb-2 flex items-center">
                      🇪🇹 <span className="ml-2">Quantum Local Resources</span>
                    </h4>
                    <p className="text-xs text-yellow-200/80">Explore Ethiopia's rich mineral deposits with AI-powered analysis</p>
                    <Button size="sm" className="mt-3 bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-medium hover:from-emerald-600 hover:to-yellow-600">
                      Quantum Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-black/10 to-purple-900/10 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
