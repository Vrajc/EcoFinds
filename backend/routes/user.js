import express from 'express';
import { getProfile, updateProfile, getPurchases, createPurchase } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(auth);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Purchase routes
router.get('/purchases', getPurchases);
router.post('/purchases', createPurchase);

export default router;
