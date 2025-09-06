import Product from '../models/Product.js';
import User from '../models/User.js';

export const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT DEBUG ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User ID:', req.user?._id);
    
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.log('ERROR: No authenticated user found');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { title, description, category, price } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !price) {
      console.log('ERROR: Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required: title, description, category, price',
        received: { title: !!title, description: !!description, category: !!category, price: !!price }
      });
    }

    // Validate price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number' });
    }
    
    const productData = {
      title: title.trim(),
      description: description.trim(),
      category: category.toLowerCase(),
      price: parsedPrice,
      owner: req.user._id,
      isAvailable: true
    };

    // Add image if uploaded
    if (req.file) {
      productData.imageUrl = req.file.path;
      console.log('Image uploaded to:', req.file.path);
    }

    console.log('Creating product with data:', productData);

    const product = await Product.create(productData);
    const populatedProduct = await Product.findById(product._id).populate('owner', 'name email');

    console.log('Product created successfully:', populatedProduct._id);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    console.error('=== PRODUCT CREATION ERROR ===');
    console.error('Error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: messages 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while creating product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    console.log('Fetching products with query:', req.query);
    
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = { isAvailable: true };

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category.trim()) {
      query.category = category.toLowerCase();
    }

    console.log('MongoDB query:', query);

    const products = await Product.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    console.log(`Found ${products.length} products`);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = { title, description, category, price: parseFloat(price) };
    
    // If new image was uploaded
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('owner', 'name email');

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
