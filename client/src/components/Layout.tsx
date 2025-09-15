import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Atom, Bell, BarChart3, Zap, Database, Brain, Sparkles, User, LogOut, Crown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AuthDialog from "./AuthDialog";
import SubscriptionDialog from "./SubscriptionDialog";

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
          ? 'bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 text-white' 
          : 'text-blue-300 hover:text-white hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30'
      }`}>
        <Icon className="h-4 w-4" />
        <span className="font-medium">{children}</span>
      </div>
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case "basic":
        return "bg-blue-500";
      case "professional":
        return "bg-yellow-500";
      case "enterprise":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background molecular effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-blue-500/20 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg atomic-structure">
                <Atom className="text-white text-xl animate-atomic-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Mat-Sci-AI</h1>
                <p className="text-xs text-blue-300/80">Advanced Material Discovery Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <NavLink href="/dashboard" icon={Zap}>Dashboard</NavLink>
              <NavLink href="/analysis" icon={BarChart3}>Analysis</NavLink>
              <NavLink href="/database" icon={Database}>Database</NavLink>
              <NavLink href="/ai-lab" icon={Brain}>AI Lab</NavLink>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" size="icon" className="text-blue-300 hover:text-white hover:bg-blue-500/20">
                    <Bell className="h-4 w-4" />
                  </Button>
                  {user.subscriptionTier !== "free" && (
                    <Badge className={`${getSubscriptionColor(user.subscriptionTier)} text-white`}>
                      {user.subscriptionTier}
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center space-x-2 text-blue-300 hover:text-white hover:bg-blue-500/20"
                        data-testid="user-menu-trigger"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs font-bold">
                            {user.firstName ? user.firstName[0].toUpperCase() : user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="hidden md:block">{user.firstName || user.username}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 bg-black/90 border border-blue-500/30 text-white"
                    >
                      <div className="px-2 py-1.5 text-sm text-blue-300">
                        Signed in as <span className="font-semibold">{user.email}</span>
                      </div>
                      <DropdownMenuSeparator className="bg-blue-500/20" />
                      <SubscriptionDialog user={user}>
                        <DropdownMenuItem 
                          className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20"
                          data-testid="menu-item-subscription"
                        >
                          <Crown className="mr-2 h-4 w-4" />
                          <span>Subscription</span>
                        </DropdownMenuItem>
                      </SubscriptionDialog>
                      <DropdownMenuItem 
                        className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20"
                        data-testid="menu-item-settings"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-blue-500/20" />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 text-red-300"
                        data-testid="menu-item-logout"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <AuthDialog defaultTab="login">
                    <Button 
                      variant="ghost" 
                      className="text-blue-300 hover:text-white hover:bg-blue-500/20"
                      data-testid="button-sign-in"
                    >
                      Sign In
                    </Button>
                  </AuthDialog>
                  <AuthDialog defaultTab="register">
                    <Button 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                      data-testid="button-sign-up"
                    >
                      Sign Up
                    </Button>
                  </AuthDialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-72 bg-black/30 backdrop-blur-md border-r border-blue-500/20 min-h-screen">
          <div className="p-6">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wide flex items-center">
                  <Sparkles className="h-3 w-3 mr-2" />
                  Material Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 molecular-card">
                    <span className="text-sm text-blue-200">AI Predictions Today</span>
                    <span className="text-lg font-bold text-emerald-400">47</span>
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
                <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wide flex items-center">
                  <Brain className="h-3 w-3 mr-2" />
                  Recent Analysis
                </h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 rounded-lg molecular-card">
                    <div className="text-left">
                      <div className="text-sm font-medium text-blue-100">High-strength Steel</div>
                      <div className="text-xs text-blue-400">Tensile: 800-1200 MPa</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 rounded-lg molecular-card">
                    <div className="text-left">
                      <div className="text-sm font-medium text-emerald-100">Thermal Barrier Coating</div>
                      <div className="text-xs text-emerald-400">1400°C resistance</div>
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
                      🇪🇹 <span className="ml-2">Local Resources</span>
                    </h4>
                    <p className="text-xs text-yellow-200/80">Explore Ethiopia's rich mineral deposits with AI-powered analysis</p>
                    <Button size="sm" className="mt-3 bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-medium hover:from-emerald-600 hover:to-yellow-600">
                      Explore Materials
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Upgrade Section */}
              {user && user.subscriptionTier === "free" && (
                <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg">
                  <CardContent className="p-4">
                    <div className="bg-black/40 backdrop-blur-sm rounded-md p-4 border border-blue-500/20">
                      <h4 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
                        <Crown className="h-4 w-4 mr-2 text-yellow-400" />
                        Upgrade Your Plan
                      </h4>
                      <p className="text-xs text-blue-200/80 mb-3">Unlock unlimited predictions and advanced features</p>
                      <SubscriptionDialog user={user}>
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600"
                          data-testid="button-upgrade-sidebar"
                        >
                          Upgrade Now
                        </Button>
                      </SubscriptionDialog>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sign Up Prompt for Non-Authenticated Users */}
              {!user && (
                <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 shadow-lg">
                  <CardContent className="p-4">
                    <div className="bg-black/40 backdrop-blur-sm rounded-md p-4 border border-emerald-500/20">
                      <h4 className="text-sm font-medium text-emerald-300 mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Join Mat-Sci-AI
                      </h4>
                      <p className="text-xs text-emerald-200/80 mb-3">Create an account to save your predictions and access premium features</p>
                      <AuthDialog defaultTab="register">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium hover:from-emerald-600 hover:to-blue-600"
                          data-testid="button-signup-sidebar"
                        >
                          Sign Up Free
                        </Button>
                      </AuthDialog>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-black/10 to-blue-900/10 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
