import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  subscriptionTier: text("subscription_tier").default("free"), // free, basic, premium
  subscriptionExpiry: timestamp("subscription_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  priceInBirr: real("price_in_birr").notNull(),
  durationInDays: integer("duration_in_days").notNull(),
  features: jsonb("features").notNull(), // Array of features
  isActive: integer("is_active").default(1),
});

export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  planId: varchar("plan_id").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").default("ETB"),
  paymentMethod: text("payment_method").notNull(), // telebirr, mpesa, cbe, abyssinia
  transactionId: text("transaction_id"),
  status: text("status").default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const materialPredictions = pgTable("material_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  predictionType: text("prediction_type").notNull(), // "properties-to-composition" or "composition-to-properties"
  inputData: jsonb("input_data").notNull(),
  outputData: jsonb("output_data").notNull(),
  confidence: real("confidence"),
  aiModel: text("ai_model").notNull(), // "openai" or "anthropic"
  createdAt: timestamp("created_at").defaultNow(),
});

export const ethiopianMaterials = pgTable("ethiopian_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  composition: jsonb("composition").notNull(),
  properties: jsonb("properties").notNull(),
  location: text("location"),
  availability: text("availability"),
  estimatedCost: real("estimated_cost"),
});

export const materialProperties = pgTable("material_properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Mechanical Properties
  tensileStrength: real("tensile_strength"),
  yieldStrength: real("yield_strength"),
  youngsModulus: real("youngs_modulus"),
  hardness: real("hardness"),
  elongation: real("elongation"),
  compressiveStrength: real("compressive_strength"),
  flexuralStrength: real("flexural_strength"),
  shearStrength: real("shear_strength"),
  fatigueStrength: real("fatigue_strength"),
  fractureStrength: real("fracture_strength"),
  impactStrength: real("impact_strength"),
  poissonsRatio: real("poissons_ratio"),
  bulkModulus: real("bulk_modulus"),
  shearModulus: real("shear_modulus"),
  // Thermal Properties
  meltingPoint: real("melting_point"),
  boilingPoint: real("boiling_point"),
  thermalConductivity: real("thermal_conductivity"),
  thermalExpansion: real("thermal_expansion"),
  specificHeat: real("specific_heat"),
  thermalDiffusivity: real("thermal_diffusivity"),
  glassTransitionTemp: real("glass_transition_temp"),
  heatDeflectionTemp: real("heat_deflection_temp"),
  maxServiceTemp: real("max_service_temp"),
  minServiceTemp: real("min_service_temp"),
  // Electrical Properties
  electricalResistivity: text("electrical_resistivity"),
  electricalConductivity: real("electrical_conductivity"),
  dielectricConstant: real("dielectric_constant"),
  dielectricStrength: real("dielectric_strength"),
  resistanceTemp: real("resistance_temp"),
  magneticPermeability: real("magnetic_permeability"),
  magneticSusceptibility: real("magnetic_susceptibility"),
  // Optical Properties
  refractiveIndex: real("refractive_index"),
  transparency: text("transparency"),
  reflectance: real("reflectance"),
  absorptance: real("absorptance"),
  emissivity: real("emissivity"),
  // Chemical Properties
  corrosionResistance: text("corrosion_resistance"),
  phStabilityRange: text("ph_stability_range"),
  oxidationResistance: text("oxidation_resistance"),
  chemicalCompatibility: text("chemical_compatibility"),
  solubility: text("solubility"),
  // Physical Properties
  density: real("density"),
  porosity: real("porosity"),
  permeability: real("permeability"),
  viscosity: real("viscosity"),
  surfaceTension: real("surface_tension"),
  wettability: text("wettability"),
  // Manufacturing Properties
  machinability: text("machinability"),
  weldability: text("weldability"),
  formability: text("formability"),
  castability: text("castability"),
  // Environmental Properties
  weatherResistance: text("weather_resistance"),
  uvResistance: text("uv_resistance"),
  radiationResistance: text("radiation_resistance"),
  biodegradability: text("biodegradability"),
});

export const materialComposition = pgTable("material_composition", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  elements: jsonb("elements").notNull(), // Array of {element: string, percentage: number}
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const registerUserSchema = insertUserSchema.pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertMaterialPredictionSchema = createInsertSchema(materialPredictions).omit({
  id: true,
  createdAt: true,
});

export const insertEthiopianMaterialSchema = createInsertSchema(ethiopianMaterials).omit({
  id: true,
});

export const insertMaterialPropertiesSchema = createInsertSchema(materialProperties).omit({
  id: true,
});

export const insertMaterialCompositionSchema = createInsertSchema(materialComposition).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertMaterialPrediction = z.infer<typeof insertMaterialPredictionSchema>;
export type MaterialPrediction = typeof materialPredictions.$inferSelect;
export type InsertEthiopianMaterial = z.infer<typeof insertEthiopianMaterialSchema>;
export type EthiopianMaterial = typeof ethiopianMaterials.$inferSelect;
export type InsertMaterialProperties = z.infer<typeof insertMaterialPropertiesSchema>;
export type MaterialProperties = typeof materialProperties.$inferSelect;
export type InsertMaterialComposition = z.infer<typeof insertMaterialCompositionSchema>;
export type MaterialComposition = typeof materialComposition.$inferSelect;

// AI Prediction Request/Response types
export const propertiesToCompositionSchema = z.object({
  mechanicalProperties: z.object({
    tensileStrength: z.number().optional(),
    yieldStrength: z.number().optional(),
    youngsModulus: z.number().optional(),
    hardness: z.number().optional(),
    elongation: z.number().optional(),
    compressiveStrength: z.number().optional(),
    flexuralStrength: z.number().optional(),
    shearStrength: z.number().optional(),
    fatigueStrength: z.number().optional(),
    fractureStrength: z.number().optional(),
    impactStrength: z.number().optional(),
    poissonsRatio: z.number().optional(),
    bulkModulus: z.number().optional(),
    shearModulus: z.number().optional(),
  }).optional(),
  thermalProperties: z.object({
    meltingPoint: z.number().optional(),
    boilingPoint: z.number().optional(),
    thermalConductivity: z.number().optional(),
    thermalExpansion: z.number().optional(),
    specificHeat: z.number().optional(),
    thermalDiffusivity: z.number().optional(),
    glassTransitionTemp: z.number().optional(),
    heatDeflectionTemp: z.number().optional(),
    maxServiceTemp: z.number().optional(),
    minServiceTemp: z.number().optional(),
  }).optional(),
  electricalProperties: z.object({
    electricalResistivity: z.string().optional(),
    electricalConductivity: z.number().optional(),
    dielectricConstant: z.number().optional(),
    dielectricStrength: z.number().optional(),
    resistanceTemp: z.number().optional(),
    magneticPermeability: z.number().optional(),
    magneticSusceptibility: z.number().optional(),
  }).optional(),
  opticalProperties: z.object({
    refractiveIndex: z.number().optional(),
    transparency: z.enum(["Transparent", "Translucent", "Opaque"]).optional(),
    reflectance: z.number().optional(),
    absorptance: z.number().optional(),
    emissivity: z.number().optional(),
  }).optional(),
  chemicalProperties: z.object({
    corrosionResistance: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
    phStabilityRange: z.string().optional(),
    oxidationResistance: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
    chemicalCompatibility: z.string().optional(),
    solubility: z.string().optional(),
  }).optional(),
  physicalProperties: z.object({
    density: z.number().optional(),
    porosity: z.number().optional(),
    permeability: z.number().optional(),
    viscosity: z.number().optional(),
    surfaceTension: z.number().optional(),
    wettability: z.enum(["Hydrophilic", "Hydrophobic", "Neutral"]).optional(),
  }).optional(),
  manufacturingProperties: z.object({
    machinability: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
    weldability: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
    formability: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
    castability: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
  }).optional(),
  environmentalProperties: z.object({
    weatherResistance: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
    uvResistance: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
    radiationResistance: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
    biodegradability: z.enum(["High", "Medium", "Low", "None"]).optional(),
  }).optional(),
});

export const compositionToPropertiesSchema = z.object({
  elements: z.array(z.object({
    element: z.string(),
    percentage: z.number(),
  })),
});

export type PropertiesToCompositionRequest = z.infer<typeof propertiesToCompositionSchema>;
export type CompositionToPropertiesRequest = z.infer<typeof compositionToPropertiesSchema>;
