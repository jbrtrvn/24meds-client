import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import BuyMedicine from './pages/BuyMedicine';
import AddCategory from './pages/CreateCategory';
import UpdateMedicine from './pages/UpdateMedicine';
import CreateMedicine from './pages/CreateMedicine';
import Profile from './pages/Profile';
import CartView from './pages/CartView';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard';
import ViewOrders from './components/ViewOrders';

function App() {
  return (
    <>
      <AppNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy-medicine" element={<BuyMedicine />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/medicine/update/:medicineId" element={<UpdateMedicine />} />
          <Route path="/create-medicine" element={<CreateMedicine />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/my-orders" element={<OrderHistory/>}/>
          <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
          <Route path="/view-orders" element={<ViewOrders/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
