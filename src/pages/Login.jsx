import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.access) {
          login(data.access); 
          Swal.fire('Success', 'Logged in successfully!', 'success')
            .then(() => navigate('/'));
        } else if (data.error) {
          Swal.fire('Error', data.error, 'error');
        }
      })
      .catch(error => Swal.fire('Error', 'Login failed!', 'error'));
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-outline-primary mt-3">Login</button>
      </form>
    </div>
  );
};

export default Login;
