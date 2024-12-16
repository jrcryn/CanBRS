import { Box } from '@chakra-ui/react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../store/auth'

import Navbar from '../components/ResidentNavbar'
import Footer from '../components/Footer'

import RequestPage from '../residentPages/RRequestPage'
import HomePage from '../residentPages/RHomePage'
import ListingPage from '../residentPages/RListingPage'
import ForUrgentNeeds from '../residentPages/RForUrgentNeeds'
import PoliciesPage from '../residentPages/RPoliciesPage'
import TrackReservation from '../residentPages/RTrackReservationPage'

import LoadingSpinner from '../components/LoadingSpinner'

// ProtectedRoute component for routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to='/auth/resident-login' replace />
  }
  if (!user.isVerified) {
    return <Navigate to='/auth/verify-signup-otp' replace />
  }
  return children
}

function ResidentApp() {
  const { checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return <LoadingSpinner />
  }

  return (
    <Box>
      <ProtectedRoute>
        <Navbar />
        <Routes>
          <Route path='' element={<HomePage />} />
          <Route path='listing' element={<ListingPage />} />
          <Route path='urgent-needs' element={<ForUrgentNeeds />} />
          <Route path='reservation-policies' element={<PoliciesPage />} />
          <Route path='request-form' element={<RequestPage />} />
          <Route path='track-reservation' element={<TrackReservation />} />

        </Routes>
        <Box pt={75}>
        <Footer />
        </Box>
      </ProtectedRoute>
    </Box>
  )
}

export default ResidentApp