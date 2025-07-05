import { pgTable, text, serial, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  rating: real("rating").notNull(),
  reviews: integer("reviews").notNull(),
  headline: text("headline").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).pick({
  name: true,
  location: true,
});

export const businessSubmissionSchema = z.object({
  name: z.string().min(1, "Business name is required").trim(),
  location: z.string().min(1, "Location is required").trim(),
});

export const regenerateHeadlineSchema = z.object({
  name: z.string().min(1, "Business name is required").trim(),
  location: z.string().min(1, "Location is required").trim(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;
export type BusinessSubmission = z.infer<typeof businessSubmissionSchema>;
export type RegenerateHeadline = z.infer<typeof regenerateHeadlineSchema>;
