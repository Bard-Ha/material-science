import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptToPlanSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, Target, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PromptToPlanRequest } from "@shared/schema";

interface PromptFormProps {
  onPredictionComplete: (result: any, id: string) => void;
}

export default function PromptForm({ onPredictionComplete }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PromptToPlanRequest>({
    resolver: zodResolver(promptToPlanSchema),
    defaultValues: {
      purpose: "",
      performanceRequirements: "",
      materialConstraints: "",
      environmentalConditions: "",
      additionalDescription: "",
    },
  });

  const onSubmit = async (data: PromptToPlanRequest) => {
    setIsLoading(true);
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await apiRequest("POST", "/api/predict/plan", {
        userId: userData.id,
        promptData: data,
      });

      const result = await response.json();
      
      if (result.success) {
        onPredictionComplete(result.prediction, result.id);
        toast({
          title: "Material Plan Generated!",
          description: `Complete material solution predicted with ${result.prediction.confidence}% confidence.`,
        });
      } else {
        throw new Error(result.error || "Prediction failed");
      }
    } catch (error) {
      console.error("Prompt prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Unable to generate material plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-foreground material-text">🚀 AI Material Planner</h4>
        <p className="text-sm text-muted-foreground mt-1">Describe what you need and get complete material recommendations</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Purpose/Function */}
          <Card className="property-card animate-molecular-border shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center">
                <Target className="mr-3 h-5 w-5 text-primary" />
                Purpose & Function
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">What is the intended use or application?</p>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Describe the intended purpose, function, or application</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., I need a lightweight material for aerospace components that can withstand high temperatures and resist corrosion..."
                        rows={4}
                        {...field}
                        data-testid="input-purpose"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Performance Requirements */}
          <Card className="property-card animate-molecular-border shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center">
                <Sparkles className="mr-3 h-5 w-5 text-primary" />
                Performance Requirements
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">What performance characteristics do you need?</p>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="performanceRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Performance criteria (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., High strength-to-weight ratio, excellent fatigue resistance, operating temperature up to 800°C..."
                        rows={3}
                        {...field}
                        data-testid="input-performance"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Material Constraints */}
            <Card className="property-card animate-molecular-border shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Settings className="mr-3 h-5 w-5 text-primary" />
                  Material Constraints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="materialConstraints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Constraints or preferences (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Must be non-toxic, recyclable, cost-effective, locally available in Ethiopia..."
                          rows={3}
                          {...field}
                          data-testid="input-constraints"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Environmental Conditions */}
            <Card className="property-card animate-molecular-border shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Brain className="mr-3 h-5 w-5 text-primary" />
                  Operating Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="environmentalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Environmental conditions (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Outdoor use, high humidity, UV exposure, marine environment, chemical exposure..."
                          rows={3}
                          {...field}
                          data-testid="input-environment"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Additional Description */}
          <Card className="property-card animate-molecular-border shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center">
                <Brain className="mr-3 h-5 w-5 text-primary" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="additionalDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Any other relevant information (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Budget considerations, timeline, specific manufacturing processes, regulatory requirements..."
                        rows={3}
                        {...field}
                        data-testid="input-additional"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full max-w-md bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-gradient-x"
              data-testid="button-generate-plan"
            >
              {isLoading ? (
                <>
                  <Brain className="mr-2 h-5 w-5 animate-spin" />
                  Generating Material Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Complete Material Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}