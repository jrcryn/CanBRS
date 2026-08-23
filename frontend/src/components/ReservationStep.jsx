
import { Box, Flex, Text, VStack, Icon } from '@chakra-ui/react';
import { FaMousePointer, FaListAlt, FaClock, FaFileUpload, FaCheckCircle, FaDoorOpen } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ReservationStep = ({ title, description, icon }) => {
  return (
    <Flex
      bg="white"
      borderRadius="md"
      boxShadow="md"
      p={{ base: 6, md: 8 }}
      align={{ base: 'center', md: 'start' }}
      maxW="900px"
      w="100%"
      m={{ base: 2, md: 4 }}
      direction={{ base: "column", md: "row" }}
      textAlign={{ base: 'center', md: 'left' }}
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
    >
      <Box
        color="blue.500"
        mr={{ base: 0, md: 6 }}
        mb={{ base: 4, md: 0 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={icon} boxSize={{ base: 8, md: 10 }} />
      </Box>
      <VStack align={{ base: 'center', md: 'start' }} spacing={2} flex={1}>
        <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" color="blue.500">
          {title}
        </Text>
        <Text fontSize={{ base: "sm", md: "lg" }} color="gray.600">
          {description}
        </Text>
      </VStack>
    </Flex>
  );
};

const ReservationStepList = () => {
  return (
    <VStack spacing={{ base: 4, md: 6 }} align="center" p={{ base: 4, md: 8 }} w="full">
      <ReservationStep
        icon={FaMousePointer}
        title="Browse Resources"
        description="Begin by browsing through the available venues and checking the information such as seating capacity, amenities (projectors, speakers, computer count, podium, and microphones), availability on date and time, price, and images of the venue."
      />
      <ReservationStep
        icon={FaListAlt}
        title="Submit Request"
        description="Fill out a request form with your preferred date, time, and venue details, and submit it for approval."
      />
      <ReservationStep
        icon={FaClock}
        title="Wait for Approval"
        description="Your request will be reviewed by the admin. You will receive a notification once your request has been approved or declined."
      />
      <ReservationStep
        icon={FaFileUpload}
        title="Submit Requirements"
        description="Once approved, submit the necessary documents or payment as per the guidelines provided."
      />
      <ReservationStep
        icon={FaCheckCircle}
        title="Wait for Confirmation"
        description="After submitting your requirements, wait for the final confirmation to ensure all processes are completed."
      />
      <ReservationStep
        icon={FaDoorOpen}
        title="Resource Secured"
        description="Upon final confirmation, your venue will be secured, and you can proceed with your event planning."
      />
    </VStack>
  );
};

export default ReservationStepList;

ReservationStep.propTypes = {
  title: PropTypes.any,
  description: PropTypes.any,
  icon: PropTypes.any,
};
ReservationStepList.propTypes = {
  title: PropTypes.any,
  description: PropTypes.any,
  icon: PropTypes.any,
};
