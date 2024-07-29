import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterDoctor from "../Pages/auth/doctor/RegisterDoctor";
import Landing from "../Pages/landing/landing";
import LoginDoc from "../Pages/auth/doctor/LoginDoc";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/regdoc" element={<RegisterDoctor />} />
        <Route path="/logindoc" element={<LoginDoc />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
