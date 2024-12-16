import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'; 
import { Link as ChakraLink } from '@chakra-ui/react'; 

const ReservationPolicies = () => {
  return (
    <Box
      maxW={{ base: "90%", md: "800px" }} // Responsive width for mobile and desktop
      mx="auto"
      py={{ base: 6, md: 10 }} // Adjust padding for smaller screens
      px={{ base: 4, md: 0 }} // Extra padding on smaller screens
    >
      <Heading as="h1" size={{ base: "lg", md: "xl" }} mb={6} textAlign="center" color="blue.600">
        Barangay Resource Reservation Policies
      </Heading>

      <VStack align="start" spacing={4} pt={4}>
        <Text fontSize={{ base: "sm", md: "md" }}>
          Before reserving barangay resources, please review the following policies to help ensure a smooth process. These guidelines are in place to manage our limited resources and prioritize community needs.
        </Text>

        <Heading as="h2" size={{ base: "md", md: "lg" }} mt={6}>
          Priority for Funerals
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }}>
          Resources, especially equipment, will be given priority for funeral services. If there is a funeral and a resource shortage, previously scheduled reservations may need to be changed. We appreciate your understanding in this matter.
        </Text>

        <Heading as="h2" size={{ base: "md", md: "lg" }} mt={6}>
          Priority for Barangay Events
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }}>
          Events organized by the barangay will take precedence in resource reservations. If the barangay needs equipment that has already been reserved, we may need to cancel or reschedule those reservations. Affected individuals will be informed in advance.
        </Text>

        <Heading as="h2" size={{ base: "md", md: "lg" }} mt={6}>
          Possible Changes to Reservations
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }}>
          Please understand that all reservations may change due to unexpected needs or emergencies. While we aim to honor all bookings, certain situations may require us to adjust or reschedule your reservation.
        </Text>

        <Heading as="h2" size={{ base: "md", md: "lg" }} mt={6}>
          Limited Availability of Equipment
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }}>
          The availability of resources is limited. We may need to change your requested quantity based on what is actually available and will inform you if we cannot provide your full request.
        </Text>

        <Heading as="h2" size={{ base: "md", md: "lg" }} mt={6}>
          Exclusions from the Reservation System
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }}>
          Our online reservation system is currently focused on non-emergency needs and does not include vehicles. For urgent resource needs, please navigate to{' '}
          <ChakraLink
            as={ReactRouterLink}
            to="/urgent-needs"
            color="blue.600"
            textDecoration="underline"
          >
            for urgent needs
          </ChakraLink>{' '}
          page and contact the barangay office hotline directly.
        </Text>

        <Heading as="h2" size={{ base: "md", md: "lg" }} mt={6}>
          Access to the Online System
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }}>
          We recognize that not all residents have internet access. The barangay has appointed staff to help with reservation requests. Email notifications are available for offline staff to ensure timely communication. However, please note that response times may vary.
        </Text>
      </VStack>
    </Box>
  );
};

export default ReservationPolicies;
