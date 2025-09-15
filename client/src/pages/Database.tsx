import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Database,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Atom,
  Beaker,
  Zap,
} from "lucide-react";

interface Material {
  id: string;
  name: string;
  composition: string;
  category: string;
  properties: {
    tensileStrength?: number;
    density?: number;
    meltingPoint?: number;
  };
  source: string;
  applications: string[];
}

export default function DatabasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const { data: materialsData, isLoading, refetch } = useQuery<{ success: boolean; materials: Material[] }>({
    queryKey: ["/api/materials"],
  });

  const materials: Material[] = materialsData?.materials || [
    {
      id: "1",
      name: "Ethiopian Gold Alloy",
      composition: "Au 92%, Ag 5%, Cu 3%",
      category: "Precious Metals",
      properties: { density: 18.5, meltingPoint: 1050 },
      source: "Sidamo Region",
      applications: ["Jewelry", "Electronics"]
    },
    {
      id: "2", 
      name: "Volcanic Rock Composite",
      composition: "SiO2 45%, Al2O3 15%, FeO 12%",
      category: "Ceramics",
      properties: { tensileStrength: 150, density: 2.8 },
      source: "Rift Valley",
      applications: ["Construction", "Insulation"]
    }
  ];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = searchTerm === "" || 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.composition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || material.category === categoryFilter;
    const matchesSource = sourceFilter === "all" || material.source.includes(sourceFilter);
    
    return matchesSearch && matchesCategory && matchesSource;
  });

  const categories = Array.from(new Set(materials.map(m => m.category)));
  const sources = Array.from(new Set(materials.map(m => m.source)));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="atomic-structure">
              <Database className="h-8 w-8 text-emerald-500 animate-atomic-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold material-text">Material Database</h2>
              <p className="text-muted-foreground mt-1">
                Comprehensive repository of materials and their properties
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button size="sm" className="atomic-button">
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="molecular-card hover:animate-atomic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Materials</p>
                  <p className="text-2xl font-bold text-foreground">{materials.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Beaker className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="molecular-card hover:animate-atomic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100">
                  <Atom className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="molecular-card hover:animate-atomic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ethiopian Sources</p>
                  <p className="text-2xl font-bold text-foreground">{sources.length}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <span className="text-xl">🇪🇹</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="molecular-card hover:animate-atomic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Database Size</p>
                  <p className="text-2xl font-bold text-foreground">2.4GB</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Database className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="molecular-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="molecular-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Atom className="mr-2 h-5 w-5 text-primary animate-molecular-float" />
                    {material.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {material.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Composition</p>
                  <p className="text-sm text-foreground bg-muted/30 p-2 rounded">{material.composition}</p>
                </div>
                
                {material.properties && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Properties</p>
                    <div className="space-y-2">
                      {material.properties.tensileStrength && (
                        <div className="flex justify-between">
                          <span className="text-sm">Tensile Strength:</span>
                          <span className="text-sm font-medium">{material.properties.tensileStrength} MPa</span>
                        </div>
                      )}
                      {material.properties.density && (
                        <div className="flex justify-between">
                          <span className="text-sm">Density:</span>
                          <span className="text-sm font-medium">{material.properties.density} g/cm³</span>
                        </div>
                      )}
                      {material.properties.meltingPoint && (
                        <div className="flex justify-between">
                          <span className="text-sm">Melting Point:</span>
                          <span className="text-sm font-medium">{material.properties.meltingPoint}°C</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Source</p>
                  <p className="text-sm text-foreground">🇪🇹 {material.source}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Applications</p>
                  <div className="flex flex-wrap gap-1">
                    {material.applications.map((app) => (
                      <Badge key={app} variant="secondary" className="text-xs">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1 atomic-button">
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card className="molecular-card">
            <CardContent className="p-12 text-center">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">No materials found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}