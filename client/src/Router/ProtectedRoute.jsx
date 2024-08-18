import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../Helpers/cookies";

const ProtectedRoute = ({ children, redirectUrl }) => {
  const token = getCookie("authToken");

  return token ? children : <Navigate to={redirectUrl} />;
};

export default ProtectedRoute;
