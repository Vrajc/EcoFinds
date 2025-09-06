import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import toast from 'react-hot-toast';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const search = searchParams.get('search') || '';
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);

      console.log('Fetching products with params:', params.toString());
      
      const response = await api.get(`/products?${params.toString()}`);
      console.log('Products response:', response.data);
      
      // Handle both old format (array) and new format (object with data)
      const productsData = response.data.data || response.data;
      
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        console.log(`Loaded ${productsData.length} products`);
      } else {
        console.error('Unexpected response format:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      console.error('Error response:', error.response?.data);
      setProducts([]);
      
      // Only show error toast if it's not a network error during initial load
      if (error.response?.status !== 500) {
        toast.error(error.response?.data?.message || 'Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="section-container py-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="card p-0 overflow-hidden animate-pulse w-full max-w-sm">
              <div className="aspect-[4/3] bg-gray-200 rounded-t-xl sm:rounded-t-2xl"></div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-caveat font-bold text-text mb-4 sm:mb-6">
              Discover Sustainable Second-Hand Items
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-text-muted font-inter max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Find quality pre-loved items and give them a new life. Join our community of sustainable shoppers.
            </p>
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4">
              <Link to="/signup" className="btn-primary w-full xs:w-auto">Start Shopping</Link>
              <Link to="/products" className="btn-secondary w-full xs:w-auto">Browse Products</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {products.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-caveat font-semibold text-text mb-3 sm:mb-4">No products found</h3>
              <p className="text-text-muted font-inter mb-6 text-sm sm:text-base">Try adjusting your search or browse different categories</p>
              <Link to="/" className="btn-primary">Clear Filters</Link>
            </div>
          ) : (
            <div className="grid-layout">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
