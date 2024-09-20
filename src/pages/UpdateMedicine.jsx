import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UpdateMedicine = () => {
  const { medicineId } = useParams(); 
  const navigate = useNavigate(); 
  const [medicine, setMedicine] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch medicine details on component mount
  useEffect(() => {
    fetch(`http://localhost:4000/medicines/${medicineId}`)
      .then(response => response.json())
      .then(data => {
        setMedicine(data.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [medicineId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  
    fetch(`http://localhost:4000/medicines/update/${medicineId}`, {
      method: 'PUT',
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
        Swal.fire('Updated!', 'The medicine has been updated.', 'success');
        navigate('/admin-dashboard'); 
      })
      .catch(error => {
        console.error('Update error:', error);
        Swal.fire('Error!', 'Failed to update the medicine.', 'error');
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading medicine details: {error.message}</p>;

  return (
    <div className="update-medicine-container">
      <header className="hero-section bg-light d-flex align-items-center justify-content-center p-5">
        <div className="text-center">
          <h1>Update Medicine</h1>
        </div>
      </header>
      
      <section className="update-form p-5 bg-white">
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

          {/* Add more fields as necessary */}
          
          <button type="submit" className="btn btn-primary">
            Update Medicine
          </button>
        </form>
      </section>
    </div>
  );
};

export default UpdateMedicine;
