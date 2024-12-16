import {Box} from '@chakra-ui/react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {useEffect} from 'react'
import {useAuthStore} from '../store/auth'

import LoginPage from '../authPages/LoginPage'
import RegisterAs from '../authPages/RegisterAs'
import AdminSignupPage from '../authPages/AdminSignupPage'
import ResidentSignupPage from '../authPages/ResidentSignupPage'
import VerifySignup from '../authPages/VerifySignup'
import ForgotPassword from '../authPages/ForgotPassword'
import ResetPassword from '../authPages/ResetPassword'
import LoginPageOtp from '../authPages/LoginOtpPage'
import PleaseWaitForVerification from '../authPages/PleaseWaitForVerification'

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (!user.isVerified) {
      return <Navigate to='/auth/verify-signup-otp' replace />;
    } else if (user.role === 'admin') {
      return <Navigate to='/admin/dashboard' replace />;
    } else if (user.role === 'resident') {
      return <Navigate to='/resident' replace />;
    } else {
      return <Navigate to='/404' replace />;
    }
  }

  // User is not authenticated, so allow access to the auth pages
  return children;
};

function AuthApp() {
  const {checkAuth, isAuthenticated, user} = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log('isAuthenticated', isAuthenticated)
  console.log('user', user)

  return (
    <Box>

      <Routes>

        <Route path='login' element={
          <RedirectAuthenticatedUser>
            <LoginPage/>
          </RedirectAuthenticatedUser>
        } />

        <Route path='register-as' element={
          <RedirectAuthenticatedUser>
            <RegisterAs/>
          </RedirectAuthenticatedUser>
          } />

        <Route path='admin-signup' element={
          <RedirectAuthenticatedUser>
            <AdminSignupPage/>
          </RedirectAuthenticatedUser>
        } />

        <Route path='resident-signup' element={
          <RedirectAuthenticatedUser>
            <ResidentSignupPage/>
          </RedirectAuthenticatedUser>
        } />

        <Route path='verify-signup-otp' element={<VerifySignup/>} />

        <Route path='forgot-password' element={
          <RedirectAuthenticatedUser>
            <ForgotPassword/>
          </RedirectAuthenticatedUser>
        } />

        <Route path='reset-password/:token' element={
          <RedirectAuthenticatedUser>
            <ResetPassword/>
          </RedirectAuthenticatedUser>
        } />

        <Route path='verify-login-otp' element={<LoginPageOtp/>} />

        <Route path='please-wait-for-verification' element={<PleaseWaitForVerification/>} />

      </Routes>

    </Box>
  )
}

export default AuthApp
