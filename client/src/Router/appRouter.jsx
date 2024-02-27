import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterDoctor from "../Pages/auth/RegisterDoctor";
import Landing from "../Pages/landing/landing";
import SignUp from "../Pages/auth/SignUp";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/regDoc" element={<RegisterDoctor />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
