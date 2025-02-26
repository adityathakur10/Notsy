import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import './App.css'
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatApp from './pages/ChatApp';
import ProtectedRoute from './components/ProtectedRoute';
>>>>>>> 66978f4 (added chat app)

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
=======
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          } 
        />
        {/* Redirect to login by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Catch all other routes and redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
>>>>>>> 66978f4 (added chat app)
      </Routes>
    </Router>
  );
}

export default App;
