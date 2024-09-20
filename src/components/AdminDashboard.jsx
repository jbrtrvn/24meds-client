import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = () => {
    fetch(`${import.meta.env.VITE_API_URL}/medicines`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setMedicines(data.data);
        } else {
          console.error("No medicines found in the response");
        }
      })
      .catch((error) => console.error("Error fetching medicines:", error));
  };

  const handleArchive = (medicineId) => {
    fetch(`${import.meta.env.VITE_API_URL}/medicines/archive/${medicineId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        setMedicines(
          medicines.map((medicine) =>
            medicine._id === medicineId
              ? { ...medicine, isActive: false }
              : medicine
          )
        );
        Swal.fire("Archived!", "The medicine has been archived.", "success");
      })
      .catch(() => {
        Swal.fire("Error!", "Failed to archive the medicine.", "error");
      });
  };

  const handleActivate = (medicineId) => {
    fetch(`${import.meta.env.VITE_API_URL}/medicines/activate/${medicineId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        setMedicines(
          medicines.map((medicine) =>
            medicine._id === medicineId
              ? { ...medicine, isActive: true }
              : medicine
          )
        );
        Swal.fire("Activated!", "The medicine is now available.", "success");
      })
      .catch(() => {
        Swal.fire("Error!", "Failed to activate the medicine.", "error");
      });
  };

  return (
    <div className="p-5">
      <h1 className="text-center color-secondary mb-4">Admin Dashboard</h1>
      <div className="d-flex justify-content-center mb-3">
        <Button variant="dark" as={Link} to="/create-medicine">
          <FaPlus /> Add Medicine
        </Button>
        <Button variant="dark" as={Link} to="/add-category" className="ms-2">
          <FaPlus /> Create Category
        </Button>
        <Button variant="dark" as={Link} to="/view-orders" className="ms-2">
          <FaEye /> View Orders
        </Button>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr className="text-center">
              <th className="w-10">ID</th>
              <th className="w-20">Name</th>
              <th className="w-30">Description</th>
              <th className="w-10">Price</th>
              <th className="w-15">Type of Medicine</th>
              <th className="w-15">Stock</th>
              <th className="w-10">Availability</th>
              <th className="w-15" colSpan="2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine._id} className="text-center">
                <td className="text-truncate" style={{ maxWidth: "80px" }}>
                  {medicine._id}
                </td>
                <td>{medicine.name}</td>
                <td className="text-truncate" style={{ maxWidth: "200px" }}>
                  {medicine.description}
                </td>
                <td>&#8369;{medicine.price.toFixed(2)}</td>
                <td>{medicine.category.name}</td>
                <td>{medicine.stockQuantity}</td>
                <td
                  className={medicine.isActive ? "text-success" : "text-danger"}
                >
                  {medicine.isActive ? "Available" : "Unavailable"}
                </td>
                <td>
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="primary"
                      as={Link}
                      to={`/medicine/update/${medicine._id}`}
                    >
                      Update
                    </Button>
                    {medicine.isActive ? (
                      <Button
                        variant="danger"
                        onClick={() => handleArchive(medicine._id)}
                        className="me-2"
                      >
                        Archive
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => handleActivate(medicine._id)}
                        className="me-2"
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
