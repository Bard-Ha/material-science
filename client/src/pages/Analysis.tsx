import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Brain,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Search,
  Filter,
  Download,
  RefreshCw,
  Atom,
} from "lucide-react";

interface Prediction {
  id: string;
  predictionType: string;
  inputData: any;
  outputData: any;
  confidence: number;
  aiModel: string;
  createdAt: string;
}

export default function Analysis() {
  const [selectedAnalysis, setSelectedAnalysis] = useState("trends");
  const [filterPeriod, setFilterPeriod] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: predictionsData, isLoading, refetch } = useQuery<{ success: boolean; predictions: Prediction[] }>({
    queryKey: ["/api/predictions"],
  });

  const predictions = predictionsData?.predictions || [];

  // Filter predictions based on period and search
  const filteredPredictions = predictions.filter((prediction) => {
    const daysAgo = parseInt(filterPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    const predictionDate = new Date(prediction.createdAt);
    const matchesDate = predictionDate >= cutoffDate;
    
    const matchesSearch = searchTerm === "" || 
      JSON.stringify(prediction.inputData).toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(prediction.outputData).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesSearch;
  });

  // Analytics data preparation
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayPredictions = predictions.filter(p => {
      const pDate = new Date(p.createdAt);
      return pDate.toDateString() === date.toDateString();
    });
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      predictions: dayPredictions.length,
      avgConfidence: dayPredictions.length > 0 
        ? dayPredictions.reduce((sum, p) => sum + p.confidence, 0) / dayPredictions.length 
        : 0,
    };
  });

  const confidenceDistribution = [
    { range: '90-100%', count: predictions.filter(p => p.confidence >= 90).length },
    { range: '80-89%', count: predictions.filter(p => p.confidence >= 80 && p.confidence < 90).length },
    { range: '70-79%', count: predictions.filter(p => p.confidence >= 70 && p.confidence < 80).length },
    { range: '60-69%', count: predictions.filter(p => p.confidence >= 60 && p.confidence < 70).length },
    { range: '<60%', count: predictions.filter(p => p.confidence < 60).length },
  ];

  const predictionTypes = [
    { 
      name: 'Properties to Composition', 
      value: predictions.filter(p => p.predictionType === 'properties-to-composition').length,
      color: '#3b82f6'
    },
    { 
      name: 'Composition to Properties', 
      value: predictions.filter(p => p.predictionType === 'composition-to-properties').length,
      color: '#06b6d4'
    },
  ];

  const performanceMetrics = [
    {
      title: "Total Predictions",
      value: predictions.length,
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Average Confidence",
      value: predictions.length > 0 
        ? `${(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length).toFixed(1)}%`
        : "0%",
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "High Confidence (>85%)",
      value: predictions.filter(p => p.confidence > 85).length,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Materials",
      value: new Set(predictions.map(p => JSON.stringify(p.inputData))).size,
      icon: Zap,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];

  const renderAnalysisContent = () => {
    switch (selectedAnalysis) {
      case "trends":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="molecular-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Activity className="mr-2 h-5 w-5 animate-molecular-float" />
                  Prediction Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="predictions" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Daily Predictions"
                      dot={{ fill: '#3b82f6', r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgConfidence" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      name="Avg Confidence %"
                      dot={{ fill: '#06b6d4', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="molecular-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <BarChart3 className="mr-2 h-5 w-5 animate-molecular-float" />
                  Confidence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={confidenceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="range" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#confidenceGradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );

      case "performance":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Prediction Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={predictionTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {predictionTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Target className="mr-2 h-5 w-5" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">OpenAI GPT-5</span>
                    <Badge variant="default" className="bg-primary">Active</Badge>
                  </div>
                  <Progress value={95} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>Accuracy: 95%</div>
                    <div>Speed: 2.3s avg</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Predictions:</span>
                      <span className="font-medium">{predictions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-medium text-green-500">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Response Time:</span>
                      <span className="font-medium">2.3s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "materials":
        return (
          <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Brain className="mr-2 h-5 w-5" />
                Recent Material Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPredictions.slice(0, 10).map((prediction) => (
                  <div key={prediction.id} className="p-4 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <Badge 
                          variant="outline" 
                          className={prediction.predictionType === 'properties-to-composition' ? 'border-blue-300 text-blue-700' : 'border-emerald-300 text-emerald-700'}
                        >
                          {prediction.predictionType === 'properties-to-composition' ? 'Properties → Composition' : 'Composition → Properties'}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(prediction.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{prediction.confidence}%</div>
                        <div className="text-xs text-muted-foreground">Confidence</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="text-sm font-medium mb-1">Input Data</div>
                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded max-h-20 overflow-y-auto">
                          {JSON.stringify(prediction.inputData, null, 2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Prediction Result</div>
                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded max-h-20 overflow-y-auto">
                          {JSON.stringify(prediction.outputData, null, 2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredPredictions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No material analyses found for the selected criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="atomic-structure">
              <Atom className="h-8 w-8 text-emerald-500 animate-atomic-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold material-text">
                Material Analysis
              </h2>
              <p className="text-muted-foreground mt-1">
                Comprehensive insights and analytics for your material predictions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="molecular-card hover:shadow-lg transition-all duration-300 hover:animate-atomic-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="bg-gradient-to-r from-background to-muted/20 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="space-y-2">
                  <Label htmlFor="analysis-type" className="text-sm font-medium">Analysis Type</Label>
                  <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trends">Trends & Patterns</SelectItem>
                      <SelectItem value="performance">Model Performance</SelectItem>
                      <SelectItem value="materials">Material History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time-period" className="text-sm font-medium">Time Period</Label>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">Search Materials</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search predictions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Content */}
        {isLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-lg">Loading analysis data...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          renderAnalysisContent()
        )}
      </div>
    </Layout>
  );
}