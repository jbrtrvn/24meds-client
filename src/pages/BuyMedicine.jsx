import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../AuthContext";
import { Modal, Button } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";

const BuyMedicine = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch categories on component mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const fetchMedicinesByCategory = (categoryId) => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        const filteredMedicines = data.data.filter(medicine => medicine.isActive || user?.isAdmin);
        setMedicines(filteredMedicines);
        setSelectedCategory(categoryId);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  

  const handleShowModal = (medicine) => {
    setSelectedMedicine(medicine);
    setQuantity(1);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(prev + change, 1));
  };

  const handleAddToCart = () => {
    const cartItem = {
      productId: selectedMedicine._id,
      quantity,
    };

    fetch(`${import.meta.env.VITE_API_URL}/cart/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(cartItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add to cart");
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire(
          "Success!",
          `${selectedMedicine.name} has been added to your cart.`,
          "success"
        );
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        Swal.fire("Error!", "Failed to add medicine to cart.", "error");
      });
  };

  const selectedCategoryName = categories.find(
    (category) => category._id === selectedCategory
  )?.name;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="buy-medicine-container">
        <header className="hero-section bg-light d-flex align-items-center justify-content-center p-5">
          <div className="text-center">
            <h1>Buy Medicine</h1>
            <p>Select a category to view available medicines.</p>
          </div>
        </header>
        <div className="d-flex my-4 justify-content-end gap-4">
          <Link to="/cart">
            <Button variant="success">
              <FaShoppingCart className=" me-2" />
              View Cart
            </Button>
          </Link>
          <Link to="/my-orders">
            <Button variant="warning">Order History</Button>
          </Link>
        </div>

        {!selectedCategory ? (
          <section className="category-list p-5 bg-white">
            <h2>Categories</h2>
            <div className="row mt-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category._id} className="col-md-4 mb-4">
                    <div className="category-card">
                      <h3>{category.name}</h3>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => fetchMedicinesByCategory(category._id)}
                      >
                        View Medicines
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No categories available.</p>
              )}
            </div>
          </section>
        ) : (
          <section className="medicine-list p-5 bg-white">
  <button
    onClick={() => setSelectedCategory(null)}
    className="btn btn-secondary mb-4"
  >
    Back to Categories
  </button>
  <h2>{selectedCategoryName || "Medicines in Selected Category"}</h2>
  <div className="row mt-4">
    {medicines.length > 0 ? (
      medicines.map((medicine) => (
        (medicine.isActive || user?.isAdmin) && (
          <div key={medicine._id} className="col-md-4 mb-4">
            <div className="medicine-card">
              <h3>{medicine.name}</h3>
              <p>Price: ${medicine.price}</p>
              {!user?.isAdmin && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleShowModal(medicine)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        )
      ))
    ) : (
      <p>No medicines available in this category.</p>
    )}
  </div>
</section>

        )}

        {/* Modal for adding medicine to cart */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMedicine?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedMedicine?.description}</p>
            <p>Price: ${selectedMedicine?.price}</p>
            <p>Stock Quantity: {selectedMedicine?.stockQuantity}</p>
            <div className="quantity-controls d-flex align-items-center">
              <Button
                variant="secondary"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="mx-2">{quantity}</span>
              <Button
                variant="secondary"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default BuyMedicine;
