Business Dashboard
A mini local business dashboard simulating SEO content and Google Business data for small businesses. This is a full-stack application with a React frontend and a Node.js Express backend.

✨ Features
Business Information Form

Simulated Google Rating and Total Reviews

AI-Generated SEO Headline

Option to Regenerate SEO Headline

Responsive UI with Tailwind CSS

Basic Form Validation

Loading States for API calls

🚀 Technologies Used
Frontend:

React

Vite

Tailwind CSS

shadcn/ui

Lucide React

Backend:

Node.js

Express.js

CORS

📂 Folder Structure
my-business-dashboard/
├── backend/
│   ├── node_modules/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   └── ui/
    │   │       ├── button.jsx
    │   │       ├── card.jsx
    │   │       ├── input.jsx
    │   │       ├── label.jsx
    │   │       └── utils.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── jsconfig.json
    └── components.json

⚙️ Setup and Installation
Prerequisites

Node.js (LTS version recommended)

brew install node

npm

1. Create Project Structure

mkdir my-business-dashboard
cd my-business-dashboard

2. Backend Setup

cd backend
npm init -y
npm install express cors
# Place 'index.js' in this directory.
cd ..

3. Frontend Setup

npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# Place 'App.jsx' in 'frontend/src/'.
# Ensure 'src/index.css' has Tailwind directives.
# Create/verify 'jsconfig.json' for path aliases.
# Create/verify 'src/lib/utils.js' and install its dependencies: npm install clsx tailwind-merge.
# Configure Vite aliases in 'vite.config.js'.
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card
npm install lucide-react
cd ..

▶️ Running the Application
Open two separate terminal windows.

Terminal Window 1 (Backend)

cd my-business-dashboard/backend
node index.js

Terminal Window 2 (Frontend)

cd my-business-dashboard/frontend
npm run dev

Access the application in your browser at http://localhost:5173.

👨‍💻 Usage
Enter business name and location.

Click "Analyze Business" to see simulated data and an SEO headline.

Click "Regenerate" to get a new SEO headline.

🌐 API Endpoints
POST /api/business-data

Accepts: { "name": "...", "location": "..." }

Returns: { "rating": ..., "reviews": ..., "headline": "..." }

GET /api/regenerate-headline?name=...&location=...

Accepts: name and location query parameters.

Returns: { "headline": "..." 

