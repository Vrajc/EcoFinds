# EcoFinds – Sustainable Second-Hand Marketplace

A sustainable marketplace for buying and selling second-hand items, built with React, Node.js, and MongoDB. All prices are displayed in Indian Rupees (₹).

## 🎨 Branding & Logo

- **Logo**: Custom EcoFinds logo located at `/public/logo.png`
- **Logo Usage**: Used in navbar and as favicon
- **Logo Container**: Purple rounded background (#714B67) with padding

## 🎨 UI Theme (Odoo-inspired)

- Font: Inter, sans-serif
- Primary Color: #714B67 (purple) - Main buttons, headers, active states
- Secondary Color: #875A7B (lighter purple) - Hover states, secondary buttons
- Accent Color: #00A09D (teal) - Success states, accent elements
- Success Color: #28A745 (green) - Success messages, positive actions
- Warning Color: #FFC107 (amber) - Warning messages
- Danger Color: #DC3545 (red) - Error messages, delete actions
- Background: #F8F9FA (light gray) - Page backgrounds
- Card Background: #FFFFFF (white) - Card/modal backgrounds
- Border Color: #DEE2E6 (light gray) - Borders, dividers
- Text Primary: #212529 (dark gray) - Main text
- Text Secondary: #6C757D (muted gray) - Secondary text, placeholders
- Button Styles:
  - Primary: Purple background (#714B67) with white text
  - Secondary: White background with purple border and purple text
  - Success: Green background (#28A745) with white text
  - Danger: Red background (#DC3545) with white text
  - Ghost: Transparent background with colored border

## 🚀 Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT
- **Image Storage**: Cloudinary

## 📦 Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## 🔧 Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend `.env`

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000
```

## ✅ Features

- User authentication (signup/login)
- Product CRUD operations with rupee pricing (₹)
- Image upload with Cloudinary
- Search and filter products
- Shopping cart with Indian currency
- Purchase history
- User dashboard
- Responsive design optimized for desktop screens
