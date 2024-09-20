import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateMedicine = () => {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState({
    name: '',
    genericName: '',
    description: '',
    price: '',
    stockQuantity: '',
    expiryDate: '',
    category: '',
  });
  
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  // Fetch available categories from the backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then(response => response.json())
      .then(data => {
        setCategories(data.data); 
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/medicines/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(medicine),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        Swal.fire('Created!', 'New medicine has been created.', 'success');
        setMedicine({
          name: '',
          genericName: '',
          description: '',
          price: '',
          stockQuantity: '',
          expiryDate: '',
          category: '',
        });
        navigate('/create-medicine');
      })
      .catch(error => {
        console.error('Create error:', error);
        Swal.fire('Error!', 'Failed to create medicine.', 'error');
      });
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="create-medicine-container">
      <h1>Create Medicine</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={medicine.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="genericName" className="form-label">Generic Name</label>
          <input
            type="text"
            id="genericName"
            name="genericName"
            className="form-control"
            value={medicine.genericName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={medicine.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            value={medicine.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
          <input
            type="number"
            id="stockQuantity"
            name="stockQuantity"
            className="form-control"
            value={medicine.stockQuantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            className="form-control"
            value={medicine.expiryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            className="form-control"
            value={medicine.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Create Medicine</button>
      </form>
    </div>
  );
};

export default CreateMedicine;
