import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.owner._id === user._id) {
      toast.error('You cannot add your own product to cart');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Adding to cart...');

    const result = await addToCart(product._id);
    
    // Dismiss loading toast
    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success(result.message || 'Added to cart successfully');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleMessageSeller = async () => {
    if (!user) {
      toast.error('Please login to message the seller');
      navigate('/login');
      return;
    }

    if (product.owner._id === user._id) {
      toast.error('You cannot message yourself');
      return;
    }

    const loadingToast = toast.loading('Starting chat...');

    try {
      const response = await api.post('/chat/start', {
        productId: product._id
      });

      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        navigate(`/chat/${response.data.chat._id}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to start chat');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={product.imageUrl || '/placeholder-image.jpg'}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">{product.title}</h1>
            <p className="text-text-muted capitalize">{product.category}</p>
          </div>

          <div className="text-5xl font-bold text-primary">₹{product.price}</div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-text-muted leading-relaxed">{product.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Seller Information</h3>
            <p className="text-text-muted">Sold by: {product.owner.name}</p>
          </div>

          {user && product.owner._id !== user._id && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button onClick={handleAddToCart} className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 21h12M9 19v.01M20 19v.01"></path>
                </svg>
                <span>Add to Cart</span>
              </button>
              <button onClick={handleMessageSeller} className="btn-primary flex-1 flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>Message Seller</span>
              </button>
            </div>
          )}

          {user && product.owner._id === user._id && (
            <div className="bg-warning-50 border border-warning-200 p-4 rounded-xl">
              <p className="text-warning-800 font-medium">This is your own product</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
