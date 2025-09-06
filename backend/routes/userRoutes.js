import express from 'express';
import {
  getProfile,
  updateProfile,
  addToCart,
  getCart,
  removeFromCart,
  getPurchases,
  createPurchase
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Cart routes
router.post('/cart/add', auth, addToCart);
router.get('/cart', auth, getCart);
router.delete('/cart/remove/:productId', auth, removeFromCart);

// Purchase routes
router.get('/purchases', auth, getPurchases);
router.post('/purchase', auth, createPurchase);

export default router;


