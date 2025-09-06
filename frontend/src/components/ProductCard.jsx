import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
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

  return (
    <div className="card p-0 overflow-hidden group hover:shadow-xl transition-all duration-300 w-full max-w-sm mx-auto">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gray-50 rounded-t-xl sm:rounded-t-2xl">
          <img
            src={product.imageUrl || '/placeholder-image.jpg'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="bg-white/95 text-primary text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-gray-100">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div>
          <h3 className="font-caveat font-bold text-lg sm:text-xl lg:text-2xl text-text mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-text-muted text-xs sm:text-sm line-clamp-2 font-inter leading-relaxed mb-2 sm:mb-3">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-primary font-inter">₹{product.price}</span>
            <span className="text-xs text-text-muted truncate max-w-[120px] sm:max-w-none">
              by {product.owner?.name}
            </span>
          </div>
        </div>
        
        <div className="pt-1 sm:pt-2 space-y-2">
          <Link to={`/products/${product._id}`} className="block">
            <button className="w-full btn-secondary text-xs sm:text-sm py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium">
              View Details
            </button>
          </Link>
          {user && product.owner._id !== user._id && (
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary text-xs sm:text-sm py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 21h12M9 19v.01M20 19v.01"></path>
              </svg>
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
