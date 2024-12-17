import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TrainerDetails({ trainerId }) {
  const [trainer, setTrainer] = useState([]);
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
  };

  useEffect(() => {
    fetchUser();
  }, [trainerId]);

  const fetchUser = () => {
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/trainerdetails.php", {
        userId: trainerId,
      })
      .then((response) => {
        if (response.data.error) {
          console.log("Error", response.data.error);
        }
        const datas = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setTrainer(datas);
      })
      .catch((error) => {
        console.log("Error", error);
      });
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
      <div className="d-flex justify-content-between mb-5">
        <h2>Trainer Details</h2>
        <div>
          <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>
      {trainer.length > 0 ? (
        trainer.map((eachTrainer, index) => {
          return (
            <Table className="mt-5" key={index}>
              <tr>
                <th>Profile</th>
                <td>
                  <img
                    src={`https://www.globalschoolofyoga.com/grade/api/${eachTrainer.timage}`}
                    alt="Trainer_image"
                    style={{
                      height: "100px",
                      width: "100px",
                      objectFit: "cover",
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{eachTrainer.name}</td>
              </tr>
              <tr>
                <th>Studio Name</th>
                <td>{eachTrainer.studio}</td>
              </tr>
              <tr>
                <th>Gmail</th>
                <td>{eachTrainer.gmail}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{eachTrainer.number}</td>
              </tr>
              <tr>
                <th>WhatsApp Number</th>
                <td>{eachTrainer.wnumber}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{eachTrainer.address}</td>
              </tr>
            </Table>
          );
        })
      ) : (
        <div>
          <p>No Trainer Found...</p>
        </div>
      )}
    </div>
  );
}
