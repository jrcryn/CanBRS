import React from 'react';
import { Box, Flex, Text, VStack, Icon } from '@chakra-ui/react';
import { FaMousePointer } from 'react-icons/fa'; // example icon

const ReservationStep = ({ title, description, icon }) => {
  return (
    <Flex
      bg="white"
      borderRadius="md"
      boxShadow="md"
      p={{ base: 4, md: 6 }}
      align="start"
      maxW="900px"
      w="100%"
      m={{ base: 2, md: 4 }}
      direction={{ base: "column", md: "row" }} // Stack vertically on mobile, horizontal on larger screens
    >
      <Box
        color="blue.500"
        fontSize={{ base: "2xl", md: "3xl" }}
        mr={{ base: 0, md: 4 }}
        mb={{ base: 4, md: 0 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={icon} boxSize={{ base: 8, md: 10 }} />
      </Box>
      <VStack align="start" spacing={1}>
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="blue.500">
          {title}
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
          {description}
        </Text>
      </VStack>
    </Flex>
  );
};

const ReservationProcess = () => {
  return (
    <VStack spacing={{ base: 3, md: 6 }} align="center" p={{ base: 4, md: 8 }}>
      <ReservationStep
        icon={FaMousePointer}
        title="Browse Resources"
        description="Begin by browsing through the available venues and checking the information such as seating capacity, amenities (projectors, speakers, computer count, podium, and microphones), availability on date and time, price, and images of the venue."
      />
      <ReservationStep
        icon={FaMousePointer}
        title="Submit Request"
        description="Fill out a request form with your preferred date, time, and venue details, and submit it for approval."
      />
      <ReservationStep
        icon={FaMousePointer}
        title="Wait for Approval"
        description="Your request will be reviewed by the admin. You will receive a notification once your request has been approved or declined."
      />
      <ReservationStep
        icon={FaMousePointer}
        title="Submit Requirements"
        description="Once approved, submit the necessary documents or payment as per the guidelines provided."
      />
      <ReservationStep
        icon={FaMousePointer}
        title="Wait for Confirmation"
        description="After submitting your requirements, wait for the final confirmation to ensure all processes are completed."
      />
      <ReservationStep
        icon={FaMousePointer}
        title="Resource Secured"
        description="Upon final confirmation, your venue will be secured, and you can proceed with your event planning."
      />
    </VStack>
  );
};

export default ReservationProcess;
