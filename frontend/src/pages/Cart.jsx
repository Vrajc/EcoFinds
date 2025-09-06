import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, getTotalPrice, loading } = useCart();

  const handleRemoveItem = async (productId) => {
    const loadingToast = toast.loading('Removing item...');
    
    const result = await removeFromCart(productId);
    
    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success(result.message || 'Item removed from cart');
    } else {
      toast.error(result.error || 'Failed to remove item');
    }
  };

  const handleCheckout = () => {
    toast.success('Checkout functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="section-container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="section-container py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-6 sm:mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 21h12M9 19v.01M20 19v.01"></path>
              </svg>
            </div>
            <p className="text-text-muted text-base sm:text-lg mb-4">Your cart is empty</p>
            <Link to="/" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {cart.map((item) => (
              <div key={item._id} className="card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.imageUrl || '/placeholder-image.jpg'}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">{item.product.title}</h3>
                    <p className="text-text-muted capitalize mb-2 text-sm sm:text-base">{item.product.category}</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">₹{item.product.price}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="btn-danger text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 self-end sm:self-center"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <span className="text-xl sm:text-2xl font-bold text-text">Total: ₹{getTotalPrice().toFixed(2)}</span>
                <button onClick={handleCheckout} className="btn-primary px-8 py-3">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
