import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ['electronics', 'clothing', 'home', 'books', 'sports', 'toys', 'furniture', 'other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.title.trim()) {
        toast.error('Product title is required');
        return;
      }
      
      if (!formData.description.trim()) {
        toast.error('Product description is required');
        return;
      }
      
      if (!formData.category) {
        toast.error('Please select a category');
        return;
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Please enter a valid price');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      console.log('Submitting product data...');
      
      const response = await api.post('/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Product creation response:', response.data);
      
      toast.success(response.data.message || 'Product added successfully!');
      navigate('/my-listings');
    } catch (error) {
      console.error('Product creation error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          'Failed to add product';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8">
      <div className="section-container">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-caveat font-bold text-text mb-3 sm:mb-4">Add New Product</h1>
            <p className="text-base sm:text-lg lg:text-xl text-text-muted font-inter">List your item and give it a new life</p>
          </div>

          {/* Form Card */}
          <div className="card-elevated p-6 sm:p-8 md:p-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-base sm:text-lg font-caveat font-semibold text-text mb-2 sm:mb-3">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter product title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-caveat font-semibold text-text mb-2 sm:mb-3">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="input-field resize-none"
                    placeholder="Describe your product in detail..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-caveat font-semibold text-text mb-2 sm:mb-3">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="capitalize">
                         {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-base sm:text-lg font-caveat font-semibold text-text mb-2 sm:mb-3">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-base sm:text-lg font-bold text-primary">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="input-field pl-6 sm:pl-8"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-caveat font-semibold text-text mb-2 sm:mb-3">Product Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer block"
                    >
                      {image ? (
                        <div className="space-y-2">
                          <div className="text-3xl sm:text-4xl">📸</div>
                          <p className="text-primary font-medium text-sm sm:text-base">{image.name}</p>
                          <p className="text-text-muted text-xs sm:text-sm">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-4xl sm:text-6xl text-gray-400">📤</div>
                          <p className="text-base sm:text-lg font-medium text-text">Upload Product Image</p>
                          <p className="text-text-muted text-sm">Click to select or drag & drop</p>
                          <p className="text-xs text-text-muted">PNG, JPG, WEBP up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-caveat font-semibold mb-3">Preview</h3>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <h4 className="font-semibold text-base sm:text-lg">{formData.title || 'Product Title'}</h4>
                    <p className="text-text-muted text-xs sm:text-sm capitalize">{formData.category || 'Category'}</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">₹{formData.price || '0.00'}</p>
                  </div>
                </div>
              </div>

              {/* Submit Button - Full Width */}
              <div className="lg:col-span-2 pt-4 sm:pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-base sm:text-lg lg:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center space-x-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                      <span>Adding Product...</span>
                    </>
                  ) : (
                    <>
                      <span>Add Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="card p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🌱</div>
                <h3 className="font-caveat text-lg sm:text-xl font-semibold mb-2">Sustainable</h3>
                <p className="text-text-muted text-sm sm:text-base">Give your items a second life</p>
              </div>
              <div className="card p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💰</div>
                <h3 className="font-caveat text-lg sm:text-xl font-semibold mb-2">Earn Money</h3>
                <p className="text-text-muted text-sm sm:text-base">Turn unused items into cash</p>
              </div>
              <div className="card p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🤝</div>
                <h3 className="font-caveat text-lg sm:text-xl font-semibold mb-2">Help Others</h3>
                <p className="text-text-muted text-sm sm:text-base">Help someone find what they need</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
