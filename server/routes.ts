import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { businessSubmissionSchema, regenerateHeadlineSchema } from "@shared/schema";

// Simulate business rating generation
function generateBusinessRating(): number {
  return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
}

// Simulate review count generation
function generateReviewCount(): number {
  return Math.floor(50 + Math.random() * 200);
}

// Generate SEO headlines
function generateSEOHeadline(name: string, location: string): string {
  const headlines = [
    `Why ${name} is ${location}'s Premier Choice in 2025`,
    `Discover Why ${name} Leads ${location}'s Market`,
    `${name}: ${location}'s Best-Kept Secret Revealed`,
    `How ${name} Became ${location}'s Top Choice`,
    `${name} Sets New Standards in ${location}`,
    `Why Locals Choose ${name} Over Competitors in ${location}`,
    `${name}: Your Go-To Destination in ${location}`,
    `The Ultimate Guide to ${name} in ${location}`,
    `${name} Transforms the ${location} Experience`,
    `Why ${name} is ${location}'s Most Trusted Name`
  ];
  
  return headlines[Math.floor(Math.random() * headlines.length)];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/business-data - Submit business information
  app.post("/api/business-data", async (req, res) => {
    try {
      const validatedData = businessSubmissionSchema.parse(req.body);
      
      // Generate simulated business metrics
      const rating = generateBusinessRating();
      const reviews = generateReviewCount();
      const headline = generateSEOHeadline(validatedData.name, validatedData.location);
      
      // Store the business data
      const business = await storage.createBusiness({
        name: validatedData.name,
        location: validatedData.location,
        rating,
        reviews,
        headline
      });
      
      res.json({
        rating: business.rating,
        reviews: business.reviews,
        headline: business.headline
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // POST /api/regenerate-headline - Regenerate SEO headline
  app.post("/api/regenerate-headline", async (req, res) => {
    try {
      const validatedData = regenerateHeadlineSchema.parse(req.body);
      
      // Generate a new headline
      const newHeadline = generateSEOHeadline(validatedData.name, validatedData.location);
      
      res.json({
        headline: newHeadline
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
