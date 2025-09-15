import { useState } from "react";
import Layout from "@/components/Layout";
import PropertyForm from "@/components/PropertyForm";
import CompositionForm from "@/components/CompositionForm";
import PredictionResults from "@/components/PredictionResults";
import PerformanceChart from "@/components/PerformanceChart";
import EthiopianMaterials from "@/components/EthiopianMaterials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Atom, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"properties" | "composition">("properties");
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePredictionComplete = (result: any, id: string) => {
    setPredictionResult(result);
    setPredictionId(id);
  };

  const handleExportResults = async () => {
    if (!predictionId) {
      toast({
        title: "No Results to Export",
        description: "Please run a prediction first to export results.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/export/prediction/${predictionId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `material-prediction-${predictionId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Prediction results have been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export results. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="atomic-structure">
              <Atom className="h-8 w-8 text-blue-500 animate-atomic-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground material-text">Material Discovery</h2>
              <p className="text-muted-foreground mt-1">AI-powered material composition and property prediction</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleExportResults}
              disabled={!predictionResult}
              className="atomic-button h-12 px-6"
              data-testid="button-export-results"
            >
              <Download className="mr-2 h-5 w-5 animate-particle-drift" />
              📊 Export Results
            </Button>
            {predictionResult && (
              <Button 
                onClick={() => window.location.reload()}
                className="atomic-button h-12 px-6"
                variant="outline"
              >
                <Atom className="mr-2 h-5 w-5 animate-atomic-pulse" />
                🔄 New Analysis
              </Button>
            )}
          </div>
        </div>

        {/* Input Method Selection */}
        <Card className="molecular-card shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-2xl font-bold material-text">
              <Zap className="mr-4 h-8 w-8 animate-energy-wave" />
              🔬 Discovery Method
            </CardTitle>
            <p className="text-muted-foreground mt-2 text-lg">Choose your AI-powered material discovery approach</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                onClick={() => setActiveTab("properties")}
                className={`atomic-button h-16 text-lg font-bold transition-all duration-300 ${activeTab === "properties" ? "scale-105 shadow-xl" : "opacity-70 hover:opacity-90"}`}
                variant={activeTab === "properties" ? "default" : "outline"}
                data-testid="tab-properties-to-composition"
              >
                <div className="flex flex-col items-center">
                  <div className="text-2xl mb-1">🎯</div>
                  Properties → Composition
                </div>
              </Button>
              <Button
                onClick={() => setActiveTab("composition")}
                className={`atomic-button h-16 text-lg font-bold transition-all duration-300 ${activeTab === "composition" ? "scale-105 shadow-xl" : "opacity-70 hover:opacity-90"}`}
                variant={activeTab === "composition" ? "default" : "outline"}
                data-testid="tab-composition-to-properties"
              >
                <div className="flex flex-col items-center">
                  <div className="text-2xl mb-1">🧪</div>
                  Composition → Properties
                </div>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Forms */}
              <div>
                {activeTab === "properties" ? (
                  <PropertyForm onPredictionComplete={handlePredictionComplete} />
                ) : (
                  <CompositionForm onPredictionComplete={handlePredictionComplete} />
                )}
              </div>

              {/* Results */}
              <div>
                <PredictionResults 
                  result={predictionResult} 
                  predictionType={activeTab}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Analysis Dashboard */}
        {predictionResult && (
          <Card className="molecular-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="atomic-structure mr-3">
                  <Atom className="h-5 w-5 text-emerald-500 animate-molecular-float" />
                </div>
                Performance Analysis Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart result={predictionResult} />
            </CardContent>
          </Card>
        )}

        {/* Ethiopian Materials Database */}
        <EthiopianMaterials />
      </div>
    </Layout>
  );
}
