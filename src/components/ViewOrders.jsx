import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch all orders
    fetch("http://localhost:4000/order/all-orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.orders) {
          setOrders(data.orders);
        } else {
          console.error("No orders found in the response");
        }
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleProcessOrder = (orderId) => {
    fetch(`http://localhost:4000/order/process/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ status: "Processed" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, status: "Processed" } : order
            )
          );
        } else {
          console.error(data.error || "Failed to process order");
        }
      })
      .catch((error) => console.error("Error processing order:", error));
  };
  

  return (
    <div className="p-5">
      <h1 className="text-center color-secondary mb-4">View Orders</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>User</th>
            <th>Total Price</th>
            <th>Products Ordered</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="text-center">
              <td>{order._id}</td>
              <td>
                {order.userId
                  ? `${order.userId.firstName} ${order.userId.lastName}`
                  : "N/A"}
              </td>
              <td>&#8369; {order.totalPrice.toFixed(2)}</td>
              <td>
                <ul>
                  {order.productsOrdered.map((product, index) => (
                    <li key={index} className="text-start">
                      {product.productId
                        ? product.productId.name
                        : "Unknown Product"}{" "}
                      - {product.quantity} x &#8369;{" "}
                      {product.subtotal.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{order.status}</td>
              <td>
                {order.status !== "Processed" ? (
                  <Button
                    variant="info"
                    onClick={() => handleProcessOrder(order._id)}
                  >
                    Process
                  </Button>
                ) : (
                  <span>Processed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewOrders;
