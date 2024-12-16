import React from 'react';
import { Box, Text, VStack, HStack, useBreakpointValue } from '@chakra-ui/react';

const ReservationStep = ({ stepNumber, stepText }) => {
  // Define responsive size values based on breakpoints
  const boxSize = useBreakpointValue({ base: '100px', md: '150px' });
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <VStack
      w={boxSize}
      h={boxSize}
      bg="blue.500"
      color="white"
      borderRadius="md"
      justify="center"
      textAlign="center"
      spacing={2}
    >
      <Box
        bg="white"
        color="blue.500"
        borderRadius="full"
        w="30px"
        h="30px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
      >
        {stepNumber}
      </Box>
      <Text fontWeight="bold" fontSize={fontSize} whiteSpace="pre-wrap" textAlign="center">
        {stepText}
      </Text>
    </VStack>
  );
};

const ReservationProcess = () => {
  // Stack vertically on small screens, horizontally on medium and up
  const direction = useBreakpointValue({ base: 'column', md: 'row' });
  const spacing = useBreakpointValue({ base: 4, md: 6 });

  return (
    <VStack spacing={10}>
      <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="blue.500" textAlign="center">
        Reservation Process
      </Text>
      <HStack spacing={spacing} flexWrap="wrap" justify="center" direction={direction}>
      <ReservationStep stepNumber="1" stepText="Browse     Resources" />
        <ReservationStep stepNumber="2" stepText="Submit         Request" />
        <ReservationStep stepNumber="3" stepText="Wait for      Approval" />
        <ReservationStep stepNumber="4" stepText="Submit Requirements" />
        <ReservationStep stepNumber="5" stepText="Wait for Confirmation" />
        <ReservationStep stepNumber="6" stepText="Resource      Secured" />
      </HStack>
    </VStack>
  );
};

export default ReservationProcess;
