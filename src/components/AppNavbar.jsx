import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import AuthContext from '../AuthContext';
import { FaShoppingCart } from 'react-icons/fa';

const AppNavbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  return (
    <Navbar variant="dark" expand="lg">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">MyApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isLoggedIn && !user?.isAdmin && (
              <Nav.Link as={Link} to="/buy-medicine">Medicine</Nav.Link>
            )}
            {user?.isAdmin && (
              <>
                <Nav.Link as={Link} to="/admin-dashboard">Admin Dashboard</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ms-auto d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <span className="navbar-text me-3">Welcome, {user?.firstName}</span>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link as={Link} to="/logout" onClick={logout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default AppNavbar;
