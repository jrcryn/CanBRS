import React, { useEffect, useState, useMemo } from 'react';
import {
  Container, VStack, HStack, Text, Box, Divider, InputGroup, InputLeftElement, Input, Alert, AlertIcon, Button,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { shallow } from 'zustand/shallow';
import ReservationCardAdmin from '../components/ReservationCardAdmin';
import LoadingSpinner from '../components/LoadingSpinner';
import { useReservationStore } from '../store/reservation';
import { useListingStore } from '../store/listing';
import { useNavigate } from 'react-router-dom';

const InUsePage = () => {
  const reservation = useReservationStore((state) => state.reservation, shallow);
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

  // Filter reservations with status 'In-Use'
  const inUseReservations = useMemo(() => {
    return reservation.filter((res) => res.status === 'In-Use');
  }, [reservation]);

  // Filter reservations based on search query
  const filteredReservations = useMemo(() => {
    return inUseReservations.filter((res) =>
      res._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inUseReservations, searchQuery]);

  // Normalize today's date to midnight
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  // Split reservations based on endDate
  const endDatesAndPastReservations = useMemo(() => {
    return filteredReservations
      .filter((res) => {
        const resEndDate = new Date(res.endDate);
        const normalizedResEndDate = new Date(
          resEndDate.getFullYear(),
          resEndDate.getMonth(),
          resEndDate.getDate()
        );
        return normalizedResEndDate <= today;
      })
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  }, [filteredReservations, today]);

  const inUseResources = useMemo(() => {
    return filteredReservations
      .filter((res) => {
        const resEndDate = new Date(res.endDate);
        const normalizedResEndDate = new Date(
          resEndDate.getFullYear(),
          resEndDate.getMonth(),
          resEndDate.getDate()
        );
        return normalizedResEndDate > today;
      })
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  }, [filteredReservations, today]);

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
            In-Use Reservations
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
          
          <Button colorScheme="blue"	onClick={() => navigate('/admin/returned-resources')}>
              Returned Resources
          </Button>
          </HStack>
        </HStack>

        {/* End Dates and Past */}
        <Box w="full" bg="red.50" p={5} borderRadius="md" borderWidth="5px">
          <Text fontSize="2xl" fontWeight="bold" color="red.600" mb={4}>
            End Dates and Past
          </Text>
          {endDatesAndPastReservations.length === 0 ? (
            <Text fontSize="xl" textAlign="center" color="gray.500">
              No Reservations to Return
            </Text>
          ) : (
            <VStack spacing={4} w="full">
              {endDatesAndPastReservations.map((res) => (
                <ReservationCardAdmin
                  key={res._id}
                  reservation={res}
                  listings={listing}
                  isOpen={openReservationId === res._id}
                  onOpen={() => setOpenReservationId(res._id)}
                  onClose={() => setOpenReservationId(null)}
                />
              ))}
            </VStack>
          )}
        </Box>

        <Divider />

        {/* In-Use Resources */}
        <Box w="full" bg="blue.50" p={5} borderRadius="md" borderWidth="5px">
          <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={4}>
            In-Use Resources
          </Text>
          {inUseResources.length === 0 ? (
            <Text fontSize="xl" textAlign="center" color="gray.500">
              No Active In-Use Reservations
            </Text>
          ) : (
            <VStack spacing={4} w="full">
              {inUseResources.map((res) => (
                <ReservationCardAdmin
                  key={res._id}
                  reservation={res}
                  listings={listing}
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

export default InUsePage;