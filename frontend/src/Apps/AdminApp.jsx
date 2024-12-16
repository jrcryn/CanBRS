import { Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../store/auth'

import Layout from '../adminPages/Layout'
import Reservations from '../adminPages/Reservations'
import InUsePage from '../adminPages/In-UsePage'
import Listings from '../adminPages/Listings'
import CreatePage from '../adminPages/CreatePage'
import ReturnedResources from '../adminPages/ReturnedResources'
import AdminAccounts from '../adminPages/AdminAccounts'
import ResidentAccounts from '../adminPages/ResidentAccounts'
import UnverifiedResidents from '../adminPages/UnverifiedResident'
import RegistrationKey from '../adminPages/RegistrationKey'
import LoadingSpinner from '../components/LoadingSpinner'

//protect routes that require authentication
const ProtectedRoute = ({children}) => {
    const {isAuthenticated, user} = useAuthStore()
    
    if (!isAuthenticated) {
      return <Navigate to='/auth/login' replace />
    }
    if (!user.isVerified) {
      return <Navigate to='/auth/verify-signup-otp' replace />
    }
    return children;
  }

function AdminApp() {
    const { checkAuth, isCheckingAuth } = useAuthStore()

    useEffect(() => {
      checkAuth()
      if (checkAuth) {}
    }, [checkAuth])

    if(isCheckingAuth) {
        return <LoadingSpinner />
    }
  return (
    <Box>
      <ProtectedRoute>
      <Layout>
        <Routes>
        <Route path='reservations' element={<Reservations />}/>
        <Route path='in-use-resources' element={<InUsePage />}/>
        <Route path='listings' element={<Listings />}/>
        <Route path='create-listing' element={<CreatePage />}/>
        <Route path='returned-resources' element={<ReturnedResources />}/>
        <Route path='admin-accounts' element={<AdminAccounts />}/>
        <Route path='resident-accounts' element={<ResidentAccounts />}/>
        <Route path='unverified-residents' element={<UnverifiedResidents />}/>
        <Route path='registration-key' element={<RegistrationKey />}/>
      </Routes>
      </Layout>
      </ProtectedRoute>
    </Box>
  )
}

export default AdminApp