import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterDoctor from "../Pages/auth/doctor/RegisterDoctor";
import Landing from "../Pages/landing/landing";
import LoginDoc from "../Pages/auth/doctor/LoginDoc";
import Otp from "../Pages/auth/doctor/Otp";
import ProtectedRoute from "./ProtectedRoute";
import DoctorDashboard from "../Pages/dashboard/doctor/doctorDashboard";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/regdoc" element={<RegisterDoctor />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/logindoc" element={<LoginDoc />} />
        <Route
          path="/docdash"
          element={
            <ProtectedRoute redirectUrl={"/logindoc"}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />{" "}
      </Routes>
    </Router>
  );
};

export default AppRouter;
