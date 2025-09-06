import React, { useState } from 'react';
import axios from 'axios'; // Use direct axios import

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, description, image } = formData;
    if (!name || !price || !description || !image) {
      return;
    }

    const productFormData = new FormData();
    productFormData.append('name', name);
    productFormData.append('price', price);
    productFormData.append('description', description);
    productFormData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/api/products', productFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
        // No withCredentials specified, defaults to false
      });
      console.log('Product added:', response.data);
      // Reset form after successful submission
      setFormData({
        name: '',
        price: '',
        description: '',
        image: null,
      });
    } catch (error) {
      console.error('Product creation error:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
      }
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Image:
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;