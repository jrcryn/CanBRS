
import { Box, Text, VStack, Flex, useBreakpointValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ReservationStep = ({ stepNumber, stepText }) => {
  // Define responsive size values based on breakpoints
  const boxSize = useBreakpointValue({ base: '100px', sm: '120px', md: '150px' });
  const fontSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'md' });
  const circleSize = useBreakpointValue({ base: '24px', sm: '28px', md: '30px' });

  return (
    <VStack
      w={boxSize}
      h={boxSize}
      bg="blue.500"
      color="white"
      borderRadius="md"
      justify="center"
      textAlign="center"
      spacing={{ base: 1, md: 2 }}
      p={2}
      boxShadow="md"
    >
      <Box
        bg="white"
        color="blue.500"
        borderRadius="full"
        w={circleSize}
        h={circleSize}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        fontSize={{ base: 'sm', md: 'md' }}
      >
        {stepNumber}
      </Box>
      <Text fontWeight="bold" fontSize={fontSize} whiteSpace="pre-wrap" textAlign="center" lineHeight="1.2">
        {stepText}
      </Text>
    </VStack>
  );
};

const ReservationProcess = () => {
  return (
    <VStack spacing={{ base: 6, md: 10 }} w="full" px={{ base: 4, md: 8 }}>
      <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="blue.500" textAlign="center">
        Reservation Process
      </Text>
      <Flex flexWrap="wrap" justify="center" gap={{ base: 3, sm: 4, md: 6 }} maxW="1200px">
        <ReservationStep stepNumber="1" stepText={"Browse\nResources"} />
        <ReservationStep stepNumber="2" stepText={"Submit\nRequest"} />
        <ReservationStep stepNumber="3" stepText={"Wait for\nApproval"} />
        <ReservationStep stepNumber="4" stepText={"Submit\nRequirements"} />
        <ReservationStep stepNumber="5" stepText={"Wait for\nConfirmation"} />
        <ReservationStep stepNumber="6" stepText={"Resource\nSecured"} />
      </Flex>
    </VStack>
  );
};

export default ReservationProcess;


ReservationStep.propTypes = {
  stepNumber: PropTypes.any,
  stepText: PropTypes.any,
};
ReservationProcess.propTypes = {
  stepNumber: PropTypes.any,
  stepText: PropTypes.any,
};
