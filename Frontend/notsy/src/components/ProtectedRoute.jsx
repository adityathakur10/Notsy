import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  
  if (!token) {
    // Redirect to login page if no token is found
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, render the child component(s)
  return children;
};

export default ProtectedRoute;