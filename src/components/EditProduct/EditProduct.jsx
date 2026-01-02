import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import "../AddProducts/AddProducts.css"; 

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

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
    images: [],          // new images (optional)
    oldImages: [],       // existing images
  });

  // 🔹 Fetch collections
  const fetchCollections = async () => {
    const res = await axios.get(`${BASE_URL}/collections`);
    setCollections(res?.data?.data || []);
  };

  // 🔹 Fetch product data
  const fetchProduct = async () => {
    const res = await axios.get(`${BASE_URL}/products/${id}`);
    const p = res.data.data;

    setForm((prev) => ({
      ...prev,
      name: p.name || "",
      description: p.description || "",
      price: p.price || "",
      actualPrice: p.actualPrice || "",
      materialUsed: p.materialUsed || "",
      fragranceType: p.fragranceType || "",
      scentName: p.scentName || "",
      burnTime: p.burnTime || "",
      weight: p.weight || "",
      stock: p.stock || "",
      collection: p.collection?._id || "",
      oldImages: p.image || [],
    }));
  };

  useEffect(() => {
    fetchCollections();
    fetchProduct();
  }, []);

  // 🔹 INPUT CHANGE
  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 IMAGE CHANGE
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
  };

  // 🔹 SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "images") {
          form.images.forEach((img) => fd.append("image", img));
        } else if (key !== "oldImages") {
          fd.append(key, form[key]);
        }
      });

      await axios.patch(
        `${BASE_URL}/admin/updateProduct/${id}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      alert("Product updated successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <h1>Edit Product</h1>

      <form className="add-prod-form" onSubmit={handleSubmit}>
        {/* NAME */}
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateField}
          required
        />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          name="description"
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
          value={form.price}
          onChange={updateField}
          required
        />

        <label>Actual Price (₹)</label>
        <input
          type="number"
          name="actualPrice"
          value={form.actualPrice}
          onChange={updateField}
        />

        {/* STOCK */}
        <label>Stock</label>
        <input
          type="number"
          name="stock"
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
            />
          </div>

          <div>
            <label>Fragrance Type</label>
            <input
              type="text"
              name="fragranceType"
              value={form.fragranceType}
              onChange={updateField}
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
            />
          </div>

          <div>
            <label>Burn Time</label>
            <input
              type="text"
              name="burnTime"
              value={form.burnTime}
              onChange={updateField}
            />
          </div>
        </div>

        {/* WEIGHT */}
        <label>Weight</label>
        <input
          type="text"
          name="weight"
          value={form.weight}
          onChange={updateField}
        />

        {/* EXISTING IMAGES */}
        {form.oldImages.length > 0 && (
          <>
            <label>Existing Images</label>
            <div className="preview-images">
              {form.oldImages.map((img, i) => (
                <img key={i} src={`${BASE_URL}${img}`} alt="old" />
              ))}
            </div>
          </>
        )}

        {/* NEW IMAGES */}
        <label>Replace / Add Images</label>
        <input type="file" multiple onChange={handleImageChange} />

        {form.images.length > 0 && (
          <div className="preview-images">
            {form.images.map((img, i) => (
              <img key={i} src={URL.createObjectURL(img)} alt="preview" />
            ))}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
