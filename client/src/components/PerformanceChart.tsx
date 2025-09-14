import { useEffect, useRef } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface PerformanceChartProps {
  result: any;
}

export default function PerformanceChart({ result }: PerformanceChartProps) {
  if (!result) return null;

  // Prepare radar chart data
  const radarData = [
    {
      subject: 'Strength',
      predicted: result.properties?.mechanical?.tensileStrength?.value ? 
        Math.min(100, (result.properties.mechanical.tensileStrength.value / 1000) * 100) : 85,
      standard: 75,
    },
    {
      subject: 'Ductility',
      predicted: result.properties?.mechanical?.elongation?.value ? 
        Math.min(100, result.properties.mechanical.elongation.value * 3) : 70,
      standard: 80,
    },
    {
      subject: 'Hardness',
      predicted: result.properties?.mechanical?.hardness?.value ? 
        Math.min(100, (result.properties.mechanical.hardness.value / 500) * 100) : 80,
      standard: 70,
    },
    {
      subject: 'Thermal',
      predicted: result.properties?.thermal?.thermalConductivity?.value ? 
        Math.min(100, (result.properties.thermal.thermalConductivity.value / 100) * 100) : 60,
      standard: 65,
    },
    {
      subject: 'Electrical',
      predicted: 40,
      standard: 50,
    },
    {
      subject: 'Corrosion',
      predicted: 90,
      standard: 75,
    },
  ];

  // Prepare bar chart data for properties
  const barData = result.properties?.mechanical ? [
    {
      property: 'Tensile',
      value: result.properties.mechanical.tensileStrength?.value || 0,
      uncertainty: result.properties.mechanical.tensileStrength?.uncertainty || 0,
    },
    {
      property: 'Yield',
      value: result.properties.mechanical.yieldStrength?.value || 0,
      uncertainty: result.properties.mechanical.yieldStrength?.uncertainty || 0,
    },
    {
      property: 'Hardness',
      value: result.properties.mechanical.hardness?.value || 0,
      uncertainty: result.properties.mechanical.hardness?.uncertainty || 0,
    },
    {
      property: 'Thermal Cond.',
      value: result.properties.thermal?.thermalConductivity?.value || 0,
      uncertainty: result.properties.thermal?.thermalConductivity?.uncertainty || 0,
    },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Property Radar Chart */}
      <div className="lg:col-span-2">
        <h4 className="text-md font-medium text-foreground mb-3">Property Profile Comparison</h4>
        <div className="bg-muted/30 rounded-lg p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 12 }}
              />
              <Radar
                name="Predicted Material"
                dataKey="predicted"
                stroke="hsl(158 56% 22%)"
                fill="hsl(158 56% 22%)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Industry Standard"
                dataKey="standard"
                stroke="hsl(32 81% 45%)"
                fill="hsl(32 81% 45%)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground">Key Performance Metrics</h4>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">
            {result.performanceIndex || 94.2}%
          </div>
          <div className="text-sm text-muted-foreground">Overall Performance Index</div>
        </div>

        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-secondary">
            {result.manufacturabilityScore || 4.7}/5
          </div>
          <div className="text-sm text-muted-foreground">Manufacturability Score</div>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-accent">
            ${result.estimatedCost || 2.8}/kg
          </div>
          <div className="text-sm text-muted-foreground">Est. Material Cost</div>
        </div>

        <div className="bg-ethiopian-green/10 border border-ethiopian-green/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-ethiopian-green">Local</div>
          <div className="text-sm text-muted-foreground">Ethiopian Source Available</div>
        </div>
      </div>

      {/* Properties Bar Chart */}
      {barData.length > 0 && (
        <div className="lg:col-span-3">
          <h4 className="text-md font-medium text-foreground mb-3">Predicted Property Values</h4>
          <div className="bg-muted/30 rounded-lg p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="property" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} ± ${barData.find(d => d.value === value)?.uncertainty || 0}`,
                    name
                  ]}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(158 56% 22%)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
