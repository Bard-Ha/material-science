import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  propertiesToCompositionSchema, 
  compositionToPropertiesSchema,
  promptToPlanSchema,
  insertMaterialPredictionSchema,
  registerUserSchema,
  loginUserSchema
} from "@shared/schema";
import { predictCompositionFromProperties, predictPropertiesFromComposition, predictPlanFromPrompt } from "./services/aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Material prediction endpoints
  app.post("/api/predict/composition", async (req, res) => {
    try {
      const parseResult = propertiesToCompositionSchema.safeParse(req.body.properties);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid properties data: " + parseResult.error.errors.map(e => e.message).join(", ")
        });
      }
      const prediction = await predictCompositionFromProperties(parseResult.data);
      
      // Store prediction
      const materialPrediction = await storage.createMaterialPrediction({
        userId: req.body.userId,
        predictionType: "properties-to-composition",
        inputData: parseResult.data,
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
      const parseResult = compositionToPropertiesSchema.safeParse(req.body.composition);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid composition data: " + parseResult.error.errors.map(e => e.message).join(", ")
        });
      }
      const prediction = await predictPropertiesFromComposition(parseResult.data);
      
      // Store prediction
      const materialPrediction = await storage.createMaterialPrediction({
        userId: req.body.userId,
        predictionType: "composition-to-properties",
        inputData: parseResult.data,
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

  // New prompt-to-plan prediction endpoint
  app.post("/api/predict/plan", async (req, res) => {
    try {
      const parseResult = promptToPlanSchema.safeParse(req.body.promptData);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid prompt data: " + parseResult.error.errors.map(e => e.message).join(", ")
        });
      }
      const prediction = await predictPlanFromPrompt(parseResult.data);
      
      // Store prediction
      const materialPrediction = await storage.createMaterialPrediction({
        userId: req.body.userId,
        predictionType: "prompt-to-plan",
        inputData: parseResult.data,
        outputData: prediction,
        confidence: prediction.confidence,
        aiModel: "openai",
      });

      res.json({ success: true, prediction, id: materialPrediction.id });
    } catch (error) {
      console.error("Plan prediction error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to predict material plan. Please check your requirements and try again." 
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

  // Authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "An account with this email already exists."
        });
      }

      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          error: "This username is already taken."
        });
      }

      const user = await storage.createUser(validatedData);
      
      // Don't return password in response
      const { password, ...userResponse } = user;
      res.status(201).json({ 
        success: true, 
        user: userResponse,
        message: "Account created successfully! Welcome to Mat-Sci-AI." 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create account. Please try again." 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password."
        });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });

      // Don't return password in response
      const { password, ...userResponse } = user;
      res.json({ 
        success: true, 
        user: userResponse,
        message: "Welcome back!" 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to sign in. Please try again." 
      });
    }
  });

  // Subscription endpoints
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json({ success: true, plans });
    } catch (error) {
      console.error("Get subscription plans error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to retrieve subscription plans." 
      });
    }
  });

  app.post("/api/payments/initiate", async (req, res) => {
    try {
      const { userId, planId, paymentMethod } = req.body;
      
      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        return res.status(404).json({
          success: false,
          error: "Subscription plan not found."
        });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found."
        });
      }

      // Create payment transaction
      const transaction = await storage.createPaymentTransaction({
        userId,
        planId,
        amount: plan.priceInBirr,
        currency: "ETB",
        paymentMethod,
        status: "pending"
      });

      // In a real implementation, you would integrate with Ethiopian payment APIs here
      // For now, we'll simulate payment processing
      const paymentResponse = await simulateEthiopianPayment(paymentMethod, plan.priceInBirr, transaction.id);

      res.json({ 
        success: true, 
        transaction,
        paymentInstructions: paymentResponse
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to initiate payment. Please try again." 
      });
    }
  });

  app.post("/api/payments/verify/:transactionId", async (req, res) => {
    try {
      const transaction = await storage.getPaymentTransaction(req.params.transactionId);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: "Transaction not found."
        });
      }

      // In a real implementation, verify with payment provider
      // For now, simulate verification
      const isVerified = await simulatePaymentVerification(transaction.paymentMethod, transaction.transactionId);

      if (isVerified) {
        // Update transaction status
        await storage.updatePaymentTransaction(transaction.id, { 
          status: "completed",
          completedAt: new Date()
        });

        // Update user subscription
        const plan = await storage.getSubscriptionPlan(transaction.planId);
        if (plan) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);
          
          await storage.updateUser(transaction.userId, {
            subscriptionTier: plan.name.toLowerCase(),
            subscriptionExpiry: expiryDate
          });
        }

        res.json({ 
          success: true, 
          message: "Payment verified successfully! Your subscription is now active.",
          status: "completed"
        });
      } else {
        await storage.updatePaymentTransaction(transaction.id, { status: "failed" });
        res.status(400).json({
          success: false,
          error: "Payment verification failed. Please try again."
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to verify payment." 
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

// Ethiopian payment simulation functions
async function simulateEthiopianPayment(paymentMethod: string, amount: number, transactionId: string) {
  const paymentInstructions: Record<string, any> = {
    telebirr: {
      shortCode: "*127#",
      steps: [
        "Dial *127# from your phone",
        "Select 'Pay Bills' option",
        "Enter Merchant Code: 500001",
        `Enter Amount: ${amount} ETB`,
        `Enter Reference: ${transactionId}`,
        "Confirm payment with PIN"
      ],
      estimatedTime: "2-5 minutes",
      supportPhone: "+251-911-123456"
    },
    mpesa: {
      shortCode: "*150#", 
      steps: [
        "Dial *150# from your phone",
        "Select 'Lipa na M-PESA'",
        "Enter Business Number: 247247",
        `Enter Amount: ${amount} ETB`,
        `Enter Account Reference: ${transactionId}`,
        "Enter PIN and confirm"
      ],
      estimatedTime: "1-3 minutes",
      supportPhone: "+251-700-100200"
    },
    cbe: {
      appName: "CBE Birr",
      steps: [
        "Open CBE Birr mobile app",
        "Login with your credentials",
        "Select 'Pay Bills'",
        "Search for 'Mat-Sci-AI'",
        `Enter Amount: ${amount} ETB`,
        `Enter Reference: ${transactionId}`,
        "Confirm with PIN/Biometrics"
      ],
      estimatedTime: "1-2 minutes", 
      supportPhone: "+251-111-123456"
    },
    abyssinia: {
      appName: "Abyssinia Mobile Banking",
      steps: [
        "Open Abyssinia Mobile Banking app",
        "Login with your credentials", 
        "Select 'Bill Payment'",
        "Choose 'E-commerce'",
        `Enter Amount: ${amount} ETB`,
        `Enter Merchant Reference: ${transactionId}`,
        "Authorize with PIN/Fingerprint"
      ],
      estimatedTime: "2-4 minutes",
      supportPhone: "+251-116-680000"
    }
  };

  return paymentInstructions[paymentMethod] || {
    error: "Unsupported payment method",
    supportedMethods: ["telebirr", "mpesa", "cbe", "abyssinia"]
  };
}

async function simulatePaymentVerification(paymentMethod: string, transactionId: string | null): Promise<boolean> {
  // In a real implementation, this would call the actual payment provider APIs
  // For demo purposes, we'll simulate a 90% success rate
  return Math.random() > 0.1;
}
