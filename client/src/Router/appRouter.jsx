import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterDoctor from "../Pages/auth/RegisterDoctor";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/regDoc" element={<RegisterDoctor />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
