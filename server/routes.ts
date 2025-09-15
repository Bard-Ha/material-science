import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  propertiesToCompositionSchema, 
  compositionToPropertiesSchema,
  insertMaterialPredictionSchema 
} from "@shared/schema";
import { predictCompositionFromProperties, predictPropertiesFromComposition } from "./services/aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Material prediction endpoints
  app.post("/api/predict/composition", async (req, res) => {
    try {
      const validatedData = propertiesToCompositionSchema.parse(req.body.properties);
      const prediction = await predictCompositionFromProperties(validatedData);
      
      // Store prediction
      const materialPrediction = await storage.createMaterialPrediction({
        userId: req.body.userId,
        predictionType: "properties-to-composition",
        inputData: validatedData,
        outputData: prediction,
        confidence: prediction.confidence,
        aiModel: "openai",
      });

      res.json({ success: true, prediction, id: materialPrediction.id });
    } catch (error) {
      console.error("Composition prediction error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to predict composition. Please check your input properties and try again." 
      });
    }
  });

  app.post("/api/predict/properties", async (req, res) => {
    try {
      const validatedData = compositionToPropertiesSchema.parse(req.body.composition);
      const prediction = await predictPropertiesFromComposition(validatedData);
      
      // Store prediction
      const materialPrediction = await storage.createMaterialPrediction({
        userId: req.body.userId,
        predictionType: "composition-to-properties",
        inputData: validatedData,
        outputData: prediction,
        confidence: prediction.confidence,
        aiModel: "openai",
      });

      res.json({ success: true, prediction, id: materialPrediction.id });
    } catch (error) {
      console.error("Properties prediction error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to predict properties. Please check your composition data and try again." 
      });
    }
  });

  // Get prediction history
  app.get("/api/predictions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const predictions = await storage.getUserPredictions(userId);
      res.json({ success: true, predictions });
    } catch (error) {
      console.error("Get predictions error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to retrieve prediction history." 
      });
    }
  });

  // Get specific prediction
  app.get("/api/predictions/:id", async (req, res) => {
    try {
      const prediction = await storage.getMaterialPrediction(req.params.id);
      if (!prediction) {
        return res.status(404).json({ 
          success: false, 
          error: "Prediction not found." 
        });
      }
      res.json({ success: true, prediction });
    } catch (error) {
      console.error("Get prediction error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to retrieve prediction." 
      });
    }
  });

  // Ethiopian materials endpoints
  app.get("/api/ethiopian-materials", async (req, res) => {
    try {
      const materials = await storage.getEthiopianMaterials();
      res.json({ success: true, materials });
    } catch (error) {
      console.error("Get Ethiopian materials error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to retrieve Ethiopian materials database." 
      });
    }
  });

  app.get("/api/ethiopian-materials/:id", async (req, res) => {
    try {
      const material = await storage.getEthiopianMaterial(req.params.id);
      if (!material) {
        return res.status(404).json({ 
          success: false, 
          error: "Ethiopian material not found." 
        });
      }
      res.json({ success: true, material });
    } catch (error) {
      console.error("Get Ethiopian material error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to retrieve Ethiopian material." 
      });
    }
  });

  // Export functionality
  app.post("/api/export/prediction/:id", async (req, res) => {
    try {
      const prediction = await storage.getMaterialPrediction(req.params.id);
      if (!prediction) {
        return res.status(404).json({ 
          success: false, 
          error: "Prediction not found for export." 
        });
      }

      const exportData = {
        predictionId: prediction.id,
        type: prediction.predictionType,
        inputData: prediction.inputData,
        results: prediction.outputData,
        confidence: prediction.confidence,
        aiModel: prediction.aiModel,
        generatedAt: prediction.createdAt,
        exportedAt: new Date().toISOString(),
        platform: "Mat-Sci-AI - Advanced Material Discovery Platform"
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="material-prediction-${prediction.id}.json"`);
      res.json(exportData);
    } catch (error) {
      console.error("Export prediction error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to export prediction data." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
