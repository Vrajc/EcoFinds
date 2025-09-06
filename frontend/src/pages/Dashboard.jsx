import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { getCartCount } = useCart();

  const dashboardCards = [
    {
      title: 'Add New Product',
      description: 'List a new item for sale',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: '/add-product',
      color: 'bg-primary',
      stats: null
    },
    {
      title: 'My Listings',
      description: 'Manage your products',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      link: '/my-listings',
      color: 'bg-accent',
      stats: null
    },
    {
      title: 'Shopping Cart',
      description: 'Review your selected items',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 21h12M9 19v.01M20 19v.01" />
        </svg>
      ),
      link: '/cart',
      color: 'bg-secondary-500',
      stats: getCartCount()
    },
    {
      title: 'Purchase History',
      description: 'View past purchases',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
        </svg>
      ),
      link: '/purchases',
      color: 'bg-green-500',
      stats: null
    }
  ];

  return (
    <div className="section-container py-8 sm:py-12">
      <div className="page-header">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-caveat font-bold text-text mb-3 sm:mb-4">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-text-muted font-inter">
          Manage your sustainable marketplace activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {dashboardCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="card-elevated p-6 sm:p-8 hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${card.color} rounded-xl sm:rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg`}>
                {card.icon}
              </div>
              <h3 className="font-caveat font-semibold text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                {card.title}
                {card.stats !== null && (
                  <span className="ml-2 bg-accent text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    {card.stats}
                  </span>
                )}
              </h3>
              <p className="text-text-muted font-inter text-sm sm:text-base">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
        <div className="card p-6 sm:p-8 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h4 className="font-caveat text-lg sm:text-xl lg:text-2xl font-semibold mb-2">Impact</h4>
          <p className="text-2xl sm:text-3xl font-bold text-primary mb-2">0</p>
          <p className="text-text-muted font-inter text-sm sm:text-base">Items Saved</p>
        </div>
        <div className="card p-6 sm:p-8 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h4 className="font-caveat text-lg sm:text-xl lg:text-2xl font-semibold mb-2">Earnings</h4>
          <p className="text-2xl sm:text-3xl font-bold text-accent mb-2">₹0</p>
          <p className="text-text-muted font-inter text-sm sm:text-base">Total Sales</p>
        </div>
        <div className="card p-6 sm:p-8 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h4 className="font-caveat text-lg sm:text-xl lg:text-2xl font-semibold mb-2">Rating</h4>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-2">5.0</p>
          <p className="text-text-muted font-inter text-sm sm:text-base">Seller Rating</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
