import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Activity,
  Cpu,
  Atom,
  Beaker,
  FlaskConical,
} from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  type: string;
  status: "active" | "training" | "idle" | "error";
  accuracy: number;
  lastTrained: string;
  predictions: number;
  version: string;
}

export default function AILabPage() {
  const [selectedModel, setSelectedModel] = useState<string>("gpt5");

  const models: AIModel[] = [
    {
      id: "gpt5",
      name: "OpenAI GPT-5",
      type: "Large Language Model",
      status: "active",
      accuracy: 95.2,
      lastTrained: "2024-09-10",
      predictions: 1247,
      version: "5.0.1"
    },
    {
      id: "materials-nn",
      name: "Materials Neural Network",
      type: "Specialized Neural Network",
      status: "training",
      accuracy: 87.8,
      lastTrained: "2024-09-12",
      predictions: 856,
      version: "2.1.0"
    },
    {
      id: "composition-ai",
      name: "Composition Predictor",
      type: "Regression Model",
      status: "idle",
      accuracy: 91.5,
      lastTrained: "2024-09-08",
      predictions: 423,
      version: "1.5.2"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "training": return "bg-blue-500";
      case "idle": return "bg-yellow-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      training: "bg-blue-100 text-blue-800",
      idle: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="atomic-structure">
              <Brain className="h-8 w-8 text-blue-500 animate-atomic-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold material-text">AI Laboratory</h2>
              <p className="text-muted-foreground mt-1">
                Manage and monitor AI models for material discovery
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button size="sm" className="atomic-button">
              <Play className="h-4 w-4 mr-2" />
              Train New Model
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="molecular-card hover:animate-atomic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                  <p className="text-2xl font-bold text-foreground">
                    {models.filter(m => m.status === "active").length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Cpu className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="molecular-card hover:animate-atomic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Predictions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {models.reduce((sum, m) => sum + m.predictions, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="molecular-card hover:animate-atomic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="molecular-card hover:animate-atomic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Training Status</p>
                  <p className="text-2xl font-bold text-foreground">
                    {models.filter(m => m.status === "training").length} Running
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Brain className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Models Management */}
        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            <Card className="molecular-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Beaker className="mr-2 h-5 w-5 animate-molecular-float" />
                  AI Model Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {models.map((model) => (
                    <Card key={model.id} className="molecular-card hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold flex items-center">
                            <Atom className="mr-2 h-5 w-5 text-primary animate-atomic-pulse" />
                            {model.name}
                          </CardTitle>
                          <Badge className={getStatusBadge(model.status)}>
                            {model.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{model.type}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Accuracy</span>
                            <span className="font-medium">{model.accuracy}%</span>
                          </div>
                          <Progress value={model.accuracy} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Version</p>
                            <p className="font-medium">{model.version}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Predictions</p>
                            <p className="font-medium">{model.predictions}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Last Trained</p>
                          <p className="text-sm font-medium">{model.lastTrained}</p>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          {model.status === "active" ? (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="flex-1">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retrain
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card className="molecular-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 animate-molecular-float" />
                  Training Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-atomic-pulse" />
                    <h3 className="text-xl font-semibold mb-2">Training Environment</h3>
                    <p className="text-muted-foreground">Configure and monitor AI model training processes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="molecular-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 animate-molecular-float" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <FlaskConical className="h-16 w-16 mx-auto mb-4 text-emerald-500 animate-molecular-float" />
                    <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
                    <p className="text-muted-foreground">Analyze AI model performance and accuracy trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}