import React, { useEffect, useState } from "react";
import { BiSolidUserDetail } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { FcReadingEbook } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function TrainerPage({ trainerName, trainerId }) {
  const [totalStudent, setTotalStudent] = useState(0);
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
  };

  const gotodetails =()=>{
    navigate('/Trainer-details')
  }

  const gotostudentview =()=>{
    navigate('/student-view-trainer')
  }
  

  useEffect(() => {
    const fetchTotalGrade = async () => {
      try {
        const response = await fetch(
          "https://www.globalschoolofyoga.com/grade/api/trainerDashboard.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "Application.json",
            },
            body: JSON.stringify({ trainerId }),
          }
        );
        const data = await response.json();
        if (data.status === 1) {
          setTotalStudent(data.total_grade);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };
    fetchTotalGrade();
  }, [trainerId]);

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
        <h2>Welcome {trainerName}</h2>
        <div>
          <a href="#" onClick={()=>{navigate("/Trainer-details")}}>
            <FaUser className="user-icon me-2" />
          </a>
          <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>
      <div className="dashboard-box">
        <div className="total-members">
          <h3>Total Student</h3>
          <h1 className="num-text">{totalStudent}</h1>
        </div>
        <div className="total-members">
          <h3>Your Details</h3>
          <button className="Applied-button" onClick={gotodetails}>
          <BiSolidUserDetail />
            </button>
        </div>
        <div className="total-members">
          <h3>Your Students</h3>
          <button className="Applied-button" onClick={gotostudentview}>
          <FcReadingEbook />
            </button>
        </div>
      </div>
    </div>
  );
}
