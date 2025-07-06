import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now(); 
  const path = req.path;   
  let capturedJsonResponse; 

  const originalResJson = res.json;
  res.json = function (bodyObj, ...args) {
    capturedJsonResponse = bodyObj; 
    return originalResJson.apply(res, [bodyObj, ...args]); 
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).slice(0, 200)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next(); 
});

/**
 * @returns {number} 
 */

function generateBusinessRating() {
  return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
}

/**
 * @returns {number} 
 */

function generateReviewCount() {
  return Math.floor(50 + Math.random() * 200);
}

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

/**
 * @param {string} name - The business name.
 * @param {string} location - The business location.
 * @returns {string} The generated SEO headline.
 */

function generateSEOHeadline(name, location) {
  const template = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)];
  return template.replace(/{name}/g, name).replace(/{location}/g, location);
}

// API Routes

app.post("/api/business-data", (req, res) => {
  try {
    const { name, location } = req.body;
    
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
    
    const rating = generateBusinessRating();
    const reviews = generateReviewCount();
    const headline = generateSEOHeadline(name.trim(), location.trim());
    
    res.json({
      rating,
      reviews,
      headline
    });
  } catch (error) {
    console.error('Error in /api/business-data:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/api/regenerate-headline", (req, res) => {
  try {
    const { name, location } = req.query;
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
    
    const headline = generateSEOHeadline(name.trim(), location.trim());
    
    res.json({
      headline
    });
  } catch (error) {
    console.error('Error in /api/regenerate-headline:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const port = parseInt(process.env.PORT || "5000", 10);

app.listen(port, "3000", () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`📡 API endpoints available at http://localhost:${port}/api/`);
});

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});
