import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import { addProduct, login } from "./store";

const AddProductForm = () => {
  const admins = useSelector((state) => state.admin.admins);
  const dispatch = useDispatch();

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    theImage: "",
    images: [],
    video: "",
    publisher: "",
    price: "",
    quantity: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      publisher: username,
    };
    dispatch(addProduct(updatedFormData));
    alert("Product added successfully!");
    setFormData({
      name: "",
      description: "",
      category: "",
      theImage: "",
      images: [],
      video: "",
      publisher: "",
      price: "",
      quantity: "",
    });
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
    const isAdmin = admins.find(
      (admin) => admin.username === username && admin.password === password
    );
    if (isAdmin) {
      setLoggedIn(true);
      console.log("admin " + username + " is logged in");
    } else {
      setUsername("");
      setPassword("");
      alert("Password or username incorrect");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddImageInput = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [...prevFormData.images, ""],
    }));
  };

  const handleRemoveImageInput = (index) => {
    setFormData((prevFormData) => {
      const updatedImages = [...prevFormData.images];
      updatedImages.splice(index, 1);
      return {
        ...prevFormData,
        images: updatedImages,
      };
    });
  };

  const handleImageUrlChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedImages = [...prevFormData.images];
      updatedImages[index] = value;
      return {
        ...prevFormData,
        images: updatedImages,
      };
    });
  };

  return (
    <div className="add">
      {loggedIn ? (
        <div>
          <form onSubmit={handleSubmit}>
            <h2>Add Product</h2>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <label>Price:</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <label>Quantity:</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <label>First Image URL:</label>
            <input
              type="text"
              name="theImage"
              value={formData.theImage}
              onChange={handleChange}
              required
            />
            <main>
              <label>Additional Images URL:</label>
              {formData.images.map((image, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name={`image_${index}`}
                    value={image}
                    onChange={(e) => handleImageUrlChange(e, index)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageInput(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddImageInput}>
                Add Image
              </button>
            </main>
            <label>Video URL:</label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              required
            />
            <button type="submit">Add Product</button>
          </form>
        </div>
      ) : (
        <form className="login" onSubmit={loginSubmit}>
          <h2>Login</h2>
          <label>User Name:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default AddProductForm;
