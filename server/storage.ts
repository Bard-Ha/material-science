import { 
  type User, 
  type InsertUser,
  type RegisterUser,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type PaymentTransaction,
  type InsertPaymentTransaction,
  type MaterialPrediction,
  type InsertMaterialPrediction,
  type EthiopianMaterial,
  type InsertEthiopianMaterial
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: RegisterUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Subscription plans
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  
  // Payment transactions
  createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction>;
  getPaymentTransaction(id: string): Promise<PaymentTransaction | undefined>;
  getUserPaymentTransactions(userId: string): Promise<PaymentTransaction[]>;
  updatePaymentTransaction(id: string, transaction: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined>;
  
  // Material predictions
  createMaterialPrediction(prediction: InsertMaterialPrediction): Promise<MaterialPrediction>;
  getMaterialPrediction(id: string): Promise<MaterialPrediction | undefined>;
  getUserPredictions(userId?: string): Promise<MaterialPrediction[]>;
  
  // Ethiopian materials
  getEthiopianMaterials(): Promise<EthiopianMaterial[]>;
  getEthiopianMaterial(id: string): Promise<EthiopianMaterial | undefined>;
  createEthiopianMaterial(material: InsertEthiopianMaterial): Promise<EthiopianMaterial>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subscriptionPlans: Map<string, SubscriptionPlan>;
  private paymentTransactions: Map<string, PaymentTransaction>;
  private materialPredictions: Map<string, MaterialPrediction>;
  private ethiopianMaterials: Map<string, EthiopianMaterial>;

  constructor() {
    this.users = new Map();
    this.subscriptionPlans = new Map();
    this.paymentTransactions = new Map();
    this.materialPredictions = new Map();
    this.ethiopianMaterials = new Map();
    
    // Initialize with sample data
    this.initializeSubscriptionPlans();
    this.initializeEthiopianMaterials();
  }

  private initializeSubscriptionPlans() {
    const plans: SubscriptionPlan[] = [
      {
        id: randomUUID(),
        name: "Basic",
        description: "Perfect for students and researchers",
        priceInBirr: 250.0, // ~$4.50 USD
        durationInDays: 30,
        features: [
          "5 AI predictions per day",
          "Basic Ethiopian materials database",
          "Standard analysis tools",
          "Email support"
        ],
        isActive: 1
      },
      {
        id: randomUUID(),
        name: "Professional", 
        description: "Ideal for engineers and professionals",
        priceInBirr: 650.0, // ~$11.50 USD
        durationInDays: 30,
        features: [
          "Unlimited AI predictions",
          "Full Ethiopian materials database",
          "Advanced analysis tools",
          "Priority support",
          "Export capabilities",
          "Batch processing"
        ],
        isActive: 1
      },
      {
        id: randomUUID(),
        name: "Enterprise",
        description: "For companies and institutions", 
        priceInBirr: 1800.0, // ~$32 USD
        durationInDays: 30,
        features: [
          "Everything in Professional",
          "Team collaboration tools",
          "Custom material database",
          "API access",
          "White-label options",
          "Dedicated support",
          "Custom integrations"
        ],
        isActive: 1
      }
    ];

    plans.forEach(plan => {
      this.subscriptionPlans.set(plan.id, plan);
    });
  }

  private initializeEthiopianMaterials() {
    const materials: EthiopianMaterial[] = [
      {
        id: randomUUID(),
        name: "Lalibela Stone",
        description: "Volcanic tuff used in traditional construction",
        composition: {
          elements: [
            { element: "SiO2", percentage: 65 },
            { element: "Al2O3", percentage: 15 },
            { element: "Fe2O3", percentage: 8 },
            { element: "CaO", percentage: 7 },
            { element: "MgO", percentage: 3 },
            { element: "Other", percentage: 2 }
          ]
        },
        properties: {
          compressiveStrength: 20,
          density: 2.0,
          porosity: 25,
          thermalConductivity: 0.8
        },
        location: "Lalibela, Amhara Region",
        availability: "Abundant",
        estimatedCost: 15.0
      },
      {
        id: randomUUID(),
        name: "Tigray Iron Ore",
        description: "High-grade hematite deposits",
        composition: {
          elements: [
            { element: "Fe2O3", percentage: 70 },
            { element: "SiO2", percentage: 15 },
            { element: "Al2O3", percentage: 8 },
            { element: "CaO", percentage: 4 },
            { element: "MgO", percentage: 2 },
            { element: "Other", percentage: 1 }
          ]
        },
        properties: {
          ironContent: 70,
          density: 5.2,
          hardness: 6.5,
          magneticSusceptibility: 0.15
        },
        location: "Tigray Region",
        availability: "Large reserves (~40 Mt)",
        estimatedCost: 45.0
      },
      {
        id: randomUUID(),
        name: "Ethiopian Gold",
        description: "Alluvial and hard rock deposits",
        composition: {
          elements: [
            { element: "Au", percentage: 85 },
            { element: "Ag", percentage: 10 },
            { element: "Cu", percentage: 3 },
            { element: "Fe", percentage: 1.5 },
            { element: "Other", percentage: 0.5 }
          ]
        },
        properties: {
          purity: 20.5,
          density: 19.3,
          electricalConductivity: 45000000,
          thermalConductivity: 315
        },
        location: "Various regions",
        availability: "Annual production ~8.5 tonnes",
        estimatedCost: 65000.0
      }
    ];

    materials.forEach(material => {
      this.ethiopianMaterials.set(material.id, material);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: RegisterUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      subscriptionTier: "free",
      subscriptionExpiry: null,
      createdAt: now,
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Subscription plan methods
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values()).filter(plan => plan.isActive === 1);
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = randomUUID();
    const subscriptionPlan: SubscriptionPlan = { 
      ...plan, 
      id,
      description: plan.description ?? null,
      isActive: plan.isActive ?? 1
    };
    this.subscriptionPlans.set(id, subscriptionPlan);
    return subscriptionPlan;
  }

  // Payment transaction methods
  async createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const id = randomUUID();
    const now = new Date();
    const paymentTransaction: PaymentTransaction = { 
      ...transaction, 
      id,
      status: transaction.status ?? "pending",
      currency: transaction.currency ?? "ETB",
      transactionId: transaction.transactionId ?? null,
      createdAt: now,
      completedAt: null
    };
    this.paymentTransactions.set(id, paymentTransaction);
    return paymentTransaction;
  }

  async getPaymentTransaction(id: string): Promise<PaymentTransaction | undefined> {
    return this.paymentTransactions.get(id);
  }

  async getUserPaymentTransactions(userId: string): Promise<PaymentTransaction[]> {
    return Array.from(this.paymentTransactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }

  async updatePaymentTransaction(id: string, transactionUpdate: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const existingTransaction = this.paymentTransactions.get(id);
    if (!existingTransaction) return undefined;
    
    const updatedTransaction = { ...existingTransaction, ...transactionUpdate };
    if (transactionUpdate.status === "completed" && !updatedTransaction.completedAt) {
      updatedTransaction.completedAt = new Date();
    }
    this.paymentTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async createMaterialPrediction(prediction: InsertMaterialPrediction): Promise<MaterialPrediction> {
    const id = randomUUID();
    const materialPrediction: MaterialPrediction = { 
      ...prediction, 
      id, 
      userId: prediction.userId || null,
      confidence: prediction.confidence || null,
      createdAt: new Date() 
    };
    this.materialPredictions.set(id, materialPrediction);
    return materialPrediction;
  }

  async getMaterialPrediction(id: string): Promise<MaterialPrediction | undefined> {
    return this.materialPredictions.get(id);
  }

  async getUserPredictions(userId?: string): Promise<MaterialPrediction[]> {
    if (userId) {
      return Array.from(this.materialPredictions.values()).filter(
        (prediction) => prediction.userId === userId
      );
    }
    return Array.from(this.materialPredictions.values());
  }

  async getEthiopianMaterials(): Promise<EthiopianMaterial[]> {
    return Array.from(this.ethiopianMaterials.values());
  }

  async getEthiopianMaterial(id: string): Promise<EthiopianMaterial | undefined> {
    return this.ethiopianMaterials.get(id);
  }

  async createEthiopianMaterial(material: InsertEthiopianMaterial): Promise<EthiopianMaterial> {
    const id = randomUUID();
    const ethiopianMaterial: EthiopianMaterial = { 
      ...material, 
      id,
      description: material.description || null,
      location: material.location || null,
      availability: material.availability || null,
      estimatedCost: material.estimatedCost || null
    };
    this.ethiopianMaterials.set(id, ethiopianMaterial);
    return ethiopianMaterial;
  }
}

export const storage = new MemStorage();
