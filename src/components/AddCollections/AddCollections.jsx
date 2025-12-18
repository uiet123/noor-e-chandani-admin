import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import "./AddCollections.css";

const AddCollections = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug);
    fd.append("description", form.description);
    if (image) fd.append("image", image);

    try {
      await axios.post(`${BASE_URL}/admin/addcollection`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Collection added!");
      navigate("/collections/add");
    } catch (err) {
      console.log(err);
      alert("Error adding collection");
    }
  };

  return (
    <div className="add-collection-page">
      <h1>Add Collection</h1>

      <form className="add-collection-form" onSubmit={handleSubmit}>

        <label>Collection Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter collection name"
          onChange={updateField}
          required
        />

        <label>Slug (URL name)</label>
        <input
          type="text"
          name="slug"
          placeholder="dating / festival / wellness"
          onChange={updateField}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          onChange={updateField}
          placeholder="Write collection description"
        ></textarea>

        <label>Upload Cover Image</label>
        <input type="file" accept="image/*" onChange={handleImage} />

        {/* Preview */}
        {image && (
          <div className="preview-box">
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}

        <button type="submit">Add Collection</button>
      </form>
    </div>
  );
};

export default AddCollections;
