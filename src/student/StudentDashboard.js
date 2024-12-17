import React, { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard({ studentName, studentId }) {
  const [totalGrade, setTotalGrade] = useState(0);
  const [notApplied, setNotApplied] = useState(0);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchTotalGrade = async () => {
      try {
        const response = await fetch(
          "https://www.globalschoolofyoga.com/grade/api/studentDashboard.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "Application.json",
            },
            body: JSON.stringify({ studentId }),
          }
        );
        const data = await response.json();
        if (data.status === 1) {
          setTotalGrade(data.total_grade);
          setNotApplied(12 - data.total_grade);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };
    fetchTotalGrade();
  }, [studentId]);

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
      <div className="d-flex justify-content-between mb-5">
        <h2>Welcome {studentName}</h2>
        <div>
          <a onClick={()=>{navigate("/student-details")}}>
            <FaUser className="user-icon me-2" />
          </a>
          <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>
      <div className="dashboard-box">
        <div className="total-members">
          <h3>Total Grade</h3>
          <h1 className="num-text">12</h1>
        </div>
        <div className="total-members">
          <h3>Applied Grade</h3>
          <h1 className="num-text">{totalGrade}</h1>
        </div>
        <div className="total-members">
          <h3>Not Applied Grade</h3>
          <h1 className="num-text">{notApplied}</h1>
        </div>
      </div>
    </div>
  );
}
