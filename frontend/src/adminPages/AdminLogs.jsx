import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useReservationStore } from '../store/reservation';

const AdminLogs = () => {
  const { reservation, fetchReservationAdmin, error, isLoading } = useReservationStore();
  
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchReservationAdmin();
  }, [fetchReservationAdmin]);

  const filteredReservationsByDate = useMemo(() => {
    if (!selectedDate) return reservation;
  
    const selected = new Date(selectedDate).toDateString();
  
    return reservation.filter((res) => {
      const resDate = new Date(res.createdAt).toDateString();
      return resDate === selected;
    });
  }, [reservation, selectedDate]);

  if (isLoading) {
    return (
      <Box p={5}>
        <Text>Loading...</Text>
      </Box>
    );
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
    <Box p={5}>
      <HStack spacing={4} mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Admin Reservation Logs
        </Text>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Select date"
          maxW="200px"
        />
      </HStack>

      {filteredReservationsByDate.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No reservations found for the selected date.
        </Alert>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Resident Name</Th>
              <Th>Pending</Th>
              <Th>Approved</Th>
              <Th>Declined</Th>
              <Th>In Use</Th>
              <Th>Returned</Th>
            </Tr>
          </Thead>
          <Tbody>
    {filteredReservationsByDate.map((res) => (
      <Tr key={res._id}>
        <Td>{`${res.resident.firstname} ${res.resident.lastname}`}</Td>
        <Td>{res.status === 'Pending' ? 1 : 0}</Td>
        <Td>{res.status === 'Approved' ? 1 : 0}</Td>
        <Td>{res.status === 'Declined' ? 1 : 0}</Td>
        <Td>{res.status === 'In-Use' ? 1 : 0}</Td>
        <Td>{res.status === 'Returned' ? 1 : 0}</Td>
        <Td>{new Date(res.createdAt).toLocaleDateString()}</Td>
      </Tr>
    ))}
  </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AdminLogs;