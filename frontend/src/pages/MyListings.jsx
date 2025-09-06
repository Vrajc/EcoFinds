import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const MyListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await api.get('/products/user/my-products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch your products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text">My Listings</h1>
        <Link to="/add-product" className="btn-primary">
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg mb-4">You haven't listed any products yet</p>
          <Link to="/add-product" className="btn-primary">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center">
          {products.map((product) => (
            <div key={product._id} className="card p-0 overflow-hidden max-w-sm w-full">
              <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-gray-100">
                <img
                  src={product.imageUrl || '/placeholder-image.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-caveat font-bold text-2xl mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-text-muted text-sm capitalize mb-2">{product.category}</p>
                  <p className="text-2xl font-bold text-primary">₹{product.price}</p>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/products/${product._id}`} className="flex-1">
                    <button className="w-full btn-secondary text-sm py-3">View</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
