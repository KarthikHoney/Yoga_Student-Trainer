import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { FaCloudDownloadAlt, FaRegEye, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function StudentGrade({ studentId }) {
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
  };

  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleShowTrainerModal = () => setShowTrainerModal(true);
  const handleCloseTrainerModal = () => setShowTrainerModal(false);

  const handleShowCertificateModal = () => setShowCertificateModal(true);
  const handleCloseCertificateModal = () => setShowCertificateModal(false);
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);



  const initialFormData = {
    grade: "",
    payment: "",
  };
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [paymentAmounts, setPaymentAmounts] = useState([]);
  const [errors, setErrors] = useState({});
  const [grades, setGrades] = useState([]);
  


  const handleGrade = () => {
    const dataToSend = new FormData();
    dataToSend.append("action", "getGrade");
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/gradePrice.php", dataToSend)
      .then((res) => {
        if (res.data) {
          const data = res.data.grade;
          const payment = data.reduce((acc, item) => {
            acc[item.id] = item.studentPrice;
            return acc;
          }, {});
          setPaymentAmounts(payment);
        }
      });
  };

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

  const fetchGrades = () => {
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/gradeStudent.php", { studentId })
      .then((res) => {
        if (res.data && res.data.status === 1) {
          const data =  res.data.gradess || [];
          const gradeAllValues = data.map((item) => ({
            ...item,
            pending: item.mark === "" && item.gradeResult === "",
          }));
          setGrades(gradeAllValues);
       
        } else {
          toast.warn("Failed to fetch data");
        }
      })
      .catch((e) => {
        toast.error("Error fetching grades", e);
      });
  };
  const fetchCertificate = (studentId, gradeId) => {
    const HallTicketData = new FormData();
    HallTicketData.append("action", "generateCertificate");
    HallTicketData.append("studentId", studentId);
    HallTicketData.append("gradeId", gradeId);

    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/certificates.php", HallTicketData)
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

  useEffect(() => {
    fetchGrades();
    handleGrade();
  },[]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSend = {
        action: "grade",
        grade: formData.grade,
        payment: formData.payment,
        studentId: studentId,
      };

      axios
        .post("https://www.globalschoolofyoga.com/grade/api/gradeStudent.php", dataToSend)
        .then((response) => {
          if (
            response.data &&
            response.data.status === 1 &&
            response.data.newGrade
          ) {
            toast.success("Grade Applied Successfully");
            setFormData(initialFormData);
            setGrades([...grades, response.data.newGrade]);
          } else {
            toast.warn("Failed to apply grade.");
          }
        })
        .catch((error) => {
          console.error("There was an error submitting the form!", error);
          toast.error("Error submitting grade");
        });
    }
  };

  return (
    <div>
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
        <h2>Student Grade</h2>
        <div>
          <a
            href
            onClick={() => {
              navigate("/student-details");
            }}
          >
            <FaUser className="user-icon me-2" />
          </a>
          <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>
      <Button
        variant="primary shadow-none"
        onClick={handleShowTrainerModal}
        className="edit py-2 px-3 mb-4"
      >
        Apply Grade
      </Button>
      <Modal show={showTrainerModal} onHide={handleCloseTrainerModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apply for Grade</Modal.Title>
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
                    .filter(
                      (grade) =>
                        !grades.some((item) => item.grade === parseInt(grade))
                    ) // Filter out already applied grades
                    .map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                </select>

                {errors.grade && (
                  <div className="error text-light">{errors.grade}</div>
                )}
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
      <table className="table-fill">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Date</th>
            <th>Grade Number</th>
            <th>Payment</th>
            <th>Mark</th>
            <th>Grade</th>
            <th>Hall Ticket</th>
            <th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.date}</td>
              <td>{item.grade}</td>
              <td>{item.payment}</td>
              <td>{item.pending ? "Pending..." : item.mark}</td>
              <td>{item.pending ? "Pending..." : item.gradeResult}</td>

              <td className="text-left">
                <Button
                  variant="outline-primary shadow-none"
                  className="edit py-2 px-3"
                  onClick={() => {
                    fetchHallTicket(studentId, item.id);
                    handleShowCertificateModal();
                  }}
                >
                  <FaRegEye /> View Hall Ticket
                </Button>
              </td>
              <td className="text-left">
                    {item.pending ? (
                      "Processing..."
                    ) : (
                      <div>
                        <Button
                          onClick={() => {
                            fetchCertificate(studentId, item.id);
                            handleShowCertificateModal();
                          }}
                          variant="outline-info shadow-none"
                        >
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
