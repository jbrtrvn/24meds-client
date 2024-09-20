// CheckoutModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

const Checkout = ({ show, onHide, totalSubtotal, onCheckout }) => {
  const handleCheckout = () => {
    fetch("http://localhost:4000/order/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Ordered successfully.") {
          onHide(); 
          Swal.fire({
            title: "Order Successful",
            icon: "success",
            text: "Order placed successfully.",
          }).then(() => {
            onCheckout();
          });
        } else if (data.error === "No items to Checkout") {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "No items in the cart to checkout.",
          });
        }
      })
      .catch((error) => console.error("Error during checkout:", error));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to proceed with the checkout?</p>
        <p>Total Subtotal: &#8369;{totalSubtotal.toFixed(2)}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCheckout}>
          Confirm Checkout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Checkout;
