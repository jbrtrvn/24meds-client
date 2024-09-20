import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(response => response.json())
        .then(data => {
          if (data.user && data.user.firstName) {
            setUser(data.user);
          } else {
            console.error('Invalid user data:', data);
            setUser(null);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
