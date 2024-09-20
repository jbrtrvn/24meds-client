import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

const UserOrder = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    // Fetch the current user's orders
    fetch(`${import.meta.env.VITE_API_URL}/order/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/medicines`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const productMap = {};
          data.data.forEach((product) => {
            productMap[product._id] = {
              name: product.name,
              price: product.price,
            };
          });
          setProducts(productMap);
        } else {
          console.error("No products found in the response");
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="p-5">
      <Button variant="dark" as={Link} to="/buy-medicine">
        <FaArrowLeft />
      </Button>
      <h1 className="text-center color-secondary mb-4">My Order History</h1>
      {orders.length > 0 ? (
        orders.map((order, i) => (
          <div key={i} className="border p-3 my-2">
            <h3 className="mb-2 bg-orange-light p-2">Order #{order._id}</h3>
            <Table>
              <thead>
                <tr className="text-center">
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {order.productsOrdered.map((product, j) => (
                  <tr key={j} className="text-center">
                    <td>
                      {products[product.productId]?.name || "Unknown Product"}
                    </td>
                    <td>
                      &#8369;{" "}
                      {products[product.productId]?.price?.toFixed(2) || "0.00"}
                    </td>
                    <td>{product.quantity}</td>
                    <td>
                      &#8369;
                      {products[product.productId]?.price && product.quantity
                        ? (
                            products[product.productId].price * product.quantity
                          ).toFixed(2)
                        : "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="text-danger">
              <span className="fw-bold">Total Price:</span> &#8369;
              {order.totalPrice?.toFixed(2)}
            </p>
          </div>
        ))
      ) : (
        <h1>No orders found</h1>
      )}
    </div>
  );
};

export default UserOrder;
