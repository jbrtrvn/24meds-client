import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // State for change password modal
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: ''
  });
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:4000/users/details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.user);
        setFormValues({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          mobileNo: data.user.mobileNo
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formValues)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      Swal.fire('Updated!', 'Profile has been updated', 'success');
      setProfile(updatedProfile.user); // Update profile state
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire('Error!', 'Failed to update profile.', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      Swal.fire('Error!', 'New password and confirm password do not match.', 'error');
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(passwordValues)
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      Swal.fire('Updated!', 'Password has been changed', 'success');
      setPasswordValues({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordModal(false); // Close the password change modal
    } catch (error) {
      console.error('Password change error:', error);
      Swal.fire('Error!', 'Failed to change password.', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {profile ? (
        <div>
          <p><strong>First Name:</strong> {profile.firstName}</p>
          <p><strong>Last Name:</strong> {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile No:</strong> {profile.mobileNo}</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>Edit Profile</Button>
          <Button variant="secondary" className="ms-2" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
          <Button variant="danger" className="ms-2" onClick={handleLogout}>Logout</Button>

          {/* Edit Profile Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update Profile</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleUpdateProfile}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile No</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNo"
                    value={formValues.mobileNo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Update Profile</Button>
              </Modal.Footer>
            </Form>
          </Modal>
          {/* End Edit Profile Modal */}

          {/* Change Password Modal */}
          <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleChangePassword}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={passwordValues.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordValues.newPassword}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordValues.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Change Password</Button>
              </Modal.Footer>
            </Form>
          </Modal>
          {/* End Change Password Modal */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
