import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../Helpers/cookies";

const ProtectedRoute = ({ children, redirectUrl, allowedUser }) => {
  const token = getCookie("authToken");
  const userType = getCookie("userType");

  return token && userType == allowedUser ? children : <Navigate to = {redirectUrl} />;
};

export default ProtectedRoute;
