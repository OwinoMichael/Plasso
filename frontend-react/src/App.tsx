import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner'
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
  
  return <Outlet />;
};

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsAuthenticated(!!user);

    const handleStorageChange = () => {
      const user = AuthService.getCurrentUser();
      setIsAuthenticated(!!user);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ Use <Outlet> instead of children for route nesting
  const ProtectedRoute = () => {
    const user = AuthService.getCurrentUser();

    if (!user) return <Navigate to="/login" replace />;
    if (!user.verified) return <Navigate to="/unverified-email" replace />;

    return <Outlet />;
  };

  const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ✅ Protected routes grouped under <ProtectedRoute> */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/project/:id" element={<Project />} />
      </Route>

      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unverified-email" element={<Unverified />} />
      <Route path="/verify-error" element={<EmailVerifyError />} />
      <Route path="/verify-success" element={<EmailVerifySuccess />} />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    basename: "/plasso" // This tells React Router the base path
  }
  );

  return( 
  <><RouterProvider router={router} /><Toaster /></>
  );


  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/signup" element={<SignUp />} />
  //       <Route path="/verify-success" element={<EmailVerifySuccess />} />
  //       <Route path="/verify-error" element={<EmailVerifyError />} />
  //       <Route path="/unverified" element={<Unverified />} />
  //       <Route path="/forgot-password" element={<ForgotPassword />} />
  //       <Route path="/reset-password" element={<ResetPassword />} />
  //       <Route path="/" element={<Home />} />
  //       <Route path="/project/:id" element={<Project />} />
  //       <Route path="*" element={<NotFound />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
}

export default App;