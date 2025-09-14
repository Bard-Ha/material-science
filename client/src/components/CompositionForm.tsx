import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { compositionToPropertiesSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CompositionToPropertiesRequest } from "@shared/schema";

interface CompositionFormProps {
  onPredictionComplete: (result: any, id: string) => void;
}

export default function CompositionForm({ onPredictionComplete }: CompositionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CompositionToPropertiesRequest>({
    resolver: zodResolver(compositionToPropertiesSchema),
    defaultValues: {
      elements: [
        { element: "Fe", percentage: 74.5 },
        { element: "C", percentage: 0.8 },
        { element: "Cr", percentage: 18.0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "elements",
  });

  const addElement = () => {
    append({ element: "", percentage: 0 });
  };

  const onSubmit = async (data: CompositionToPropertiesRequest) => {
    // Validate total percentage
    const totalPercentage = data.elements.reduce((sum, element) => sum + element.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.1) {
      toast({
        title: "Invalid Composition",
        description: `Total percentage must equal 100%. Current total: ${totalPercentage.toFixed(1)}%`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/predict/properties", {
        composition: data,
      });

      const result = await response.json();
      
      if (result.success) {
        onPredictionComplete(result.prediction, result.id);
        toast({
          title: "Prediction Successful",
          description: `Material properties predicted with ${result.prediction.confidence}% confidence.`,
        });
      } else {
        throw new Error(result.error || "Prediction failed");
      }
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Unable to predict properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPercentage = form.watch("elements").reduce((sum, element) => sum + (element.percentage || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-foreground">Input Material Composition</h4>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Element Composition (%)</CardTitle>
              <div className="text-xs text-muted-foreground">
                Total: {totalPercentage.toFixed(1)}% 
                {Math.abs(totalPercentage - 100) > 0.1 && (
                  <span className="text-destructive ml-2">Must equal 100%</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-5 gap-2 items-end">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`elements.${index}.element`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel className="text-xs">Element</FormLabel>}
                          <FormControl>
                            <Input 
                              placeholder="e.g., Fe" 
                              {...field}
                              data-testid={`input-element-${index}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`elements.${index}.percentage`}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && <FormLabel className="text-xs">Percentage</FormLabel>}
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="%" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                              data-testid={`input-percentage-${index}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        data-testid={`button-remove-element-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addElement}
                className="w-full"
                data-testid="button-add-element"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Element
              </Button>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || Math.abs(totalPercentage - 100) > 0.1}
            data-testid="button-predict-properties"
          >
            <Calculator className="mr-2 h-4 w-4" />
            {isLoading ? "Predicting Properties..." : "Predict Properties"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
