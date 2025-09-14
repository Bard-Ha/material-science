import { 
  type User, 
  type InsertUser, 
  type MaterialPrediction,
  type InsertMaterialPrediction,
  type EthiopianMaterial,
  type InsertEthiopianMaterial
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createMaterialPrediction(prediction: InsertMaterialPrediction): Promise<MaterialPrediction>;
  getMaterialPrediction(id: string): Promise<MaterialPrediction | undefined>;
  getUserPredictions(userId?: string): Promise<MaterialPrediction[]>;
  
  getEthiopianMaterials(): Promise<EthiopianMaterial[]>;
  getEthiopianMaterial(id: string): Promise<EthiopianMaterial | undefined>;
  createEthiopianMaterial(material: InsertEthiopianMaterial): Promise<EthiopianMaterial>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private materialPredictions: Map<string, MaterialPrediction>;
  private ethiopianMaterials: Map<string, EthiopianMaterial>;

  constructor() {
    this.users = new Map();
    this.materialPredictions = new Map();
    this.ethiopianMaterials = new Map();
    
    // Initialize with sample Ethiopian materials
    this.initializeEthiopianMaterials();
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
