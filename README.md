# Business Dashboard - Pure JavaScript Version

A clean, modern business dashboard built with React frontend and Node.js backend.

## 🏗️ Project Structure

```
business-dashboard/
├── client/
│   ├── src/
│   │   ├── components/ui/        # Reusable UI components
│   │   ├── App.jsx              # Main React application
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   └── index.html               # HTML template
├── server/
│   └── index.js                 # Express server
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS config
└── package.json                 # Dependencies
```

## 🚀 How to Run in VS Code

### Prerequisites
- Node.js (v18 or higher)
- VS Code

### Installation & Setup

1. **Clone/Download the project** to your local machine

2. **Open VS Code** and open the project folder

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Install additional frontend dependencies:**
   ```bash
   npm install @radix-ui/react-label @radix-ui/react-slot class-variance-authority clsx tailwind-merge
   ```

5. **Run the application:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:3000`

6. **Open your browser** and go to `http://localhost:3000`

## 🎯 Features

- **Business Information Form**: Input business name and location
- **Simulated Analytics**: Google ratings (4.0-5.0) and review counts (50-250)
- **AI-Generated SEO Headlines**: 10 different headline templates
- **One-Click Regeneration**: Instant headline updates
- **Responsive Design**: Mobile-first Tailwind CSS styling
- **Modern UI**: Clean cards and professional layout

## 📡 API Endpoints

- `POST /api/business-data` - Submit business information
- `GET /api/regenerate-headline` - Generate new SEO headline

## 🛠️ Development

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + CORS
- **No Database**: Pure in-memory simulation
- **No TypeScript**: Clean JavaScript for simplicity

## 🎨 UI Components

The project includes a complete set of shadcn/ui components:
- Button, Input, Label, Card
- Professional styling with CSS variables
- Dark/light theme support ready

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interface elements

---

**Ready to start developing!** 🚀