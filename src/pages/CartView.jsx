import React, { useContext, useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Checkout from "../components/Checkout";

const CartView = () => {
  const [cart, setCart] = useState({ cartItems: [] });
  const [totalSubtotal, setTotalSubtotal] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotalSubtotal();
  }, [cart]);

  const fetchCart = () => {
    fetch(`${import.meta.env.VITE_API_URL}/cart/get-cart`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) {
          setCart(data.cart);
        } else {
          setCart({ cartItems: [] });
        }
      })
      .catch((error) => console.error("Error fetching cart:", error));
  };

  const calculateTotalSubtotal = () => {
    let total = 0;
    if (cart.cartItems) {
      cart.cartItems.forEach((item) => {
        total += item.subtotal || 0;
      });
    }
    setTotalSubtotal(total);
  };

  const handleClearCart = () => {
    fetch(`${import.meta.env.VITE_API_URL}/cart/clear-cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Cart cleared successfully") {
          Swal.fire({
            title: "Cart Cleared",
            icon: "success",
            text: "Cart cleared successfully.",
          }).then(() => {
            setCart({ cartItems: [] });
            setTotalSubtotal(0);
          });
        } else if (data.message === "Cart is already empty") {
          Swal.fire({
            title: "No items in the cart",
            icon: "info",
            text: "Cart is already empty.",
          });
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Failed to clear cart. Please try again.",
          });
        }
      })
      .catch((error) => console.error("Error clearing cart:", error));
  };

  const handleRemoveItem = (productId) => {
    fetch(`${import.meta.env.VITE_API_URL}/cart/${productId}/remove-from-cart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Item removed from the cart successfully") {
          Swal.fire({
            title: "Item Removed",
            icon: "success",
            text: "Item removed from cart successfully.",
          }).then(() => fetchCart());
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Failed to remove item from cart. Please try again.",
          });
        }
      })
      .catch((error) => console.error("Error removing item from cart:", error));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    fetch(`${import.meta.env.VITE_API_URL}/cart/update-cart-quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ productId, quantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Item quantity updated successfully") {
          Swal.fire({
            title: "Quantity Updated",
            icon: "success",
            text: "Item quantity updated successfully.",
          }).then(() => fetchCart());
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Failed to update item quantity. Please try again.",
          });
        }
      })
      .catch((error) => console.error("Error updating item quantity:", error));
  };

  const handleCheckoutModal = () => {
    if (cart.cartItems.length === 0) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No items in the cart to checkout.",
      });
    } else {
      setShowModal(true);
    }
  };

  const renderCartItems = () => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      return (
        <tr>
          <td colSpan="5">No items in the cart</td>
        </tr>
      );
    }

    return cart.cartItems.map((item) => {
      const product = item.productId || {};
      const key = `item-${item._id}-${item.quantity}`;

      return (
        <tr key={key} className="text-center">
          <td>{product.name || "Unknown Product"}</td>
          <td>&#8369;{product.price?.toFixed(2) || "0.00"}</td>
          <td className="d-flex justify-content-evenly align-items-center">
            <Button
              variant="light"
              onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <FaMinus />
            </Button>
            <span>{item.quantity}</span>
            <Button
              variant="light"
              onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
            >
              <FaPlus />
            </Button>
          </td>
          <td>&#8369;{item.subtotal.toFixed(2)}</td>
          <td>
            <Button variant="danger" onClick={() => handleRemoveItem(item.productId._id)}>
              Remove
            </Button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="p-5">
      <Button variant="dark" as={Link} to="/buy-medicine">
        <FaArrowLeft />
      </Button>
      <h2 className="text-center my-4 color-secondary text-uppercase">
        Your Shopping Cart
      </h2>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Option</th>
          </tr>
        </thead>
        <tbody>{renderCartItems()}</tbody>
      </Table>
      <div className="d-flex justify-content-between my-4">
        <h4>Total Subtotal: &#8369;{totalSubtotal.toFixed(2)}</h4>
        <div>
          <Button variant="danger" onClick={handleClearCart}>
            Clear Cart
          </Button>{" "}
          <Button variant="success" onClick={handleCheckoutModal}>
            Checkout
          </Button>
        </div>
      </div>

      {/* Checkout Modal */}
      <Checkout
        show={showModal}
        onHide={() => setShowModal(false)}
        totalSubtotal={totalSubtotal}
        onCheckout={fetchCart}
      />
    </div>
  );
};

export default CartView;
