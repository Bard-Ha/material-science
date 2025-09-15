import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Atom, Award, Factory, MapPin, Cog, Thermometer, Zap, Settings } from "lucide-react";

interface PredictionResultsProps {
  result: any;
  predictionType: "properties" | "composition" | "prompt-to-plan";
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
      ) : predictionType === "composition" ? (
        <PropertiesResults result={result} />
      ) : (
        <PlanResults result={result} />
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
              <Factory className="mr-2 h-4 w-4 text-orange-500" />
              Recommended Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="process-parameters">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {result.processParameters.annealingTemperature && (
                <div>
                  <span className="font-medium text-muted-foreground">Annealing Temp:</span>
                  <p className="text-foreground">{result.processParameters.annealingTemperature}</p>
                </div>
              )}
              {result.processParameters.coolingRate && (
                <div>
                  <span className="font-medium text-muted-foreground">Cooling Rate:</span>
                  <p className="text-foreground">{result.processParameters.coolingRate}</p>
                </div>
              )}
              {result.processParameters.atmosphere && (
                <div>
                  <span className="font-medium text-muted-foreground">Atmosphere:</span>
                  <p className="text-foreground">{result.processParameters.atmosphere}</p>
                </div>
              )}
              {result.processParameters.coldWorkReduction && (
                <div>
                  <span className="font-medium text-muted-foreground">Cold Work Reduction:</span>
                  <p className="text-foreground">{result.processParameters.coldWorkReduction}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ethiopian Materials Match */}
      {result.ethiopianMaterialsMatch && result.ethiopianMaterialsMatch.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-green-600" />
              Ethiopian Materials Match
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3" data-testid="ethiopian-materials-match">
            {result.ethiopianMaterialsMatch.map((material: any, index: number) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">{material.materialName}</div>
                    <div className="text-xs text-muted-foreground mt-1">{material.description}</div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {material.matchPercentage}% match
                  </Badge>
                </div>
              </div>
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
      {/* Material Properties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Cog className="mr-2 h-4 w-4 text-primary" />
            Predicted Material Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="properties-results">
          {/* Mechanical Properties */}
          {result.properties?.mechanical && (
            <div>
              <h6 className="font-medium text-sm mb-2 text-blue-600">Mechanical Properties</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(result.properties.mechanical).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-foreground">
                      {typeof value === 'object' && value.value !== undefined 
                        ? `${value.value} ± ${value.uncertainty}` 
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Thermal Properties */}
          {result.properties?.thermal && (
            <div>
              <h6 className="font-medium text-sm mb-2 text-red-600">Thermal Properties</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(result.properties.thermal).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-foreground">
                      {typeof value === 'object' && value.value !== undefined 
                        ? `${value.value} ± ${value.uncertainty}` 
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Physical Properties */}
          {result.properties?.physical && (
            <div>
              <h6 className="font-medium text-sm mb-2 text-purple-600">Physical Properties</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(result.properties.physical).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-foreground">
                      {typeof value === 'object' && value.value !== undefined 
                        ? `${value.value} ± ${value.uncertainty}` 
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manufacturing Properties */}
          {result.properties?.manufacturing && (
            <div>
              <h6 className="font-medium text-sm mb-2 text-orange-600">Manufacturing Properties</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(result.properties.manufacturing).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Environmental Properties */}
          {result.properties?.environmental && (
            <div>
              <h6 className="font-medium text-sm mb-2 text-green-600">Environmental Properties</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(result.properties.environmental).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
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

function PlanResults({ result }: { result: any }) {
  return (
    <>
      {/* Predicted Composition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Atom className="mr-2 h-4 w-4 text-primary" />
            Material Composition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3" data-testid="plan-composition-results">
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

      {/* Material Structure */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Settings className="mr-2 h-4 w-4 text-blue-500" />
            Material Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2" data-testid="plan-structure-results">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Microstructure:</span>
              <p className="text-foreground">{result.structure?.microstructure}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Grain Size:</span>
              <p className="text-foreground">{result.structure?.grainSize}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Crystallography:</span>
              <p className="text-foreground">{result.structure?.crystallography}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Phases:</span>
              <p className="text-foreground">{result.structure?.phases?.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Parameters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Factory className="mr-2 h-4 w-4 text-orange-500" />
            Manufacturing Process
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2" data-testid="plan-process-results">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Primary Process:</span>
              <p className="text-foreground">{result.processParameters?.primaryProcess}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Temperature:</span>
              <p className="text-foreground">{result.processParameters?.temperature}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Atmosphere:</span>
              <p className="text-foreground">{result.processParameters?.atmosphere}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Duration:</span>
              <p className="text-foreground">{result.processParameters?.duration}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Cooling Rate:</span>
              <p className="text-foreground">{result.processParameters?.coolingRate}</p>
            </div>
            {result.processParameters?.pressure && (
              <div>
                <span className="font-medium text-muted-foreground">Pressure:</span>
                <p className="text-foreground">{result.processParameters.pressure}</p>
              </div>
            )}
          </div>
          {result.processParameters?.postProcessing && result.processParameters.postProcessing.length > 0 && (
            <div className="mt-3">
              <span className="font-medium text-muted-foreground block mb-1">Post-Processing:</span>
              <div className="flex flex-wrap gap-1">
                {result.processParameters.postProcessing.map((step: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {step}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Properties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Cog className="mr-2 h-4 w-4 text-green-500" />
            Predicted Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="plan-properties-results">
          {/* Mechanical Properties */}
          {result.properties?.mechanical && (
            <div>
              <h6 className="font-medium text-sm mb-2 text-blue-600">Mechanical Properties</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(result.properties.mechanical).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-foreground">
                      {typeof value === 'object' && value.value !== undefined 
                        ? `${value.value} ± ${value.uncertainty}` 
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Thermal Properties */}
          {result.properties?.thermal && (
            <div>
              <h6 className="font-medium text-sm mb-2 text-red-600">Thermal Properties</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(result.properties.thermal).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-foreground">
                      {typeof value === 'object' && value.value !== undefined 
                        ? `${value.value} ± ${value.uncertainty}` 
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Physical Properties */}
          {result.properties?.physical && (
            <div>
              <h6 className="font-medium text-sm mb-2 text-purple-600">Physical Properties</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(result.properties.physical).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-foreground">
                      {typeof value === 'object' && value.value !== undefined 
                        ? `${value.value} ± ${value.uncertainty}` 
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ethiopian Resources & Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-green-600" />
              Ethiopian Resources Used
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="plan-resources-results">
            {result.ethiopianResourcesUsed?.map((resource: any, index: number) => (
              <div key={index} className="border-l-2 border-green-500 pl-3">
                <div className="font-medium text-sm">{resource.resource}</div>
                <div className="text-xs text-muted-foreground">
                  {resource.percentage}% utilization • {resource.availability}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="mr-2 h-4 w-4 text-yellow-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3" data-testid="plan-metrics-results">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{result.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-500">{result.applicationSuitability}%</div>
                <div className="text-xs text-muted-foreground">Application Fit</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-500">{result.manufacturingComplexity}</div>
                <div className="text-xs text-muted-foreground">Complexity</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-500">{result.estimatedCost} ETB/kg</div>
                <div className="text-xs text-muted-foreground">Est. Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}