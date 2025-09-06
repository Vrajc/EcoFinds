# EcoFinds – Sustainable Second-Hand Marketplace

A sustainable marketplace for buying and selling second-hand items, built with React, Node.js, and MongoDB. All prices are displayed in Indian Rupees (₹).

## Features

- User authentication (register/login)
- Browse and search products
- Add products for sale
- Shopping cart functionality
- Order management
- Responsive design
- Image upload for products

## Tech Stack

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- bcrypt (password hashing)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecofinds
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in frontend directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Start MongoDB service
2. Run backend server (http://localhost:5000)
3. Run frontend development server (http://localhost:5173)
4. Open your browser and navigate to the frontend URL

## Future Enhancements

- Payment gateway integration
- Chat system between buyers and sellers
- Product reviews and ratings
- Advanced search and filters
- Purchase history
