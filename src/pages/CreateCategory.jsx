import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:4000/categories/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ name, description })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Category created successfully') {
          Swal.fire('Success', 'Category created successfully!', 'success');
          setName('');
          setDescription('');
        } else {
          setError(data.message);
          Swal.fire('Error', data.message, 'error');
        }
      })
      .catch(error => {
        setError('An error occurred');
        Swal.fire('Error', 'An error occurred while creating the category', 'error');
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Category</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Category Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
