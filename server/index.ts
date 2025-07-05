import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Simulate business rating generation (4.0 - 5.0)
function generateBusinessRating(): number {
  return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
}

// Simulate review count generation (50 - 250)
function generateReviewCount(): number {
  return Math.floor(50 + Math.random() * 200);
}

// SEO headlines templates
const headlineTemplates = [
  "Why {name} is {location}'s Premier Choice in 2025",
  "Discover Why {name} Leads {location}'s Market",
  "{name}: {location}'s Best-Kept Secret Revealed",
  "How {name} Became {location}'s Top Choice",
  "{name} Sets New Standards in {location}",
  "Why Locals Choose {name} Over Competitors in {location}",
  "{name}: Your Go-To Destination in {location}",
  "The Ultimate Guide to {name} in {location}",
  "{name} Transforms the {location} Experience",
  "Why {name} is {location}'s Most Trusted Name"
];

// Generate SEO headline
function generateSEOHeadline(name: string, location: string): string {
  const template = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)];
  return template.replace(/{name}/g, name).replace(/{location}/g, location);
}

// API Routes
app.post("/api/business-data", (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;
    
    // Basic validation
    if (!name || !location) {
      return res.status(400).json({ 
        message: "Business name and location are required" 
      });
    }

    if (typeof name !== 'string' || typeof location !== 'string') {
      return res.status(400).json({ 
        message: "Business name and location must be strings" 
      });
    }

    if (name.trim().length === 0 || location.trim().length === 0) {
      return res.status(400).json({ 
        message: "Business name and location cannot be empty" 
      });
    }
    
    // Generate simulated business data
    const rating = generateBusinessRating();
    const reviews = generateReviewCount();
    const headline = generateSEOHeadline(name.trim(), location.trim());
    
    res.json({
      rating,
      reviews,
      headline
    });
  } catch (error) {
    console.error('Error in getBusinessData:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/regenerate-headline", (req: Request, res: Response) => {
  try {
    const { name, location } = req.query;
    
    // Basic validation
    if (!name || !location) {
      return res.status(400).json({ 
        message: "Business name and location are required" 
      });
    }

    if (typeof name !== 'string' || typeof location !== 'string') {
      return res.status(400).json({ 
        message: "Business name and location must be strings" 
      });
    }

    if (name.trim().length === 0 || location.trim().length === 0) {
      return res.status(400).json({ 
        message: "Business name and location cannot be empty" 
      });
    }
    
    // Generate new headline
    const headline = generateSEOHeadline(name.trim(), location.trim());
    
    res.json({
      headline
    });
  } catch (error) {
    console.error('Error in regenerateHeadline:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

(async () => {
  const { createServer } = await import("http");
  const server = createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
