
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Flex align="center" justify="center" minH="85vh" px={6}>
      <Box textAlign="center">
        <Heading
          display="inline-block"
          as="h1"
          size="4xl"
          bgGradient="linear(to-r, blue.400, blue.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="2xl" mt={3} mb={2} fontWeight="bold">
          Page Not Found
        </Text>
        <Text color="gray.500" mb={6}>
          The page you&apos;re looking for does not seem to exist.
        </Text>
        <Button
          colorScheme="blue"
          bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
          color="white"
          variant="solid"
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Flex>
  );
}
