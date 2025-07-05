// Simulate business rating generation (4.0 - 5.0)
function generateBusinessRating() {
  return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
}

// Simulate review count generation (50 - 250)
function generateReviewCount() {
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
function generateSEOHeadline(name, location) {
  const template = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)];
  return template.replace(/{name}/g, name).replace(/{location}/g, location);
}

// Controller functions
const businessController = {
  // POST /api/business-data
  getBusinessData: (req, res) => {
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
  },

  // GET /api/regenerate-headline
  regenerateHeadline: (req, res) => {
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
  }
};

module.exports = businessController;