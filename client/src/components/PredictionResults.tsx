import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Atom, Award, Factory, MapPin } from "lucide-react";

interface PredictionResultsProps {
  result: any;
  predictionType: "properties" | "composition";
}

export default function PredictionResults({ result, predictionType }: PredictionResultsProps) {
  if (!result) {
    return (
      <div className="space-y-6">
        <h4 className="text-md font-semibold text-foreground">AI Prediction Results</h4>
        <div className="text-center py-8 text-muted-foreground">
          <Atom className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Run a prediction to see results here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h4 className="text-md font-semibold text-foreground">AI Prediction Results</h4>
      
      {predictionType === "properties" ? (
        <CompositionResults result={result} />
      ) : (
        <PropertiesResults result={result} />
      )}
    </div>
  );
}

function CompositionResults({ result }: { result: any }) {
  return (
    <>
      {/* Predicted Composition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Atom className="mr-2 h-4 w-4 text-primary" />
            Predicted Composition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3" data-testid="composition-results">
          {result.composition?.map((element: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{element.element}</span>
                <span className="text-sm font-medium">{element.percentage}%</span>
              </div>
              <Progress value={element.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Confidence Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Prediction Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Progress value={result.confidence} className="flex-1 h-3" />
            <span className="text-lg font-bold text-accent" data-testid="confidence-score">
              {result.confidence}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            High confidence based on 15,000+ material samples
          </p>
        </CardContent>
      </Card>

      {/* Process Parameters */}
      {result.processParameters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Factory className="mr-2 h-4 w-4 text-secondary" />
              Recommended Process Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3" data-testid="process-parameters">
            {Object.entries(result.processParameters).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-medium">{value as string}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Ethiopian Materials Match */}
      {result.ethiopianMaterialsMatch && result.ethiopianMaterialsMatch.length > 0 && (
        <Card className="bg-gradient-to-r from-ethiopian-green/10 to-ethiopian-yellow/10 border-ethiopian-green/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              🇪🇹 Ethiopian Materials Database Match
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="ethiopian-materials-match">
            {result.ethiopianMaterialsMatch.map((match: any, index: number) => (
              <Card key={index} className="bg-card">
                <CardContent className="p-3">
                  <div className="text-sm font-medium text-foreground">{match.materialName}</div>
                  <div className="text-xs text-muted-foreground">{match.description}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {match.matchPercentage}% composition match
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}

function PropertiesResults({ result }: { result: any }) {
  return (
    <>
      {/* Predicted Properties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Property Predictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3" data-testid="properties-results">
          {result.properties?.mechanical && (
            <div className="space-y-2">
              <h6 className="text-xs font-medium text-muted-foreground uppercase">Mechanical</h6>
              {Object.entries(result.properties.mechanical).map(([key, prop]: [string, any]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {prop.value} ± {prop.uncertainty} 
                    {key.includes('Strength') || key.includes('Modulus') ? ' MPa' : 
                     key.includes('hardness') ? ' HV' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}

          {result.properties?.thermal && (
            <div className="space-y-2">
              <h6 className="text-xs font-medium text-muted-foreground uppercase">Thermal</h6>
              {Object.entries(result.properties.thermal).map(([key, prop]: [string, any]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-medium text-secondary">
                    {prop.value} ± {prop.uncertainty} 
                    {key.includes('Conductivity') ? ' W/m·K' : 
                     key.includes('Point') ? ' °C' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary" data-testid="performance-index">
              {result.performanceIndex}%
            </div>
            <div className="text-xs text-muted-foreground">Performance Index</div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary" data-testid="manufacturability-score">
              {result.manufacturabilityScore}/5
            </div>
            <div className="text-xs text-muted-foreground">Manufacturability</div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent" data-testid="estimated-cost">
              ${result.estimatedCost}/kg
            </div>
            <div className="text-xs text-muted-foreground">Est. Material Cost</div>
          </CardContent>
        </Card>

        <Card className="bg-ethiopian-green/10 border-ethiopian-green/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-ethiopian-green">
              {result.confidence}%
            </div>
            <div className="text-xs text-muted-foreground">Prediction Confidence</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
