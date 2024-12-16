import React from 'react';
import { Box, Heading, Text, Button, Stack, useBreakpointValue, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const RequestPagePlaceholder = () => {
  return (
    <Flex
      minH="85vh"
      align="center"
      justify="center"
      px={{ base: 6, md: 8 }}
    >
      <Box
        maxW="lg"
        textAlign="center"
        py={{ base: 10, md: 20 }}
        px={{ base: 6, md: 8 }}
      >
        <Heading as="h2" size={useBreakpointValue({ base: 'lg', md: 'xl' })} mb={4}>
          Oops... But first,
        </Heading>
        <Text fontSize={useBreakpointValue({ base: 'md', md: 'lg' })} mb={6}>
        You need to create a resident account or log in to request a resource reservation with the barangay.        </Text>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={4}
          justify="center"
        >
          <Button as={Link} to="/auth/login" colorScheme="blue">
            Log In
          </Button>
          <Button as={Link} to="/auth/resident-signup" colorScheme="blue" variant="outline">
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default RequestPagePlaceholder;