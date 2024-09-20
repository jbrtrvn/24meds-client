// HomePage.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext'; // Ensure correct path

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="homepage-container">
      <header className="hero-section bg-light d-flex align-items-center justify-content-between p-5">
        <div className="hero-text animate__animated animate__fadeInLeft">
          <h1><i className="fas fa-capsules"></i> Welcome to 24Meds</h1>
          <p>Your trusted online pharmacy. Get your medications delivered right to your doorstep.</p>
          {!isLoggedIn ? (
            <Link to="/login" className="btn btn-primary animate__animated animate__pulse animate__infinite">Get Started</Link>
          ) : (
            <Link to="/buy-medicine" className="btn btn-success animate__animated animate__pulse animate__infinite">Buy Medicine</Link>
          )}
        </div>
        <div className="hero-image animate__animated animate__zoomIn">
          <img src="/images/4.png" alt="Pharmacy Hero" className="img-fluid" />
        </div>
      </header>
      
      <section className="services-section text-center p-5 bg-white">
        <h2 className="animate__animated animate__fadeInUp">Our Services</h2>
        <div className="row mt-4">
          <div className="col-md-4">
            <img src="/images/1.jpg" alt="Online Prescription" className="img-fluid mb-3" loading="lazy" />
            <h3>Online Prescription</h3>
            <p>Consult with licensed pharmacists and get your prescription online.</p>
          </div>
          <div className="col-md-4">
            <img src="/images/2.jpg" alt="Fast Delivery" className="img-fluid mb-3" loading="lazy" />
            <h3>Fast Delivery</h3>
            <p>Receive your medications within 24 hours, anywhere in the city.</p>
          </div>
          <div className="col-md-4">
            <img src="/images/3.jpg" alt="Health Advice" className="img-fluid mb-3" loading="lazy" />
            <h3>Health Advice</h3>
            <p>Get health tips and advice from certified experts right on our platform.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
