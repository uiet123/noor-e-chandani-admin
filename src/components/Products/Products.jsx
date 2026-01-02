import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import "./Products.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/products`);
      const data = res?.data?.data || res?.data?.products || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/collections`);
      const data = res?.data?.data || res?.data?.collections || [];
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Collection fetch error", err);
    }
  };

  const deleteThisProduct = async (id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/deleteProduct`,
        { id },
        {
          withCredentials: true,
        }
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product successfully deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const filteredProducts =
    selectedCollection === "All"
      ? products
      : products.filter(
          (p) =>
            p.collection?.name?.toLowerCase() ===
            selectedCollection.toLowerCase()
        );

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <h1>Products</h1>
        <div className="product-collection-btn">
          <button
            className="admin-add-btn"
            onClick={() => navigate("/collections/add")}
          >
            + Add New Collection
          </button>

          <button
            className="admin-add-btn"
            onClick={() => navigate("/products/add")}
          >
            + Add New Product
          </button>
        </div>
      </div>

      <div className="product-top-bar">
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          className="collection-filter"
        >
          <option value="All">All Collections</option>
          {collections.map((col) => (
            <option key={col._id} value={col.name}>
              {col.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="admin-info">Loading products...</p>}
      {error && <p className="admin-error">{error}</p>}

      {/* DESKTOP TABLE VIEW */}
      <div className="admin-products-table-wrapper desktop-only">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Collection</th>
              <th>Price (₹)</th>

              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={
                      Array.isArray(p.image)
                        ? `${BASE_URL}${p.image[0]}`
                        : `${BASE_URL}${p.image}`
                    }
                    alt={p.name}
                    className="admin-prod-img"
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.collection?.name || "-"}</td>
                <td>{p.price}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/products/edit/${p._id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => deleteThisProduct(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="admin-products-card-list mobile-only">
        {filteredProducts.map((p) => (
          <div className="admin-prod-card" key={p._id}>
            <img
              src={
                Array.isArray(p.image)
                  ? `${BASE_URL}${p.image[0]}`
                  : `${BASE_URL}${p.image}`
              }
              alt={p.name}
            />

            <div className="admin-prod-info">
              <h3>{p.name}</h3>
              <p>Collection: {p.collection?.name || "-"}</p>
              <p>Price: ₹{p.price}</p>
            </div>

            <div className="btns-mobile">

            <button
              className="edit-btn"
              onClick={() => navigate(`/products/edit/${p._id}`)}
            >
              Edit
            </button>

            <button
              className="edit-btn"
              onClick={() => deleteThisProduct(p._id)}
            >
              Delete
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
