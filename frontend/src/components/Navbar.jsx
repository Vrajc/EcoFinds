import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);

  // Close desktop menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsDesktopMenuOpen(false);
  };

  // Hide search bar on login and signup pages
  const hideSearchBar = location.pathname === '/login' || location.pathname === '/signup';

  const navigationLinks = [
    { name: 'Impact', path: '/community-impact', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    ...(user ? [
      { name: 'Messages', path: '/chats', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
      { name: 'Dashboard', path: '/dashboard', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' }
    ] : [])
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="section-container">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/logo.png" 
                alt="EcoFinds Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover"
              />
              <div className="text-xl sm:text-2xl lg:text-3xl font-caveat font-bold text-primary">EcoFinds</div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          {!hideSearchBar && (
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8 xl:mx-12">
              <SearchBar />
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Desktop Hamburger Menu */}
                <div className="relative" ref={desktopMenuRef}>
                  <button
                    onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isDesktopMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {isDesktopMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      {/* Menu Header */}
                      <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
                        <h3 className="font-caveat font-bold text-lg">Quick Access</h3>
                        <p className="text-white/80 text-sm">Navigate your EcoFinds experience</p>
                      </div>

                      <div className="p-4">
                        <div className="space-y-1">
                          {/* Navigation Links */}
                          {navigationLinks.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={() => setIsDesktopMenuOpen(false)}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                                </svg>
                              </div>
                              <span className="text-text font-medium group-hover:text-primary transition-colors">{link.name}</span>
                            </Link>
                          ))}

                          {/* Divider */}
                          <div className="border-t border-gray-100 my-2"></div>

                          {/* Cart Link in Desktop Menu */}
                          <Link
                            to="/cart"
                            onClick={() => setIsDesktopMenuOpen(false)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 21h12M9 19v.01M20 19v.01"></path>
                                </svg>
                              </div>
                              <span className="text-text font-medium group-hover:text-primary transition-colors">Shopping Cart</span>
                            </div>
                            {getCartCount() > 0 && (
                              <span className="bg-accent text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                                {getCartCount()}
                              </span>
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="btn-ghost">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="btn-primary">Sign Up</button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <Link to="/cart" className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 21h12M9 19v.01M20 19v.01"></path>
                  </svg>
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </button>
              </Link>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {!hideSearchBar && (
          <div className="lg:hidden pb-4">
            <SearchBar />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="section-container py-4">
            <div className="space-y-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                  </svg>
                  <span className="text-text font-medium">{link.name}</span>
                </Link>
              ))}

              {user ? (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-text font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/my-listings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-text font-medium">My Listings</span>
                  </Link>
                  <Link
                    to="/profile/edit"
                    onClick={() => setIsMenuOpen(false)}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-text font-medium">Edit Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <button className="w-full btn-ghost justify-start">Login</button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <button className="w-full btn-primary justify-center">Sign Up</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
