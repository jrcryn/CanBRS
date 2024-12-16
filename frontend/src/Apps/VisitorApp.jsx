import {Box} from '@chakra-ui/react'
import {Routes, Route} from 'react-router-dom'

import HomePage from '../visitorPages/HomePage'
import ListingPage from '../visitorPages/ListingPage'
import ForUrgentNeeds from '../visitorPages/ForUrgentNeeds'
import RequestPage from '../visitorPages/RequestPagePlaceholder'
import PoliciesPage from '../visitorPages/PoliciesPage'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function VisitorApp() {

  return (
    <Box>
    <Navbar/>
      <Routes>
        <Route path='' element={<HomePage/>} />
        <Route path='listing' element={<ListingPage/>} />
        <Route path='urgent-needs' element={<ForUrgentNeeds/>} />
        <Route path='request-form' element={<RequestPage/>} />
        <Route path='reservation-policies' element={<PoliciesPage/>} />
      </Routes>
      <Box pt={75}>
        <Footer/>
      </Box>
    </Box>
  )
}

export default VisitorApp
