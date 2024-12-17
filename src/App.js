// App.js
import React, { useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import RegisterPage from "./form/RegisterPage";
import Login from "./form/Login";
import StudentSidebar from "./components/StudentSidebar";
import TrainerDashboard from "./components/TrainerDashboard";
import TrainerDetails from "./TrainerStudent/TrainerDetails";
import TrainerPage from "./TrainerStudent/TrainerPage";
import TrainerStudentGrade from "./TrainerStudent/TrainerStudentGrade";
import StudentDashboard from "./student/StudentDashboard";
import StudentDetails from "./student/StudentDetails";
import StudentGrade from "./student/StudentGrade";
import TrainerReg from "./form/TrainerReg";
import Tstudent from "./TrainerStudent/Tstudent";

function App() {
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );
  const [studentId, setStudentId] = useState(
    localStorage.getItem("studentId") || ""
  );
  const [trainerId, setTrainerId] = useState(
    localStorage.getItem("trainerId") || ""
  );
  const [studentName, setStudentName] = useState(
    localStorage.getItem("studentName") || ""
  );
  const [trainerName, setTrainerName] = useState(
    localStorage.getItem("trainerName") || ""
  );

  const handleLogin = (
    role,
    studentId = null,
    studentName = null,
    trainerId = null,
    trainerName = null
  ) => {
    setUserRole(role);

    if (role === "individualstudent") {
      setStudentId(studentId);
      setStudentName(studentName);
      localStorage.setItem("studentId", studentId);
      localStorage.setItem("studentName", studentName);
    } else if (role === "trainer") {
      setTrainerId(trainerId);
      setTrainerName(trainerName);
      localStorage.setItem("trainerId", trainerId);
      localStorage.setItem("trainerName", trainerName);
    }

    localStorage.setItem("userRole", role);
  };
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/registration" element={<RegisterPage />} />
          <Route path="/trainerReg" element={<TrainerReg />} />

          {userRole === "individualstudent" && (
            <Route path="/" element={<StudentSidebar />}>
              <Route
                path="student-dashboard"
                element={<StudentDashboard studentName={studentName} studentId={studentId}  />}
              />
              <Route
                path="student-details"
                element={<StudentDetails studentId={studentId} />}
              />
              <Route
                path="student-grade"
                element={
                  <StudentGrade studentId={studentId} trainerId={trainerId} />
                }
              />
            </Route>
          )}
          {userRole === "trainer" && (
            <Route path="/" element={<TrainerDashboard />}>
              <Route
                path="trainer-dashboard"
                element={<TrainerPage trainerName={trainerName} trainerId={trainerId} />}
              />
              <Route
                path="trainer-details"
                element={<TrainerDetails trainerId={trainerId} />}
              />
              <Route
                path="trainer-student-grade"
                element={<TrainerStudentGrade trainerid={trainerId} studentid={studentId}/>}
              />
              <Route path="student-view-trainer" element={<Tstudent trainerId={trainerId} trainerName={trainerName} studentId={studentId} />} />
            </Route>
          )}

          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
