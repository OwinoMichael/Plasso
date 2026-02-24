import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
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
import AuthService from './services/AuthService';
import Landing from './pages/Landing';
import VerifyMagicLink from './pages/Verifymagiclink';
import SetupUsername from './pages/Setupusername';


const ProtectedRoute = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const validateAuth = async () => {
      const isValid = await AuthService.validateToken();
      setIsAuthenticated(isValid);
      setIsValidating(false);
    };
    
    validateAuth();
  }, []);
  
  if (isValidating) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Check if verified
  const user = AuthService.getCurrentUser();
  if (user && !user.verified) return <Navigate to="/unverified-email" replace />;
  
  return <Outlet />;
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/project/:id" element={<Project />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-magic-link" element={<VerifyMagicLink />} />
        <Route path="/setup-username" element={<SetupUsername />} />
        
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unverified-email" element={<Unverified />} />
        <Route path="/verify-error" element={<EmailVerifyError />} />
        <Route path="/verify-success" element={<EmailVerifySuccess />} />
        <Route path="*" element={<NotFound />} />
      </>
    ),
    {
      basename: "/plasso"
    }
  );

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;