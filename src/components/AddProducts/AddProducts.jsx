import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import "./AddProducts.css";

const AddProducts = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    actualPrice: "",
    materialUsed: "",
    fragranceType: "",
    scentName: "",
    burnTime: "",
    weight: "",
    stock: "",
    collection: "",
    images: [],
  });

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/collections`);
      const data = res?.data?.data || [];
      setCollections(data);
    } catch (err) {
      console.log("Error fetching collections", err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // 🔹 HANDLE TEXT INPUT
  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 HANDLE IMAGE SELECT
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
  };

  // 🔹 SUBMIT PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "images") {
          form.images.forEach((img) => fd.append("image", img)); 
        } else {
          fd.append(key, form[key]);
        }
      });

      const res = await axios.post(`${BASE_URL}/admin/addproduct`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Product added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.log("Error adding product:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">

      <h1>Add New Product</h1>

      <form className="add-prod-form" onSubmit={handleSubmit}>

        {/* NAME */}
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter product name"
          value={form.name}
          onChange={updateField}
          required
        />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Write product description"
          value={form.description}
          onChange={updateField}
          required
        />

        {/* COLLECTION */}
        <label>Select Collection</label>
        <select
          name="collection"
          value={form.collection}
          onChange={updateField}
          required
        >
          <option value="">Select Collection</option>
          {collections.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* PRICE */}
        <label>Price (₹)</label>
        <input
          type="number"
          name="price"
          placeholder="Enter price"
          value={form.price}
          onChange={updateField}
          required
        />

          <label>Actual Price (₹)</label>
        <input
          type="number"
          name="actualPrice"
          placeholder="Enter actual price"
          value={form.actualPrice}
          onChange={updateField}
         
        />

        {/* STOCK */}
        <label>Stock</label>
        <input
          type="number"
          name="stock"
          placeholder="Enter stock quantity"
          value={form.stock}
          onChange={updateField}
          required
        />

        {/* EXTRA DETAILS */}
        <div className="two-grid">
          <div>
            <label>Material Used</label>
            <input
              type="text"
              name="materialUsed"
              value={form.materialUsed}
              onChange={updateField}
              placeholder="Soya Wax"
            />
          </div>

          <div>
            <label>Fragrance Type</label>
            <input
              type="text"
              name="fragranceType"
              value={form.fragranceType}
              onChange={updateField}
              placeholder="Scented"
            />
          </div>
        </div>

        <div className="two-grid">
          <div>
            <label>Scent Name</label>
            <input
              type="text"
              name="scentName"
              value={form.scentName}
              onChange={updateField}
              placeholder="Rose Mary"
            />
          </div>

          <div>
            <label>Burn Time</label>
            <input
              type="text"
              name="burnTime"
              value={form.burnTime}
              onChange={updateField}
              placeholder="1 hour"
            />
          </div>
        </div>

        {/* WEIGHT */}
        <label>Weight</label>
        <input
          type="text"
          name="weight"
          placeholder="400g"
          value={form.weight}
          onChange={updateField}
        />

        {/* IMAGES */}
        <label>Upload Images (Multiple Allowed)</label>
        <input type="file" name="image" multiple onChange={handleImageChange} />

        {form.images.length > 0 && (
          <div className="preview-images">
            {form.images.map((img, i) => (
              <img key={i} src={URL.createObjectURL(img)} alt="preview" />
            ))}
          </div>
        )}

        {/* SUBMIT BTN */}
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
