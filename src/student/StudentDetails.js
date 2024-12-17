import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export default function StudentDetails({ studentId }) {
  const [StudentData, setStudentData] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = () => {
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/studentdetails.php", {
        userId: studentId,
      })
      .then((response) => {
        if (response.data.error) {
          console.error("Error:", response.data.error);
          alert("Failed to fetch data");
        } else {
          const data = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setStudentData(data);
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to fetch data");
      });
  };

  if (StudentData.length === 0) {
    return <div>Loading...</div>;
  }

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
      <div className="d-flex justify-content-end">
        <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
          <CiLogout className="user-icon" />
        </a>
      </div>
      <h1 className="text-center">Student Details</h1>
      <div>
        <ul>
          {StudentData.length > 0 ? (
            StudentData.map((eachStudent) => (
              <div
                key={eachStudent.id}
                className="border-table  d-block ms-auto me-auto"
              >
                <table className="mt-5 table-fill">
                  <tr>
                    <th>Profile</th>
                    <td>
                      <img
                        src={`https://www.globalschoolofyoga.com/grade/api/${eachStudent.image}`}
                        alt="Student Profile"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{eachStudent.name}</td>
                  </tr>
                  <tr>
                    <th>Parent's Name</th>
                    <td>{eachStudent.parentname}</td>
                  </tr>
                  <tr>
                    <th>Gmail</th>
                    <td>{eachStudent.gmail}</td>
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <td>{eachStudent.wnumber}</td>
                  </tr>
                  <tr>
                    <th>WhatsApp Number</th>
                    <td>{eachStudent.number}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{eachStudent.address}</td>
                  </tr>
                </table>
              </div>
            ))
          ) : (
            <p>No students found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
