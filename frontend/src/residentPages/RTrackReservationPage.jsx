// RTrackReservationPage.jsx
import React, { useEffect, useState } from 'react';
import { useReservationStore } from '../store/reservation';
import { Container, Text, VStack, InputGroup, InputLeftElement, Input, Stack, Select, Alert, AlertIcon,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ReservationList from '../components/ReservationCardResident';
import LoadingSpinner from '../components/LoadingSpinner';

const RTrackReservation = () => {
  const { reservation, fetchReservationResident, isLoading, error } = useReservationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchReservationResident();
  }, [fetchReservationResident]);

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

  // Filter reservations based on search query and selected status
  const filteredReservations = reservation
    .filter((res) => {
      const matchesSearch = res._id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus ? res.status === selectedStatus : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  

  return (
    <Container maxW={'container.xl'} py={{ base: 6, md: 10 }} px={{ base: 4, md: 8 }}>
      <VStack spacing={{ base: 6, md: 8 }}>

        {/* Header Section */}
        <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-between" w="full" mb={8} spacing={4}>
          {/* Title */}
          <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight={'bold'} color={'blue.600'}>
            My Reservations
          </Text>

          {/* Search and Sort */}
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w={{ base: 'full', md: 'auto' }}>
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
              placeholder="All Statuses" 
              variant="outline" 
              width={{ base: 'full', md: '150px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </Select>
          </Stack>
        </Stack>

        {/* Reservation List */}
        {filteredReservations.length === 0 ? (
          <Text fontSize={'2xl'} textAlign={'center'} fontWeight={'bold'} color={'gray.500'}>
            No Reservations Found
          </Text>
        ) : (
          <VStack spacing={4} w="full">
            {filteredReservations.map((res) => (
              <ReservationList key={res._id} reservation={res} />
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default RTrackReservation;