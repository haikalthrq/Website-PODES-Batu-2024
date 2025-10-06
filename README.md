# 📊 Dashboard PODES Kota Batu 2024

> **Dashboard Web Interaktif untuk Visualisasi Data Potensi Desa (PODES) 2024 Kota Batu**

Aplikasi web modern berbasis **React + Vite** (frontend) dan **Express.js** (backend) untuk menganalisis dan memvisualisasikan data desa di Kota Batu dengan berbagai indikator kategori.


## ✨ Fitur Utama

### 🎯 Dashboard Analisis Interaktif
- **Multi-kategori Analysis**: Pendidikan, Kesehatan, Infrastruktur & Konektivitas, Lingkungan & Kebencanaan
- **Filter Dinamis**: Filter berdasarkan kategori, indikator, kecamatan, dan desa
- **Visualisasi Chart**: Donut charts, bar charts, stacked charts dengan ApexCharts
- **Statistik Real-time**: KPI cards dan summary statistics

### 📱 Interface Modern
- **Responsive Design**: Material-UI (MUI) components dengan dark/light theme
- **Performance Optimized**: Lazy loading, memoization, dan efficient re-rendering
- **User Experience**: Loading states, error boundaries, dan smooth animations

### 🔧 Architecture
- **Component-based**: Modular React components dengan clear separation of concerns
- **Registry Pattern**: Centralized configuration untuk indicator definitions
- **API Integration**: RESTful backend dengan clean data transformation

## 🏗️ Struktur Project

```
📁 podes_batu_webapp/
├── 📁 server/                  # 🖥️ Backend API (Express.js)
│   ├── 📁 controllers/         # Logic pengolahan data
│   ├── 📁 routes/             # Endpoint API definitions  
│   ├── 📁 data/               # Dataset PODES 2024 (JSON)
│   ├── 📄 server.js           # Main server entry point
│   └── 📄 package.json        # Server dependencies
│
├── 📁 client/                  # 🎨 Frontend Dashboard (React + Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable React components
│   │   │   ├── 📁 charts/     # Chart components (ApexCharts)
│   │   │   ├── 📁 common/     # Shared UI components
│   │   │   └── 📁 theme/      # Color schemes & styling
│   │   ├── 📁 analysis/       # Analysis components & logic
│   │   ├── 📁 config/         # Configuration & registries
│   │   │   └── 📁 infra/      # Infrastructure indicator registry
│   │   ├── 📁 pages/          # Main application pages
│   │   ├── 📁 services/       # API communication layer  
│   │   ├── 📁 utils/          # Helper functions & utilities
│   │   └── 📄 main.jsx        # App entry point
│   ├── 📁 public/             # Static assets
│   └── 📄 package.json        # Frontend dependencies
│
├── 📁 docs/                    # 📚 Documentation
└── 📄 README.md               # Project overview
```

## 🚀 Quick Start

### Prerequisites
```bash
# Pastikan Node.js sudah terinstall (v16+)
node --version
npm --version
```

### 1️⃣ Clone & Setup
```bash
# Clone repository
git clone https://github.com/haikalthrq/Website-PODES-Batu-2024.git
cd podes_batu_webapp

# Install dependencies untuk semua parts
npm run install:all  # atau manual seperti di bawah
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
npm start    # Server runs on http://localhost:5000
```

### 3️⃣ Frontend Setup  
```bash
# Terminal baru
cd client
npm install
npm run dev  # Vite dev server runs on http://localhost:3000
```

### 4️⃣ Access Dashboard
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Test**: http://localhost:5000/api/villages

---

## 🔧 Tech Stack

### Frontend (Client)
- **⚛️ React 18** - Modern UI library dengan hooks
- **⚡ Vite** - Super fast build tool (lebih cepat dari Create React App)
- **🎨 Material-UI (MUI)** - Pre-built beautiful components
- **📊 ApexCharts** - Interactive chart library
- **🛣️ React Router** - Single Page Application routing

### Backend (Server)  
- **🚀 Express.js** - Minimalist web framework untuk Node.js
- **📄 File-based storage** - Data disimpan dalam format JSON
- **🔒 CORS & Helmet** - Security middleware

### Development Tools
- **📦 npm** - Package manager
- **🔍 ESLint** - Code linting untuk konsistensi
- **💅 Prettier** - Code formatting

---

## 💡 Untuk Programmer

### 📚 Konsep yang Dipelajari di Project Ini

#### 1. **Frontend Architecture**
```
🎯 Component-based Architecture
├── 📁 components/        # Reusable UI pieces  
├── 📁 pages/            # Full page components
├── 📁 services/         # API communication
├── 📁 config/           # App configurations  
└── 📁 utils/            # Helper functions
```

#### 2. **React Patterns yang Digunakan**
- **Custom Hooks** - Logic reuse (`useFilters`, `useVillageData`)
- **Component Composition** - Building complex UI from simple parts
- **State Management** - useState, useEffect, useMemo
- **Error Boundaries** - Graceful error handling
- **Lazy Loading** - Performance optimization

#### 3. **Data Flow Pattern**
```
API → Services → Components → State → UI
```

#### 4. **Modern JavaScript Features**
- ES6+ syntax (arrow functions, destructuring, template literals)
- Async/await untuk API calls
- Module imports/exports
- Array methods (map, filter, reduce)

### 🎓 Learning Path Recommendations

**Beginner → Intermediate**
1. ✅ HTML, CSS, JavaScript fundamentals
2. ✅ React basics (components, props, state)
3. 📖 React Hooks (useState, useEffect)
4. 📖 API integration with fetch/axios
5. 📖 Material-UI component library

**Intermediate → Advanced**
1. 📖 Advanced React patterns (custom hooks, context)
2. 📖 Performance optimization (memoization, lazy loading)
3. 📖 State management (Redux, Zustand)
4. 📖 Testing (Jest, React Testing Library)
5. 📖 TypeScript integration

---

## � Documentation

### 📖 Detailed Guides
- **[🏛️ Architecture Guide](docs/ARCHITECTURE.md)** - Application architecture & patterns
- **[💻 Development Setup](docs/DEVELOPMENT.md)** - Local development environment  
- **[🚀 Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment options
- **[📡 API Documentation](docs/API.md)** - Backend API endpoints & schemas

### 🔧 Technical Documentation
- **[🏗️ Infrastructure Registry](docs/INFRASTRUCTURE_REGISTRY.md)** - Registry pattern implementation
- **[🎨 Component Library](client/src/components/README.md)** - Reusable component documentation
- **[📊 Chart Components](client/src/components/charts/README.md)** - Chart wrapper documentation

### 🎯 Key Features

#### 🏘️ Multi-Category Analysis
- **Pendidikan**: TK, SD, SMP, SMA facilities per village
- **Kesehatan**: Puskesmas, Rumah Sakit health facilities  
- **Infrastruktur & Konektivitas**: Signal quality, internet access, lighting infrastructure
- **Lingkungan & Kebencanaan**: Environmental & disaster management data

#### 📊 Interactive Visualizations
- **Donut Charts**: Category distribution with percentages
- **Stacked Bar Charts**: Multi-category comparison by district (kecamatan)
- **KPI Cards**: Key statistics and summary metrics
- **Data Tables**: Detailed village information with sorting/filtering

#### 🎛️ Dynamic Filtering
- **Category Filter**: Switch between data categories
- **Indicator Filter**: Focus on specific indicators or view all ("Semua")
- **Geographic Filter**: Filter by kecamatan (district) and desa (village)
- **Real-time Updates**: Charts and statistics update instantly

#### 🏗️ Technical Architecture
- **Registry Pattern**: Centralized configuration for indicator definitions
- **Component Reusability**: Same visualization components for different modes
- **Performance Optimization**: Memoization, lazy loading, conditional rendering
- **Error Boundaries**: Graceful error handling and user feedback

---

## 📊 Data Overview

### 📍 Geographic Coverage
- **3 Kecamatan**: BATU, BUMIAJI, JUNREJO  
- **24 Desa/Kelurahan**: Complete coverage of Kota Batu
- **Data Source**: BPS (Badan Pusat Statistik) Kota Batu 2024

### 📈 Data Categories
- **Demographics**: Population, households, demographic indicators
- **Education**: Educational facility counts by level  
- **Health**: Healthcare facility availability
- **Infrastructure**: Connectivity, lighting, communication infrastructure
- **Environment**: Environmental conditions and disaster preparedness

## 🔐 Keamanan

- CORS policy untuk akses API
- Helmet.js untuk security headers
- Input validation pada API endpoints
- Error handling yang comprehensive

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint yang optimal untuk semua device
- Grid system Material-UI untuk layout
- Typography scaling yang konsisten

## 🚀 Development

### Menjalankan dalam Mode Development
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

---

## � Acknowledgments

- **BPS Kota Batu** - Data source dan support
- **React Community** - Amazing ecosystem dan tools
- **Material-UI Team** - Beautiful component library
- **ApexCharts** - Powerful charting library
- **Vite Team** - Lightning-fast build tool

---

## Documentation & Info

### Documentation
- **API Docs**: [API Documentation](docs/API.md)
- **Architecture**: [System Architecture](docs/ARCHITECTURE.md)

### Project Info
- **Version**: 1.0.0
- **Last Updated**: January 2024
- **Compatibility**: Node.js 16+, Modern Browsers

---

<div align="center">


</div>
