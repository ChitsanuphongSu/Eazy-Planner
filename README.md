# 🌿 FlowSpace

<div align="center">
  <img src="public/favicon.svg" width="100" height="100" />
  <h3>Your Ultimate Minimalist Productivity Ecosystem</h3>
  <p>A high-performance, real-time synchronized planner for the modern professional.</p>
  
  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://flowspace-planner.vercel.app)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)](#)
</div>

---

## 📖 Overview

**FlowSpace** is a unified productivity platform that merges a visual **Weekly Schedule**, a high-performance **Todo Engine**, and a **Monthly Event Tracker** into one cohesive interface. Built with a focus on minimalism and fluid UX, it provides a "Flow" state experience for students and professionals alike.

Designed with a **Glassmorphism** aesthetic and a proprietary **"Matcha Green"** pastel theme, FlowSpace is as beautiful as it is functional.

## ✨ Core Pillars

### 📅 Visual Schedule Manager
Plan your week with a high-fidelity time-grid. 
- **Atomic Time Slots:** Granular control from 06:00 to 22:00.
- **Color-Coded Categories:** Instantly distinguish between Study, Work, and Personal tasks.
- **Smart Overlays:** Visual cues for active/past sessions.

### ✅ Pro Todo Engine
More than just a checklist. 
- **Multidimensional Priority:** Priority levels (Urgent to Low) with color semantics.
- **Nested Task Management:** Subtask tracking with real-time progress bars.
- **Advanced Bulk Actions:** Selection mode for mass deletion and organization.
- **Auto-Layout Optimization:** Guaranteed visibility and accessibility across all screen sizes (Mobile, Tablet, Desktop).

### ☁️ Real-time Cloud Infrastructure
- **Google Auth Integration:** Secure, one-tap login.
- **Firestore Real-time Sync:** Changes reflect instantly across all your devices.
- **PWA Ready:** Installable on iOS, Android, and PC. Works offline with background sync.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React.js 18 | Component-based architecture for high maintainability. |
| **Build Tool** | Vite | Lightning-fast HMR and optimized production bundles. |
| **Styling** | Vanilla CSS | Custom design tokens and modern CSS variables for a unique "Matcha" aesthetic. |
| **Backend** | Firebase | Serverless infrastructure for real-time data persistence. |
| **Icons** | Lucide React | Clean, consistent, and bold iconography. |
| **PWA** | Vite-PWA | Seamless installation and offline caching capabilities. |

---

## 🚀 Getting Started (for Developers)

To run FlowSpace locally:

### 1. Prerequisites
- Node.js (v16.14.0 or higher)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/ChitsanuphongSu/FlowSpace-formerly-Eazy-Planner.git

# Navigate to directory
cd Antigravity (or project root)

# Install dependencies
npm install
```

### 3. Setup Environment
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📲 วิธีติดตั้งแอปลงในเครื่อง (User Installation Thai)

คุณสามารถติดตั้ง FlowSpace เพื่อใช้งานเหมือนแอปในเครื่องได้ฟรีผ่านระบบ PWA:

### 🍎 iOS (Safari)
1. เปิดแอปผ่าน **Safari**
2. กดปุ่ม `แชร์ (Share)` -> เลือก **"เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)"**

### 🤖 Android (Chrome)
1. กดเมนู `3 จุด` มุมขวาบน -> เลือก **"ติดตั้งแอป (Install App)"**

### 💻 Computer (Chrome / Edge)
1. คลิกไอคอน **"ติดตั้งแอป"** ทางด้านขวาของ Address Bar ด้านบน

---

## 📁 Project Structure

```text
src/
├── components/         # Reusable UI Components
│   ├── common/         # Modals, Widgets, Buttons
│   ├── schedule/       # Grid & Schedule Logic
│   └── todo/           # Todo Items & List Logic
├── contexts/           # Global State Management (React Context)
├── pages/              # Main Page Views
├── utils/              # Helper Functions & Constants
└── App.jsx             # Main Application Routing
```

---

<div align="center">
  <p><i>Developed with Minimalist Philosophy & High Performance Logic.</i></p>
  <p>© 2026 FlowSpace Project</p>
</div>
