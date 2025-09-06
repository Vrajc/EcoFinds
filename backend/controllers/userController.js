import User from '../models/User.js';
import Product from '../models/Product.js';

// Profile management
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validate input
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email: email, 
      _id: { $ne: req.user._id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken by another user' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
    
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Cart management
export const addToCart = async (req, res) => {
  try {
    console.log('=== ADD TO CART DEBUG ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user?._id);
    
    const { productId } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    // Find product with owner details
    const product = await Product.findById(productId).populate('owner', 'name email');
    console.log('Product found:', product ? `${product.title} by ${product.owner?.name}` : 'Not found');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isAvailable) {
      return res.status(400).json({ message: 'Product is not available for purchase' });
    }

    // Check if user trying to add their own product
    if (product.owner._id.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot add your own product to cart' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product already in cart
    const existingCartItem = user.cart.find(item => 
      item.product && item.product.toString() === productId
    );

    if (existingCartItem) {
      return res.status(400).json({ message: 'Product is already in your cart' });
    }

    // Add to cart
    user.cart.push({ 
      product: productId, 
      addedAt: new Date() 
    });
    
    await user.save();
    console.log('Product added to cart successfully');
    
    res.status(200).json({ 
      success: true,
      message: 'Product added to cart successfully',
      cartCount: user.cart.length 
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      message: 'Server error while adding to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getCart = async (req, res) => {
  try {
    console.log('Fetching cart for user:', req.user._id);
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.product',
        populate: {
          path: 'owner',
          select: 'name email'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out invalid cart items (deleted products or unavailable ones)
    const validCartItems = user.cart.filter(item => {
      return item.product && 
             item.product.isAvailable !== false && 
             item.product._id;
    });
    
    // Update user's cart if items were filtered out
    if (validCartItems.length !== user.cart.length) {
      console.log(`Cleaned up cart: ${user.cart.length} -> ${validCartItems.length} items`);
      user.cart = validCartItems;
      await user.save();
    }

    console.log(`Returning ${validCartItems.length} cart items`);

    res.status(200).json({ 
      success: true,
      items: validCartItems,
      count: validCartItems.length 
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    console.log('Removing from cart:', { productId, userId });

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const initialCartLength = user.cart.length;
    user.cart = user.cart.filter(item => 
      item.product.toString() !== productId
    );

    if (user.cart.length === initialCartLength) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await user.save();
    console.log('Item removed from cart successfully');
    
    res.status(200).json({ 
      success: true,
      message: 'Product removed from cart successfully',
      cartCount: user.cart.length
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      message: 'Server error while removing from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Purchase management
export const getPurchases = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'purchases.product',
        populate: {
          path: 'owner',
          select: 'name email'
        }
      });

    res.json(user.purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPurchase = async (req, res) => {
  try {
    const { productIds } = req.body; // Array of product IDs from cart
    const userId = req.user._id;

    const user = await User.findById(userId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Add purchases
    const purchases = products.map(product => ({
      product: product._id,
      price: product.price,
      purchaseDate: new Date()
    }));

    user.purchases.push(...purchases);

    // Remove purchased items from cart
    user.cart = user.cart.filter(item => 
      !productIds.includes(item.product.toString())
    );

    // Mark products as unavailable
    await Product.updateMany(
      { _id: { $in: productIds } },
      { isAvailable: false }
    );

    await user.save();

    res.json({ message: 'Purchase completed successfully', purchases });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
