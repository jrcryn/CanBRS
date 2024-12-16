import React from 'react';
import {
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  Divider,
  Icon,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaClipboardList, FaClock } from 'react-icons/fa';

function TrackReservationListResident({ reservation }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'yellow';
      case 'Approved':
        return 'green';
      case 'Declined':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      w="full"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
      maxW={'1000px'}
    >
      <VStack align="start" spacing={4}>
        {/* Header */}
        <HStack spacing={2} align="center">
          <Icon as={FaClipboardList} color="blue.500" boxSize={4} />
          <Text fontWeight="bold" fontSize="md" color="blue.600">
            Reservation ID: {reservation._id}
          </Text>
        </HStack>

        {/* Requested At Date */}
        <HStack spacing={2} align="center" mt={-1}>
          <Icon as={FaClock} color="gray.500" boxSize={4} />
          <Text fontSize="sm" color="gray.600">
            Requested On: {new Date(reservation.createdAt).toLocaleDateString('en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}
          </Text>
        </HStack>

        <Divider />

        {/* Content */}
        <Wrap spacing={4} align="center" justify="space-between" w="full">
          {/* Resources */}
          <WrapItem flex="1">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" color="gray.600" fontSize="md">
                Resources:
              </Text>
              {reservation.resources.map((item) => (
                <Text key={item.resourceId._id} color="gray.700" fontSize="sm">
                  {item.resourceId.name}{' '}
                  {item.resourceId.type === 'facility' ? (
                    <> - Address: {item.resourceId.address}</>
                  ) : (
                    <strong>x {item.quantity}</strong>
                  )}
                </Text>
              ))}
            </VStack>
          </WrapItem>

          {/* Purpose */}
          <WrapItem flex="1">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" color="gray.600" fontSize="md">
                Purpose:
              </Text>
              <Text color="gray.700" fontSize="sm">
                {reservation.purpose}
              </Text>
            </VStack>
          </WrapItem>

          {/* Start Date */}
          <WrapItem flex="1">
            <HStack spacing={2}>
              <Icon as={FaCalendarAlt} color="teal.500" boxSize={5} />
              <Text color="gray.700" fontSize="sm">
                <strong>Start:</strong>{' '}
                {new Date(reservation.startDate).toLocaleDateString()}
              </Text>
            </HStack>
          </WrapItem>

          {/* End Date */}
          <WrapItem flex="1">
            <HStack spacing={2}>
              <Icon as={FaCalendarAlt} color="teal.500" boxSize={5} />
              <Text color="gray.700" fontSize="sm">
                <strong>End:</strong>{' '}
                {new Date(reservation.endDate).toLocaleDateString()}
              </Text>
            </HStack>
          </WrapItem>

          {/* Status */}
          <WrapItem>
            <Badge
              colorScheme={getStatusColor(reservation.status)}
              px={4}
              py={1}
              fontSize="sm"
              borderRadius="full"
            >
              {reservation.status}
            </Badge>
          </WrapItem>
        </Wrap>
      </VStack>
    </Box>
  );
}

export default TrackReservationListResident;