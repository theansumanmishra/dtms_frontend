import {useEffect} from 'react'
import LoginForm from '../Components/Login/LoginPage';
import Navbar from '../Layouts/Navbar';
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('accessToken');
    if (isAuthenticated) {
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