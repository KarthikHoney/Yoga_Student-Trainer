import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { FaArrowLeft, FaCloudDownloadAlt, FaRegEye, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function TrainerStudentGrade() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  const viewStudentGrade = () => {
    navigate("/student-view-trainer");
  };

 

  const initialFormData = {
    grade: "",
    payment: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [grades, setGrades] = useState([]);
  const [gradeView, setGradeView] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState(null);

  const [certificateImage,setCertificateImage]=useState(null)
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleShowTrainerModal = () => setShowTrainerModal(true);
  const handleCloseTrainerModal = () => setShowTrainerModal(false);

  const handleShowCertificateModal = () => setShowCertificateModal(true);
  const handleCloseCertificateModal = () => setShowCertificateModal(false);
  

  const fetchCertificate = (studentId, gradeId) => {
    const CertificateData = new FormData();
    CertificateData.append("action", "generateCertificate");
    CertificateData.append("studentId", studentId);
    CertificateData.append("gradeId", gradeId);

    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/certificates.php", CertificateData)
      .then((res) => {
        if (res.data && res.data.status === 1) {
          console.log(res.data.certificate);
          setCertificateImage(res.data.certificate);
          setSelectedGradeId(gradeId);
        } else {
          alert(
            "Failed to generate certificate: " +
              (res.data.message || "Unknown error")
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching certificate:", err);
        alert(
          "An error occurred while fetching the certificate. Please try again."
        );
      });
  };

  const fetchHallTicket = (studentId, gradeId) => {
    const HallTicketData = new FormData();
    HallTicketData.append("action", "generateHallTicket");

    HallTicketData.append("studentId", studentId);
    HallTicketData.append("gradeId", gradeId);

    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/hallTicket.php", HallTicketData)
      .then((res) => {
        if (res.data && res.data.status === 1) {
          console.log(res.data.hallTicket);
          setCertificateImage(res.data.hallTicket);
          setSelectedGradeId(gradeId);
        } else {
          alert(
            "Failed to generate certificate: " +
              (res.data.message || "Unknown error")
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching certificate:", err);
        alert(
          "An error occurred while fetching the certificate. Please try again."
        );
      });
  };


  const handleGrade = () => {
    const dataToSend = new FormData();
    dataToSend.append("action", "getGrade");
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/gradePrice.php", dataToSend)
      .then((res) => {
        if (res.data) {
          const data = res.data.grade;
          const payment = data.reduce((acc, item) => {
            acc[item.id] = item.TrainerPrice;
            return acc;
          }, {});
          setPaymentAmounts(payment);
        }
      });
  };

  const location = useLocation();

  // Get values from location.state or localStorage
  const studentId = location.state?.studentId || localStorage.getItem("studId");
  const trainerId =
    location.state?.trainerId || localStorage.getItem("trainId");

  // Store in localStorage if available from location.state
  useEffect(() => {
    if (location.state?.studentId && location.state?.trainerId) {
      localStorage.setItem("studId", location.state.studentId);
      localStorage.setItem("trainId", location.state.trainerId);
    }
    handleGrade();
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "grade") {
      const payment = paymentAmounts[value] || "";
      setFormData({ ...formData, grade: value, payment: payment });
    }

    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.grade) tempErrors.grade = "Grade is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSend = {
        action: "grade",
        grade: formData.grade,
        payment: formData.payment,
        studentId: studentId,
        trainerId: trainerId,
      };

      axios
        .post("https://www.globalschoolofyoga.com/grade/api/gradeTrainer.php", dataToSend)
        .then((response) => {
          if (response.data && response.data.status === 1) {
            toast.success("Grade Applied Successfully");
            setFormData(initialFormData);

            const gradeData = response.data.data;
            console.log(gradeData);
            if (gradeData) {
              setGrades((previousData) => [...previousData, gradeData]);
              setGradeView(true);
            }
          } else {
            toast.warn("Invalid data or no data returned");
          }
        })
        .catch((error) => {
          console.error("There was an error submitting the form!", error);
        });
    }
  };

  useEffect(() => {
    if (studentId && trainerId) {
      const metaGrade = {
        action: "fetchGrades",
        studentId,
        trainerId,
      };
      axios
        .post("https://www.globalschoolofyoga.com/grade/api/gradeTrainer.php", metaGrade)
        .then((response) => {
          if (response.data && response.data.status === 1) {
            const allData = response.data.grades || [];
            const updatedData = allData.map((items) => ({
              ...items,
              pending: items.mark === "" && items.gradeResult === "",
            }));
            setGrades(updatedData);
          } else {
            console.log("No grades found or invalid data");
          }
        })
        .catch((error) => {
          console.error("Error fetching grades:", error);
        });
    }
  }, [studentId, trainerId]);

  return (
    <div>
      {/* Apply Grade Modal */}
      
      <Modal show={showTrainerModal} onHide={handleCloseTrainerModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apply Grade</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Form
            autoComplete="off"
            className="add-trainer p-3"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-3">Register For Student</h2>
            <div className="row">
              <div className="col-12 form-controls">
                <label htmlFor="grade">Choose Exam Grade</label>
                <select
                  id="grade"
                  className="mb-2"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                >
                  <option value="">Select Grade</option>
                  {Object.keys(paymentAmounts)
                    .filter((grade) => {
                      // Ensure 'grades' is an array and has the necessary properties before filtering
                      return (
                        grades &&
                        Array.isArray(grades) &&
                        !grades.some(
                          (item) => item && item.grade === parseInt(grade)
                        )
                      );
                    })
                    .map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                </select>
                {errors.grade && <div className="error">{errors.grade}</div>}
              </div>
              <div className="col-12 form-controls">
                <label htmlFor="payment">Payment Amount</label>
                <input
                  type="text"
                  id="payment"
                  name="payment"
                  className="mb-2"
                  value={formData.payment}
                  readOnly
                />
              </div>
            </div>
            <button type="submit" className="mt-3 ht_btn">
              Submit
            </button>
          </Form>
          <ToastContainer />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTrainerModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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
              <button type="button" class="btn btn-primary" onClick={logout}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <a href onClick={viewStudentGrade}>
          <FaArrowLeft className="user-icon me-2 mb-3" />
        </a>
        <h2>Your Student Grade</h2>
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
      <p className="mb-5">Your Students applied exam grade</p>
      <Button
        variant="primary shadow-none mb-4"
        onClick={handleShowTrainerModal}
        className="delete"
      >
        ADD GRADE
      </Button>
      <div style={{ overflowX: "scroll" }}>
        <table className="table-fill">
          <thead>
            <tr>
              <th className="text-left">S.No</th>
              <th className="text-left">Grade Number</th>
              <th className="text-left">Applied Date</th>
              <th className="text-left">Payment</th>
              <th className="text-left">Mark</th>

              <th className="text-left">Grade</th>

              <th className="text-left">HallTicket</th>
              <th className="text-left">Certificate</th>

            </tr>
          </thead>
          <tbody className="table-hover">
            {grades.length > 0 ? (
              grades.map((item, index) => (
                <tr key={index}>
                  <td className="text-left">{index + 1}</td>
                  <td className="text-left">{item.grade}</td>
                  <td className="text-left">{item.date}</td>
                  <td className="text-left">{item.payment}</td>
                  <td className="text-left">
                    {item.pending ? "Pending" : item.mark}
                  </td>
                  <td className="text-left">
                    {item.pending ? "Pending" : item.gradeResult}
                  </td>

                  <td className="text-left">
                    <ButtonGroup>
                      <Button
                        variant="outline-success shadow-none"
                        className="delete"
                        onClick={() => {
                          fetchHallTicket(studentId, item.id);
                          handleShowCertificateModal();
                        }}
                      >
                        View Hall Ticket
                      </Button>
                    </ButtonGroup>
                  </td>
                  <td className="text-left">
                    {item.pending ? (
                      "Processing..."
                    ) : (
                      <div>
                        <Button onClick={() => {
                            fetchCertificate(studentId, item.id);
                            handleShowCertificateModal();
                          }}>
                          View Certificate
                        </Button>
                        
                      </div>
                    )}
                  </td>
                  {/* Modal for displaying certificate */}
                  <Modal
                    show={showCertificateModal}
                    onHide={handleCloseCertificateModal}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Certificate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {certificateImage ? (
                        <img
                          src={certificateImage}
                          alt="Certificate"
                          style={{ width: "100%", height: "auto" }}
                        />
                      ) : (
                        <p>Loading certificate...</p>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="warning"
                        className="d-flex align-self-center "
                        
                      >
                        <a style={{color:'black'}} href={certificateImage} download>Download </a><FaCloudDownloadAlt style={{fontSize:'23px',paddingLeft:'3px'}} />
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No grades applied yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
