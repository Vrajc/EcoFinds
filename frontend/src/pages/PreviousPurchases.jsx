import { useState, useEffect } from 'react';
import api from '../utils/api';

const PreviousPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await api.get('/purchases');
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-8">Purchase History</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">No purchases yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="card p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={purchase.product.imageUrl || '/placeholder-image.jpg'}
                    alt={purchase.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{purchase.product.title}</h3>
                  <p className="text-text-muted mb-2">
                    Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </p>
                  <p className="text-xl font-bold text-primary">₹{purchase.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousPurchases;
