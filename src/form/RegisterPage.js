import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/");

  const initialFormData = {
    name: "",
    parentname: "",
    dob: "",
    number: "",
    wnumber: "",
    address: "",
    password: "",
    cpassword: "",
    gmail: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roll, setRollNumber] = useState("");
  const [enroll, setEnRollNumber] = useState("");

  // Handle input changes, including file input for the image
  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (name === "image" && files.length > 0) {
  //     setFormData({ ...formData, image: files[0] });
  //   } else {
  //     setFormData({ ...formData, [name]: value });
  //   }
  //   if (value) setErrors({ ...errors, [name]: "" });
  // };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    // Check if the input is the image field and has a file selected
    if (name === "image" && files.length > 0) {
      let file = files[0];
      const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes
  
      // Validate file type (JPEG only)
      if (!["image/jpeg", "image/jpg"].includes(file.type)) {
        toast.error("Please upload a JPEG image.");
        setFormData({ ...formData, image: null }); // Clear image in form data
        return;
      }
  
      // Validate file size (max 2MB)
      if (file.size > maxFileSize) {
        toast.error("Image size should be less than 2MB.");
        setFormData({ ...formData, image: null }); // Clear image in form data
        return;
      }
  
      // Replace spaces with underscores in the filename
      const newFileName = file.name.replace(/\s+/g, "_");
      const renamedFile = new File([file], newFileName, { type: file.type });
  
      // If all validations pass, set the renamed file in formData
      setFormData({ ...formData, image: renamedFile });
    } else {
      // Handle other form fields
      setFormData({ ...formData, [name]: value });
    }
  
    // Clear any error message for the current field
    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  

  // Validate input fields
  const validate = () => {
    const tempErrors = {};
    if (!formData.name || formData.name.length < 3)
      tempErrors.name = "Name must be at least 3 characters.";
    if (!formData.gmail || !/^[\w.%+-]+@gmail\.com$/i.test(formData.gmail))
      tempErrors.gmail = "Enter a valid Gmail address.";
    if (!formData.number || !/^\d{10}$/.test(formData.number))
      tempErrors.number = "Enter a valid 10-digit phone number.";
    if (!formData.wnumber || !/^\d{10}$/.test(formData.wnumber))
      tempErrors.wnumber = "Enter a valid WhatsApp number.";
    if (!formData.address || formData.address.length < 10)
      tempErrors.address = "Address must be at least 10 characters.";
    if (!formData.password || !/^(?=.*[A-Z])(?=.*[\W]).{8,}$/.test(formData.password))
      tempErrors.password =
        "Password must have at least 8 characters, one uppercase letter, and one symbol.";
    if (formData.password !== formData.cpassword)
      tempErrors.cpassword = "Passwords do not match.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Fetch roll and enroll numbers on component mount
  useEffect(() => {
    const dataToSend = new FormData();
    dataToSend.append("action", "getNumbers");
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/register.php",dataToSend)
      .then((res) => {
        if (res.data.status === 1) {
          setRollNumber(res.data.roll);
          setEnRollNumber(res.data.enroll);
        } else {
          console.error("Error fetching roll and enroll numbers.");
        }
      });
  }, []);

  // Handle form submission with image upload
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });
      dataToSend.append("roll", roll);
      dataToSend.append("enroll", enroll);
      dataToSend.append("action", "create");

      axios
        .post("https://www.globalschoolofyoga.com/grade/api/register.php", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.data.status === 1) {
            toast.success("Submitted Successfully!");
            setFormData(initialFormData);
            document.getElementById("imageInput").value = "";
            goToLogin();
          } else {
            toast.error("Failed to create record.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Submission failed.");
        });
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <h2 className="text-center mb-3">Register For Student</h2>
        <div className="row">
          <div className="col-md-6 form-controls">
            <label htmlFor="roll">RollNo:</label>
            <input
              style={{ cursor: "not-allowed" }}
              type="text"
              id="roll"
              name="roll"
              value={roll}
              readOnly
              className="mb-2"
            />
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="enroll">enrollNo:</label>
            <input
              style={{ cursor: "not-allowed" }}
              type="text"
              id="enroll"
              name="enroll"
              value={enroll}
              readOnly
              className="mb-2"
            />
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="parentname" className="parentname">
              Father's/Husband's/Guardian's Name
            </label>
            <input
              type="text"
              id="parentname"
              name="parentname"
              value={formData.parentname}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.parentname && (
              <div className="error">{errors.parentname}</div>
            )}
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="gmail">Gmail</label>
            <input
              type="text"
              id="gmail"
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.gmail && <div className="error">{errors.gmail}</div>}
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.dob && <div className="error">{errors.dob}</div>}
          </div>
          <div className="col-md-6 form-controls password">
            <label htmlFor="password">Create Password</label>
            <div className="input-group mb-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
              <span
                className="input-group-text"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </span>
            </div>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <div className="col-md-6 form-controls ">
            <label htmlFor="cpassword">Confirm Password</label>
            <div className="input-group mb-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="cpassword"
                name="cpassword"
                value={formData.cpassword}
                onChange={handleChange}
                className="form-control"
              />
              <span
                className="input-group-text"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </span>
            </div>
            {errors.cpassword && (
              <div className="error">{errors.cpassword}</div>
            )}
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="number">Number</label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.number && <div className="error">{errors.number}</div>}
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="wnumber">WhatsApp Number</label>
            <input
              type="text"
              id="wnumber"
              name="wnumber"
              value={formData.wnumber}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.wnumber && <div className="error">{errors.wnumber}</div>}
          </div>
          <div className="col-12 form-controls">
            <label htmlFor="address">Address</label>
            <textarea
              name="address"
              rows="3"
              cols="25"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="mb-1"
            ></textarea>
            {errors.address && <div className="error">{errors.address}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="imageInput"
              name="image"
              onChange={handleChange}
              className="mb-2"
            />
            {errors.image && <div className="error">{errors.image}</div>}
          </div>
        </div>
        <a href="#" className="text-right" onClick={goToLogin}>
          Already Have an Account?
        </a>
        <button type="submit" className="mt-3 ht_btn">
          Submit
        </button>
      </Form>
      <ToastContainer />
    </div>
  );
}
