import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { PiStudentBold } from "react-icons/pi";
import { SiTrainerroad } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const goToReg = () => {
    navigate("/registration");
  };

  const trainerReg = () => {
    navigate("/trainerReg");
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialFormData = {
    name: "",
    password: "",
    role: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.password) tempErrors.password = "Password is required";
    if (!formData.role) tempErrors.role = "Role is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSend = new FormData();

      dataToSend.append("name", formData.name);
      dataToSend.append("password", formData.password);
      dataToSend.append("action", formData.role);

      axios
        .post("https://www.globalschoolofyoga.com/grade/api/login.php", dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data&& response.data.status===1) {
          //  console.log(response.data, "data");
            const { id,name } = response.data.user;

            if (formData.role === "individualstudent") {
              localStorage.setItem("studentId", id);
              localStorage.setItem("studentName", name);
              onLogin(formData.role, id, name, null, null);
              toast("Login Successfully", { autoClose: 2000 });
              navigate("/student-dashboard");
            
            } else if (formData.role === "trainer") {
              localStorage.setItem("trainerId", id);
              localStorage.setItem("trainerName", name);
              onLogin(formData.role, null, null, id, name);
              toast("Login Successfully", { autoClose: 2000 });
              navigate("/trainer-dashboard");
            }

          } else {
            toast.warning("Invalid credentials");
          }
        })
        .catch((e) => {
          console.log(e.message, "Error in login request");
          toast.error("Server error, please try again later");
        });
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-around my-4">
          <p
            className="m-0 categroy"
            name=""
            onClick={goToReg}
            style={{ cursor: "pointer" }}
          >
            <PiStudentBold /> Student
          </p>
          <p
            className="m-0 categroy"
            onClick={trainerReg}
            style={{ cursor: "pointer" }}
          >
            <SiTrainerroad /> Trainer
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <h2 className="text-center my-3">Login Page</h2>
        <div className="col-12 form-controls">
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
        <div className="col-12 form-controls">
          <label htmlFor="password">Password</label>
          <div className="input-group mb-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
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
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="row py-3">
          <div className="col-md-6 d-flex">
            <input
              type="radio"
              id="individualstudent"
              name="role"
              className="w-auto"
              value="individualstudent"
              checked={formData.role === "individualstudent"}
              onChange={handleChange}
            />
            <label htmlFor="individualstudent" className="m-0 ps-2">
              Student
            </label>
          </div>
          <div className="col-md-6 d-flex">
            <input
              type="radio"
              id="trainer"
              name="role"
              className="w-auto"
              value="trainer"
              checked={formData.role === "trainer"}
              onChange={handleChange}
            />
            <label htmlFor="trainer" className="m-0 ps-2">
              Trainer
            </label>
          </div>
          {errors.role && <div className="error">{errors.role}</div>}
        </div>
        <p
          style={{ cursor: "pointer" }}
          className="text-right"
          onClick={handleShow}
        >
          Create an Account?
        </p>
        <button  type="submit" className="mt-3 ht_btn">
          Submit
        </button>
      </Form>
      <ToastContainer />
    </div>
  );
}
