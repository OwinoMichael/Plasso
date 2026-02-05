import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EmailVerifySuccess from './pages/EmailVerifySuccess';
import EmailVerifyError from './pages/EmailVerifyError';
import Unverified from './pages/Unverified';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-success" element={<EmailVerifySuccess />} />
        <Route path="/verify-error" element={<EmailVerifyError />} />
        <Route path="/unverified" element={<Unverified />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;