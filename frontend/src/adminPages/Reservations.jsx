import React, { useEffect, useState } from 'react';
import { useReservationStore } from '../store/reservation';
import { useListingStore } from '../store/listing';
import { useMemo } from 'react';
import {
  Container,
  Text,
  VStack,
  InputGroup,
  InputLeftElement,
  Input,
  HStack,
  Select,
  Alert,
  AlertIcon,
  Box,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ReservationCardAdmin from '../components/ReservationCardAdmin';
import LoadingSpinner from '../components/LoadingSpinner';

const RTrackReservation = () => {
  
  const {  reservation, fetchReservationAdmin, error, isLoading: reservationLoading } = useReservationStore();

  const { listingsWithoutImages, fetchListingWithoutImages, isLoading: listingLoading } = useListingStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [openReservationId, setOpenReservationId] = useState(null);

  const bookedTimesByDate = useMemo(() => {
    if (!reservation?.length) return {};
    
    const bookings = {};
    console.log('Processing reservations for bookings:', reservation);
  
    reservation.forEach((res) => {
      if (res?.appointmentDate && res.status === 'Approved') {
        const appointmentDate = new Date(res.appointmentDate);
        // Use consistent date key format
        const dateKey = appointmentDate.toLocaleDateString('en-CA');
        
        if (!bookings[dateKey]) {
          bookings[dateKey] = [];
        }
        console.log('Adding booked time:', appointmentDate.toLocaleString(), 'for date:', dateKey);
        bookings[dateKey].push(appointmentDate);
      }
    });
    
    console.log('Generated bookings:', bookings);
    return bookings;
  }, [reservation]);

  useEffect(() => {
    fetchReservationAdmin();
    fetchListingWithoutImages();
  }, [fetchReservationAdmin, fetchListingWithoutImages]);

  if (listingLoading || reservationLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error fetching reservations. Please try again later.
      </Alert>
    );
  }

  // Function to get the background color based on the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'yellow.100';
      case 'Approved':
        return 'green.100';
      case 'Declined':
        return 'red.100';
      default:
        return 'white'; // Default white background when no status selected
    }
  };

  // Filter reservations based on search query and selected status
  const filteredReservations = reservation.filter((res) => {
    const matchesSearch = res._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus ? res.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Split reservations into priority and regular residents
  const priorityReservations = filteredReservations.filter(
    (res) =>
      res.resident.classification === 'PWD' ||
      res.resident.classification === 'Pregnant' ||
      res.resident.classification === 'Elderly'
  );

  const regularReservations = filteredReservations.filter(
    (res) => res.resident.classification === 'Regular'
  );

  return (
    <Container maxW={'container.xl'} py={5}>
      <VStack spacing={4}>

        {/* Header Section */}
        <HStack justifyContent="space-between" w="full" mb={8} flexWrap="wrap">
          {/* Title */}
          <Text fontSize={{ base: '3xl', md: '3xl' }} fontWeight={'bold'} color={'blue.600'}>
            Reservation Requests
          </Text>

          {/* Search and Sort */}
          <HStack spacing={4} flexWrap="wrap">
            <InputGroup width={{ base: 'full', md: '250px' }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by Reservation ID"
                size="md"
                variant="outline"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              variant="outline"
              width={{ base: 'full', md: '150px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              bg={getStatusColor(selectedStatus)}
              _hover={{ bg: getStatusColor(selectedStatus) }}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </Select>
          </HStack>
        </HStack>

        {/* Priority Reservation List */}
        <Box w="full" bg="blue.50" p={5} borderRadius="md" borderWidth="5px">
          <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={4}>
            Priority Requests
          </Text>
          {priorityReservations.length === 0 ? (
            <Text fontSize="xl" textAlign="center" color="gray.500">
              No Priority Reservations Found
            </Text>
          ) : (
            <VStack spacing={4} w="full">
              {priorityReservations.map((res) => (
                <ReservationCardAdmin
                  key={res._id}
                  reservation={res}
                  bookings={bookedTimesByDate} // Pass booked times
                  listings={listingsWithoutImages}       // Pass listings
                  isOpen={openReservationId === res._id}
                  onOpen={() => setOpenReservationId(res._id)}
                  onClose={() => setOpenReservationId(null)}
                />
              ))}
            </VStack>
          )}
        </Box>

        <Divider />

        {/* Regular Reservation List */}
        <Box w="full" bg="gray.50" p={5} borderRadius="md" borderWidth={5}>
        <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={4}>
            Regular Requests
          </Text>
          {regularReservations.length === 0 ? (
            <Text fontSize="xl" textAlign="center" color="gray.500">
              No Regular Reservations Found
            </Text>
          ) : (
            <VStack spacing={4} w="full">
              {regularReservations.map((res) => (
                <ReservationCardAdmin
                  key={res._id}
                  reservation={res}
                  bookings={bookedTimesByDate}
                  listings={listingsWithoutImages}
                  isOpen={openReservationId === res._id}
                  onOpen={() => setOpenReservationId(res._id)}
                  onClose={() => setOpenReservationId(null)}
                />
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default RTrackReservation;