import React, {useEffect} from 'react'
import LoginForm from '../Components/Login/LoginForm';
import Navbar from '../Components/Navbar/Navbar';
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    const isAuthenticated = localStorage.getItem('accessToken');
    if (isAuthenticated) {
      // Redirect to the dashboard if authenticated
      navigate('/dashboard');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Navbar />
      <LoginForm className="container" />
      </>
  )
}

export default LoginPage;