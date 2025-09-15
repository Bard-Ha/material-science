import OpenAI from "openai";
import type { PropertiesToCompositionRequest, CompositionToPropertiesRequest, PromptToPlanRequest } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-dummy-key"
});

// Check if we have a valid API key
const hasValidApiKey = (process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR) && 
  (process.env.OPENAI_API_KEY !== "" && process.env.OPENAI_API_KEY_ENV_VAR !== "");


export interface AICompositionPrediction {
  composition: Array<{ element: string; percentage: number }>;
  confidence: number;
  processParameters: {
    annealingTemperature?: string;
    coolingRate?: string;
    atmosphere?: string;
    coldWorkReduction?: string;
  };
  ethiopianMaterialsMatch?: Array<{
    materialName: string;
    matchPercentage: number;
    description: string;
  }>;
}

export interface AIPropertiesPrediction {
  properties: {
    mechanical: {
      tensileStrength?: { value: number; uncertainty: number };
      yieldStrength?: { value: number; uncertainty: number };
      youngsModulus?: { value: number; uncertainty: number };
      hardness?: { value: number; uncertainty: number };
      elongation?: { value: number; uncertainty: number };
      compressiveStrength?: { value: number; uncertainty: number };
      flexuralStrength?: { value: number; uncertainty: number };
      impactStrength?: { value: number; uncertainty: number };
      poissonsRatio?: { value: number; uncertainty: number };
    };
    thermal: {
      thermalConductivity?: { value: number; uncertainty: number };
      meltingPoint?: { value: number; uncertainty: number };
      boilingPoint?: { value: number; uncertainty: number };
      thermalExpansion?: { value: number; uncertainty: number };
      specificHeat?: { value: number; uncertainty: number };
      glassTransitionTemp?: { value: number; uncertainty: number };
      maxServiceTemp?: { value: number; uncertainty: number };
    };
    electrical?: {
      electricalResistivity?: { value: string; uncertainty: string };
      electricalConductivity?: { value: number; uncertainty: number };
      dielectricConstant?: { value: number; uncertainty: number };
      dielectricStrength?: { value: number; uncertainty: number };
    };
    optical?: {
      refractiveIndex?: { value: number; uncertainty: number };
      transparency?: string;
      reflectance?: { value: number; uncertainty: number };
      emissivity?: { value: number; uncertainty: number };
    };
    physical?: {
      density?: { value: number; uncertainty: number };
      porosity?: { value: number; uncertainty: number };
      viscosity?: { value: number; uncertainty: number };
      wettability?: string;
    };
    manufacturing?: {
      machinability?: string;
      weldability?: string;
      formability?: string;
      castability?: string;
    };
    environmental?: {
      weatherResistance?: string;
      uvResistance?: string;
      biodegradability?: string;
    };
  };
  confidence: number;
  performanceIndex: number;
  manufacturabilityScore: number;
  estimatedCost: number;
}

export interface AIPlanPrediction {
  composition: Array<{ element: string; percentage: number }>;
  structure: {
    microstructure: string;
    grainSize: string;
    phases: string[];
    crystallography: string;
  };
  processParameters: {
    primaryProcess: string;
    temperature: string;
    pressure?: string;
    atmosphere: string;
    duration: string;
    coolingRate: string;
    postProcessing?: string[];
  };
  properties: {
    mechanical: Record<string, { value: number; uncertainty: number } | string>;
    thermal: Record<string, { value: number; uncertainty: number } | string>;
    electrical?: Record<string, { value: number; uncertainty: number } | string>;
    physical: Record<string, { value: number; uncertainty: number } | string>;
  };
  confidence: number;
  applicationSuitability: number;
  ethiopianResourcesUsed: Array<{
    resource: string;
    percentage: number;
    availability: string;
  }>;
  manufacturingComplexity: "Low" | "Medium" | "High";
  estimatedCost: number;
}

export async function predictCompositionFromProperties(
  properties: PropertiesToCompositionRequest
): Promise<AICompositionPrediction> {
  // If no valid API key, return mock data
  if (!hasValidApiKey) {
    return {
      composition: [
        { element: "Fe", percentage: 70.5 },
        { element: "C", percentage: 0.8 },
        { element: "Cr", percentage: 18.0 },
        { element: "Ni", percentage: 8.5 },
        { element: "Mn", percentage: 2.2 }
      ],
      confidence: 85,
      processParameters: {
        annealingTemperature: "1050-1100°C",
        coolingRate: "2-5°C/min",
        atmosphere: "Inert (Argon)",
        coldWorkReduction: "30-50%"
      },
      ethiopianMaterialsMatch: [{
        materialName: "Tigray Iron Ore",
        matchPercentage: 92,
        description: "High-quality iron ore with excellent Fe content suitable for steel production"
      }]
    };
  }

  const prompt = `You are an expert materials scientist specializing in Ethiopian materials and mineral resources. Given the following comprehensive material properties, predict the most likely material composition.

Properties provided across 8 categories:
- Mechanical Properties: ${properties.mechanicalProperties ? Object.keys(properties.mechanicalProperties).filter(key => properties.mechanicalProperties![key as keyof typeof properties.mechanicalProperties] !== undefined).join(', ') : 'None specified'}
- Thermal Properties: ${properties.thermalProperties ? Object.keys(properties.thermalProperties).filter(key => properties.thermalProperties![key as keyof typeof properties.thermalProperties] !== undefined).join(', ') : 'None specified'}
- Electrical Properties: ${properties.electricalProperties ? Object.keys(properties.electricalProperties).filter(key => properties.electricalProperties![key as keyof typeof properties.electricalProperties] !== undefined).join(', ') : 'None specified'}
- Optical Properties: ${properties.opticalProperties ? Object.keys(properties.opticalProperties).filter(key => properties.opticalProperties![key as keyof typeof properties.opticalProperties] !== undefined).join(', ') : 'None specified'}
- Chemical Properties: ${properties.chemicalProperties ? Object.keys(properties.chemicalProperties).filter(key => properties.chemicalProperties![key as keyof typeof properties.chemicalProperties] !== undefined).join(', ') : 'None specified'}
- Physical Properties: ${properties.physicalProperties ? Object.keys(properties.physicalProperties).filter(key => properties.physicalProperties![key as keyof typeof properties.physicalProperties] !== undefined).join(', ') : 'None specified'}
- Manufacturing Properties: ${properties.manufacturingProperties ? Object.keys(properties.manufacturingProperties).filter(key => properties.manufacturingProperties![key as keyof typeof properties.manufacturingProperties] !== undefined).join(', ') : 'None specified'}
- Environmental Properties: ${properties.environmentalProperties ? Object.keys(properties.environmentalProperties).filter(key => properties.environmentalProperties![key as keyof typeof properties.environmentalProperties] !== undefined).join(', ') : 'None specified'}

Full Property Data:
${JSON.stringify(properties, null, 2)}

Please provide your prediction in JSON format with the following structure:
{
  "composition": [
    {"element": "Fe", "percentage": 74.2},
    {"element": "C", "percentage": 0.8},
    {"element": "Cr", "percentage": 18.5},
    {"element": "Ni", "percentage": 6.5}
  ],
  "confidence": 87,
  "processParameters": {
    "annealingTemperature": "1050-1100°C",
    "coolingRate": "2-5°C/min",
    "atmosphere": "Inert (Argon)",
    "coldWorkReduction": "30-50%"
  },
  "ethiopianMaterialsMatch": [
    {
      "materialName": "Tigray Iron Ore",
      "matchPercentage": 95,
      "description": "Fe content: 65-75%, suitable for steel production"
    }
  ]
}

IMPORTANT: 
- Confidence should be a percentage (0-100)
- Consider ALL provided property categories in your analysis
- Prioritize Ethiopian mineral resources: Tigray Iron Ore, Ethiopian Gold, Lalibela Stone, and traditional materials
- Account for optical, physical, manufacturing, and environmental properties in addition to mechanical/thermal/electrical
- Focus on materials that can be sourced locally or processed using available Ethiopian resources`;

  // Using OpenAI for AI predictions
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert materials scientist with deep knowledge of Ethiopian mineral resources and traditional materials. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2048,
    });

    return JSON.parse(response.choices[0].message.content!);
}

export async function predictPropertiesFromComposition(
  composition: CompositionToPropertiesRequest
): Promise<AIPropertiesPrediction> {
  // If no valid API key, return mock data
  if (!hasValidApiKey) {
    return {
      properties: {
        mechanical: {
          tensileStrength: { value: 850, uncertainty: 45 },
          yieldStrength: { value: 620, uncertainty: 30 },
          youngsModulus: { value: 205, uncertainty: 10 },
          hardness: { value: 320, uncertainty: 25 },
          elongation: { value: 15, uncertainty: 2 }
        },
        thermal: {
          thermalConductivity: { value: 25, uncertainty: 3 },
          meltingPoint: { value: 1538, uncertainty: 20 },
          thermalExpansion: { value: 12.5, uncertainty: 1.0 }
        },
        physical: {
          density: { value: 7.85, uncertainty: 0.1 }
        },
        manufacturing: {
          machinability: "Good",
          weldability: "Excellent",
          formability: "Fair"
        },
        environmental: {
          weatherResistance: "Good",
          uvResistance: "Fair"
        }
      },
      confidence: 88,
      performanceIndex: 92.5,
      manufacturabilityScore: 4.2,
      estimatedCost: 3.1
    };
  }

  const prompt = `You are an expert materials scientist with comprehensive knowledge of material properties. Given the following material composition, predict the complete set of material properties with uncertainties across all major categories.

Composition provided:
${JSON.stringify(composition, null, 2)}

Please provide your prediction in JSON format with comprehensive properties across all categories:
{
  "properties": {
    "mechanical": {
      "tensileStrength": {"value": 850, "uncertainty": 45},
      "yieldStrength": {"value": 620, "uncertainty": 30},
      "youngsModulus": {"value": 205, "uncertainty": 10},
      "hardness": {"value": 320, "uncertainty": 25},
      "elongation": {"value": 15, "uncertainty": 2},
      "compressiveStrength": {"value": 1200, "uncertainty": 80},
      "flexuralStrength": {"value": 450, "uncertainty": 35},
      "impactStrength": {"value": 250, "uncertainty": 20},
      "poissonsRatio": {"value": 0.30, "uncertainty": 0.02}
    },
    "thermal": {
      "thermalConductivity": {"value": 25, "uncertainty": 3},
      "meltingPoint": {"value": 1538, "uncertainty": 20},
      "boilingPoint": {"value": 2750, "uncertainty": 100},
      "thermalExpansion": {"value": 12.5, "uncertainty": 1.0},
      "specificHeat": {"value": 450, "uncertainty": 25},
      "glassTransitionTemp": {"value": 150, "uncertainty": 10},
      "maxServiceTemp": {"value": 400, "uncertainty": 30}
    },
    "electrical": {
      "electricalResistivity": {"value": "1.68e-8", "uncertainty": "0.05e-8"},
      "electricalConductivity": {"value": 5.96e7, "uncertainty": 2.0e6},
      "dielectricConstant": {"value": 8.5, "uncertainty": 0.5},
      "dielectricStrength": {"value": 25, "uncertainty": 3}
    },
    "optical": {
      "refractiveIndex": {"value": 1.52, "uncertainty": 0.02},
      "transparency": "Opaque",
      "reflectance": {"value": 85, "uncertainty": 5},
      "emissivity": {"value": 0.85, "uncertainty": 0.05}
    },
    "physical": {
      "density": {"value": 7.85, "uncertainty": 0.1},
      "porosity": {"value": 15, "uncertainty": 3},
      "viscosity": {"value": 0.001, "uncertainty": 0.0002},
      "wettability": "Hydrophilic"
    },
    "manufacturing": {
      "machinability": "Good",
      "weldability": "Excellent",
      "formability": "Fair",
      "castability": "Good"
    },
    "environmental": {
      "weatherResistance": "Good",
      "uvResistance": "Fair",
      "biodegradability": "Low"
    }
  },
  "confidence": 92,
  "performanceIndex": 94.2,
  "manufacturabilityScore": 4.7,
  "estimatedCost": 2.8
}

IMPORTANT:
- Confidence should be a percentage (0-100)
- Predict properties across ALL 8 categories when possible based on composition
- Use established materials science correlations between composition and properties
- Consider Ethiopian manufacturing capabilities and cost context
- Include uncertainties for numerical values and appropriate categorical ratings for qualitative properties
- Ensure transparency values are one of: "Transparent", "Translucent", "Opaque"
- Ensure resistance/quality ratings are one of: "Excellent", "Good", "Fair", "Poor"
- Ensure wettability is one of: "Hydrophilic", "Hydrophobic", "Neutral"
- Ensure biodegradability is one of: "High", "Medium", "Low", "None"`;

  // Using OpenAI for AI predictions
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert materials scientist with knowledge of materials properties and Ethiopian manufacturing capabilities. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2048,
    });

    return JSON.parse(response.choices[0].message.content!);
}

export async function predictPlanFromPrompt(
  promptData: PromptToPlanRequest
): Promise<AIPlanPrediction> {
  // If no valid API key, return mock data
  if (!hasValidApiKey) {
    return {
      composition: [
        { element: "Ti", percentage: 90.0 },
        { element: "Al", percentage: 6.0 },
        { element: "V", percentage: 4.0 }
      ],
      structure: {
        microstructure: "Alpha-beta titanium alloy with fine equiaxed grains",
        grainSize: "10-25 micrometers",
        phases: ["Alpha phase (HCP)", "Beta phase (BCC)"],
        crystallography: "Dual-phase hexagonal/body-centered cubic"
      },
      processParameters: {
        primaryProcess: "Vacuum Arc Melting + Hot Working",
        temperature: "950-1000°C",
        pressure: "10^-3 Pa vacuum",
        atmosphere: "Inert argon or vacuum",
        duration: "4-6 hours",
        coolingRate: "Controlled cooling at 50°C/hour",
        postProcessing: ["Solution treatment", "Aging at 480°C", "Stress relief"]
      },
      properties: {
        mechanical: {
          tensileStrength: { value: 950, uncertainty: 50 },
          yieldStrength: { value: 880, uncertainty: 40 },
          youngsModulus: { value: 114, uncertainty: 5 },
          elongation: { value: 14, uncertainty: 2 }
        },
        thermal: {
          meltingPoint: { value: 1668, uncertainty: 10 },
          thermalConductivity: { value: 7.2, uncertainty: 0.5 },
          thermalExpansion: { value: 8.6, uncertainty: 0.3 }
        },
        physical: {
          density: { value: 4.43, uncertainty: 0.05 }
        }
      },
      confidence: 89,
      applicationSuitability: 93,
      ethiopianResourcesUsed: [{
        resource: "Ethiopian Titanium Deposits (Yubdo)",
        percentage: 85,
        availability: "Limited but accessible"
      }],
      manufacturingComplexity: "Medium",
      estimatedCost: 45.2
    };
  }

  const prompt = `You are an expert materials scientist and engineering consultant specializing in Ethiopian materials and manufacturing capabilities. Based on the following user requirements, design a complete material solution including composition, structure, manufacturing process, and predicted properties.

User Requirements:
Purpose/Function: ${promptData.purpose}
Performance Requirements: ${promptData.performanceRequirements || "Not specified"}
Material Constraints: ${promptData.materialConstraints || "None specified"}
Environmental Conditions: ${promptData.environmentalConditions || "Standard conditions"}
Additional Description: ${promptData.additionalDescription || "None provided"}

Please provide a comprehensive material design solution in JSON format with composition, structure, process parameters, properties, confidence, application suitability, Ethiopian resources used, manufacturing complexity, and estimated cost.

IMPORTANT Requirements:
- Prioritize Ethiopian mineral resources and traditional materials where possible
- Consider local manufacturing capabilities and infrastructure
- Provide realistic cost estimates in Ethiopian Birr per kg
- Include uncertainty values for all numerical properties
- Ensure manufacturingComplexity is one of: "Low", "Medium", "High"
- Focus on practical, implementable solutions using available Ethiopian resources`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert materials scientist with comprehensive knowledge of Ethiopian resources, manufacturing capabilities, and material design. Always respond with valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 3000,
  });

  return JSON.parse(response.choices[0].message.content!);
}