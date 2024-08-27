import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterDoctor from "../Pages/auth/doctor/RegisterDoctor";
import Landing from "../Pages/landing/landing";
import LoginDoc from "../Pages/auth/doctor/LoginDoc";
import Otp from "../Pages/auth/doctor/Otp";
import ProtectedRoute from "./ProtectedRoute";
import DoctorDashboard from "../Pages/dashboard/doctor/doctorDashboard";
import RegisterPatient from "../Pages/auth/patient/RegisterPatient";
import LoginPatient from "../Pages/auth/patient/LoginPatient";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/regdoc" element={<RegisterDoctor />} />
        <Route path="/logindoc" element={<LoginDoc />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/patient/signup" element={<RegisterPatient />} />
        <Route path="/patient/login" element={<LoginPatient />} />
        <Route
          path="/docdash"
          element={
            <ProtectedRoute redirectUrl={"/logindoc"} allowedUser={"doctor"}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />{" "}
      </Routes>
    </Router>
  );
};

export default AppRouter;
