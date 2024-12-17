import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, InputGroup, Modal } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { FaEdit, FaSearch, FaUser } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdDeleteOutline, MdOutlineGrade } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Tstudent({ trainerId, trainerName }) {
  const initialFormData = {
    name: "",
    parentname: "",
    gmail: "",
    dob: "",
    number: "",
    wnumber: "",
    address: "",
    password: "",
    cpassword: "",
    image: null,
  };
  const [trainerStudents, setTrainerStudents] = useState([]);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  // const [image, setImage] = useState(null);

  const goToLogin = () => {
    navigate("/");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Additional state for edit mode and student ID
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);

  const handleShowDeleteModal = (id) => {
    setDeleteStudentId(id);
    setShowDeleteModal(true);
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (value) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.parentname) tempErrors.parentname = "Parent name is required";
    if (!formData.gmail) tempErrors.gmail = "Gmail is required";
    if (!formData.dob) tempErrors.dob = "Date of Birth is required";
    if (!formData.number) tempErrors.number = "Number is required";
    if (!formData.wnumber) tempErrors.wnumber = "WhatsApp Number is required";
    if (!formData.address) tempErrors.address = "Address is required";
    if (!formData.password) tempErrors.password = "Password is required";
    if (formData.password !== formData.cpassword)
      tempErrors.cpassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleShowEdit = (student) => {
    setFormData({
      name: student.name,
      parentname: student.parentname,
      gmail: student.gmail,
      dob: student.dob,
      number: student.number,
      wnumber: student.wnumber,
      address: student.address,
      image:student.image || null,
      password: "",
      cpassword: "",
    });
    setEditStudentId(student.id);
    setIsEditMode(true);
    setShow(true);
    setEdit(true);
  };

  const handleTSgrade = async (student) => {
    const idtosend = {
      trainerId,
      studentId: student,
      action: "grade",
    };
    await axios
      .post("https://www.globalschoolofyoga.com/grade/api/getTrainerstudentGrade.php", idtosend)
      .then((res) => {
        console.log(res.data);
        navigate("/trainer-student-grade", {
          state: { trainerId, studentId: student.id },
        }); // Pass state
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  const handleDelete = async () => {
    const deleteDatas = {
      action: "delete",
      trainerId,
      studentId: deleteStudentId,
    };
    await axios
      .post("https://www.globalschoolofyoga.com/grade/api/editTrainerStudent.php", deleteDatas)
      .then((res) => {
        if (res.data.status === 1) {
          console.log("deleted");
          toast.success("Successfully student Deleted");
          setTrainerStudents((prev) =>
            prev.filter((student) => student.id !== deleteStudentId)
          );
          setDel(true);
          setShowDeleteModal(false);
        } else {
          toast.warn("something went worng");
          setShowDeleteModal(false);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while deleting the student", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("parentname", formData.parentname);
        payload.append("gmail", formData.gmail);
        payload.append("number", formData.number);
        payload.append("wnumber", formData.wnumber);
        payload.append("address", formData.address);
        payload.append("password", formData.password);
        payload.append("dob", formData.dob);
        payload.append("roll", roll);
        payload.append("enroll", enroll);
        payload.append("trainerId", trainerId);
        payload.append("trainerName", trainerName);
        payload.append("studentId", editStudentId);
        payload.append("action", isEditMode ? "upload" : "create");

        if(formData.image instanceof File){
          payload.append("image",formData.image)
        }else if (isEditMode){
          payload.append("exitingImage",formData.image)
        }

        const url = isEditMode
          ? "https://www.globalschoolofyoga.com/grade/api/editTrainerStudent.php"
          : "https://www.globalschoolofyoga.com/grade/api/regTrainerStudent.php";

        const response = await axios.post(url, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data && response.data.status === 1) {
          console.log(response.data);
          if (isEditMode) {
            setTrainerStudents((prev) =>
              prev.map((student) =>
                student.id === editStudentId
                  ? response.data.updatedStudent
                  : student
              )
            );
            toast.success("Student updated successfully");
          } else {
            toast.success("Student added successfully");
            setTrainerStudents((prev) => [...prev, response.data.newStudent]);
          }
          resetFormData();
          setShow(false);
        } else {
          toast.warn("Form submission failed: " + response.data.message);
        }
      } catch (error) {
        toast.error(isEditMode ? "Failed to update" : "Failed to create");
      }
    }
  };

  const [roll, setRollNumber] = useState("");
  const [enroll, setEnRollNumber] = useState("");

  const getRollAndEnroll =()=>{
    const dataToSend = new FormData();
    dataToSend.append("action", "getNumbers");
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/register.php",dataToSend)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 1) {
          setRollNumber(res.data.roll);
          setEnRollNumber(res.data.enroll);
        } else {
          console.log("something error");
        }
      });
  }

  const getAllTrainerStudents = () => {
    const dataToSend = new FormData();

    dataToSend.append("trainerId", trainerId);

    axios
      .post("https://www.globalschoolofyoga.com/grade/api/regTrainerStudent.php", dataToSend)
      .then((res) => {
        if (res.data && res.data.status === 1) {
          const data = Array.isArray(res.data.newStudent)
            ? res.data.newStudent
            : [];
          setTrainerStudents(data);
        } else {
          toast.error("Failed to fetch");
        }
      })
      .catch((error) => {
        toast.error("Error fetching newStudent", error);
      });
  };

  useEffect(() => {
    getAllTrainerStudents();
    getRollAndEnroll()
  }, [add, edit, del, trainerId]);

  // Call this function to reset the modal state when closing
  const resetFormData = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
    setEditStudentId(null);
  };
  return (
    <div className="student_section">
      <div className="d-flex justify-content-between mb-5">
        <div>
          <h2>Students Management</h2>
        </div>
        <div>
          <a
            href
            onClick={() => {
              navigate("/Trainer-details");
            }}
          >
            <FaUser className="user-icon me-2" />
          </a>
          <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>
      <InputGroup className="search-input mb-5">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="shadow-none"
        />
      </InputGroup>
      <Button
        variant="primary shadow-none"
        onClick={handleShow}
        className="edit py-2 px-3 mb-4"
      >
        Add Student
      </Button>
      {/* exit modal */}
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog ">
          <div class="modal-content">
            <div class="modal-body text-center">Are You Want to Exit?</div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button type="button" class="btn btn-primary" onClick={goToLogin}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* delete modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Body className="py-3 fs-5 text-center">
          Are you sure you want to delete this student?
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete();
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          resetFormData();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Edit Student" : "Add New Student"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-around p-0">
          <Form
            autoComplete="off"
            className="add-trainer p-3"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-3">
              {isEditMode ? "Update For Student" : "Register For Student"}
            </h2>
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
              {/* Parent Name Input */}
              <div className="col-md-6 form-controls">
                <label htmlFor="parentname">
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
              {/* Gmail Input */}
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
              {/* Date of Birth Input */}
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
              {/* Password Input */}
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
                {errors.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>
              {/* Confirm Password Input */}
              <div className="col-md-6 form-controls">
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
              {/* Phone and WhatsApp Number Input */}
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
                {errors.wnumber && (
                  <div className="error">{errors.wnumber}</div>
                )}
              </div>
              {/* Address Input */}
              <div className="col-lg-6 form-controls">
                <label htmlFor="address">Address</label>
                <textarea
                  name="address"
                  rows="1"
                  cols="25"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mb-2"
                ></textarea>
                {errors.address && (
                  <div className="error">{errors.address}</div>
                )}
              </div>
              <div className="col-lg-6 ">
                <label htmlFor="imageInput">Upload Image</label>
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
            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-3 ht_btn"
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
          </Form>
          <ToastContainer />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
              resetFormData();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="table-scroll">
        <table className="table-fill" striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>PROFILE</th>
              <th>NAME</th>
              <th>PARENTNAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>Password</th>
              <th>CREATED DATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {trainerStudents
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.name.toLowerCase().includes(search);
              })
              .map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`https://www.globalschoolofyoga.com/grade/api/${item.image}`}
                      alt="StudentProfile"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.parentname}</td>
                  <td>{item.gmail}</td>
                  <td>{item.number}</td>
                  <td>{item.password}</td>
                  <td>{item.dob}</td>
                  <td>
                    <ButtonGroup>
                      <Button
                        variant="outline-success shadow-none"
                        className="edit py-2 px-3"
                        onClick={() => {
                          handleShowEdit(item);
                        }}
                      >
                        EDIT <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleShowDeleteModal(item.id)}
                      >
                        Delete <MdDeleteOutline />
                      </Button>
                      <Button
                        variant="outline-primary shadow-none"
                        className="apply"
                        onClick={() => {
                          handleTSgrade(item.id);
                        }}
                      >
                        View Grade <MdOutlineGrade />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
