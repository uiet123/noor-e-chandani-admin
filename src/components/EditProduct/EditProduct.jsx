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
  const [colorInput, setColorInput] = useState("");
  const [fragranceInput, setFragranceInput] = useState("");

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

    customizationType: "ADMIN_DEFINED",

    fixedColor: "",
    availableColors: [],

    fixedFragrance: "",
    availableFragrances: [],

    images: [],
    oldImages: [],
  });

  const DEFAULT_USER_COLORS = [
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Orange",
    "Pink",
    "White",
  ];

  const DEFAULT_USER_FRAGRANCES = [
    "Iceburg",
    "First Spring",
    "Rose",
    "British Rose",
    "Vanilla",
    "Rose Mary",
    "Cherry",
    "Mix Fruit",
    "Fresh Oudh",
    "Coffee",
    "Masala Chai",
    "Orange",
    "Sandalwood",
    "Lavender",
    "Watermelon",
    "Cinnamon",
    "Jasmine",
    "Lemon",
    "Whiskey",
    "Mango",
    "Chocolate",
    "Ocean Breeze",
    "Strawberry",
  ];

  const fetchCollections = async () => {
    const res = await axios.get(`${BASE_URL}/collections`);
    setCollections(res?.data?.data || []);
  };

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

      customizationType: p.customizationType || "ADMIN_DEFINED",

      fixedColor: p.fixedColor || "",
      fixedFragrance: p.fixedFragrance || "",

      availableColors: p.availableColors || [],
      availableFragrances: p.availableFragrances || [],

      oldImages: p.image || [],
    }));
  };

  const addColor = () => {
    if (!colorInput.trim()) return;

    if (form.availableColors.includes(colorInput.trim())) {
      setColorInput("");
      return;
    }

    setForm({
      ...form,
      availableColors: [...form.availableColors, colorInput.trim()],
    });
    setColorInput("");
  };

  const addFragrance = () => {
    if (!fragranceInput.trim()) return;

    if (form.availableFragrances.includes(fragranceInput.trim())) {
      setFragranceInput("");
      return;
    }

    setForm({
      ...form,
      availableFragrances: [...form.availableFragrances, fragranceInput.trim()],
    });
    setFragranceInput("");
  };

  useEffect(() => {
    fetchCollections();
    fetchProduct();
  }, []);

  // 🔹 INPUT CHANGE
  const updateField = (e) => {
    const { name, value } = e.target;

    // 🔥 SAME AS ADD PRODUCT
    if (name === "customizationType") {
      if (value === "USER_DEFINED") {
        setForm({
          ...form,
          customizationType: value,
          availableColors:
            form.availableColors.length > 0
              ? form.availableColors
              : DEFAULT_USER_COLORS,
          availableFragrances:
            form.availableFragrances.length > 0
              ? form.availableFragrances
              : DEFAULT_USER_FRAGRANCES,
          fixedColor: "",
          fixedFragrance: "",
        });
      } else {
        setForm({
          ...form,
          customizationType: value,
          fixedColor: "",
          fixedFragrance: "",
          availableColors: [],
          availableFragrances: [],
        });
      }
      return;
    }

    setForm({ ...form, [name]: value });
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

      await axios.patch(`${BASE_URL}/adminEdit/updateProduct/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

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
        <label>Customization Type</label>
        <select
          name="customizationType"
          value={form.customizationType}
          onChange={updateField}
        >
          <option value="ADMIN_DEFINED">Admin Defined</option>
          <option value="USER_DEFINED">User Defined</option>
        </select>

        {form.customizationType === "ADMIN_DEFINED" && (
          <>
            <label>Fixed Candle Color</label>
            <input
              type="text"
              name="fixedColor"
              placeholder="e.g. Lemon Yellow"
              value={form.fixedColor}
              onChange={updateField}
              required
            />

            <label>Fixed Fragrance</label>
            <input
              type="text"
              name="fixedFragrance"
              placeholder="e.g. Lemon"
              value={form.fixedFragrance}
              onChange={updateField}
            />
          </>
        )}

        {form.customizationType === "USER_DEFINED" && (
          <>
            {/* AVAILABLE COLORS */}
            <label>Available Colors</label>
            <div className="chip-input-row">
              <input
                type="text"
                placeholder="Type color"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColor();
                  }
                }}
              />

              <button type="button" className="add-btn" onClick={addColor}>
                Add
              </button>
            </div>

            <div className="chips">
              {form.availableColors.map((c, i) => (
                <span key={i} className="chip">
                  {c}
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        availableColors: form.availableColors.filter(
                          (_, idx) => idx !== i
                        ),
                      })
                    }
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {/* AVAILABLE FRAGRANCES */}
            <label>Available Fragrances</label>
            <div className="chip-input-row">
              <input
                type="text"
                placeholder="Type fragrance"
                value={fragranceInput}
                onChange={(e) => setFragranceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFragrance();
                  }
                }}
              />

              <button type="button" className="add-btn" onClick={addFragrance}>
                Add
              </button>
            </div>

            <div className="chips">
              {form.availableFragrances.map((f, i) => (
                <span key={i} className="chip">
                  {f}
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        availableFragrances: form.availableFragrances.filter(
                          (_, idx) => idx !== i
                        ),
                      })
                    }
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </>
        )}

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
        </div>

        <div className="two-grid">
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
