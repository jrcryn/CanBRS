import React, { useEffect, useState, useMemo } from 'react';
import { Container, VStack, HStack, Text, InputGroup, InputLeftElement, Input, Alert, AlertIcon, Button,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { shallow } from 'zustand/shallow';
import ReservationCardAdmin from '../components/ReservationCardAdmin';
import LoadingSpinner from '../components/LoadingSpinner';
import { useReservationStore } from '../store/reservation';
import { useListingStore } from '../store/listing';
import { useNavigate } from 'react-router-dom';

const ReturnedResources = () => {
  const reservation = useReservationStore((state) => state.reservation, shallow);
  const deleteReservationAdmin = useReservationStore((state) => state.deleteReservationAdmin);
  const fetchReservationAdmin = useReservationStore(
    (state) => state.fetchReservationAdmin,
    shallow
  );
  const isLoading = useReservationStore((state) => state.isLoading, shallow);
  const error = useReservationStore((state) => state.error, shallow);

  const { listing, fetchListing } = useListingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [openReservationId, setOpenReservationId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReservationAdmin();
    fetchListing();
  }, [fetchReservationAdmin, fetchListing]);

  // Filter reservations with status 'Returned'
  const returnedReservations = useMemo(() => {
    return reservation.filter((res) => res.status === 'Returned');
  }, [reservation]);

  // Filter reservations based on search query
  const filteredReservations = useMemo(() => {
    return returnedReservations.filter((res) =>
      res._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [returnedReservations, searchQuery]);

  if (isLoading) {
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

  return (
    <Container maxW={'container.xl'} py={5}>
      <VStack spacing={4}>
        {/* Header Section */}
        <HStack justifyContent="space-between" w="full" mb={8} flexWrap="wrap">
          {/* Title */}
          <Text fontSize={{ base: '3xl', md: '3xl' }} fontWeight={'bold'} color={'blue.600'}>
            Returned Resources
          </Text>
            <HStack>
          {/* Search */}
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
          <Button colorScheme='blue' variant="outline" onClick={() => navigate('/admin/in-use-resources')}>
          ← Go Back
          </Button>
          </HStack>
        </HStack>

        {/* Returned Reservations */}
        {filteredReservations.length === 0 ? (
          <Text fontSize="xl" textAlign="center" color="gray.500">
            No Returned Reservations Found
          </Text>
        ) : (
          <VStack spacing={4} w="full">
            {filteredReservations.map((res) => (
              <ReservationCardAdmin
                key={res._id}
                reservation={res}
                listings={listing}
                deleteReservation={deleteReservationAdmin}
                isOpen={openReservationId === res._id}
                onOpen={() => setOpenReservationId(res._id)}
                onClose={() => setOpenReservationId(null)}
              />
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default ReturnedResources;