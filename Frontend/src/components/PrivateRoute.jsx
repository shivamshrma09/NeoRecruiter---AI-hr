import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";

const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated } = useContext(UserDataContext);
  
  // Check if we have user data in localStorage even if context isn't updated yet
  const token = localStorage.getItem("token");
  const storedUserStr = localStorage.getItem("user");
  
  // If either context or localStorage has valid auth data, allow access
  const isUserAuthenticated = isAuthenticated || (token && storedUserStr);
  
  if (!isUserAuthenticated) {
    return <Navigate to="/Login" />;
  }
  
  return children;
};

export default PrivateRoute;