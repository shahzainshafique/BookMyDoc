import React from "react";
import { Navigate } from "react-router-dom";

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const ProtectedRoute = ({ children, redirectUrl }) => {
  const token = getCookie("authToken");

  return token ? children : <Navigate to={redirectUrl} />;
};

export default ProtectedRoute;
