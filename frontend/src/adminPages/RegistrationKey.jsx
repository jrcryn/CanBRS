import React, { useEffect } from 'react';
import {
  Container,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '../store/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const RegistrationKey = () => {
  const {
    keys = [],
    fetchKeys,
    generateRegistrationKey,
    deleteRegistrationKey, // Ensure this function exists in your store
    isLoading,
    error,
  } = useAuthStore();
  const toast = useToast();

  // Handle key generation with toast feedback
  const handleGenerateKey = async () => {
    try {
      await generateRegistrationKey();
      await fetchKeys(); // Update key list
      toast({
        title: 'Success',
        description: 'New registration key generated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle key deletion with toast feedback
  const handleDeleteKey = async (keyId) => {
    try {
      await deleteRegistrationKey(keyId); // Call delete method
      await fetchKeys(); // Update key list
      toast({
        title: 'Success',
        description: 'Registration key deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch keys on component mount
  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error fetching registration keys. Please try again later.
      </Alert>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={1}>
        {/* Header Section */}
        <HStack justifyContent="space-between" w="full" mb={6} flexWrap="wrap">
          <Text fontSize={{ base: '3xl', md: '3xl' }} fontWeight="bold" color="blue.600">
            Registration Keys
          </Text>
          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            onClick={handleGenerateKey}
            isLoading={isLoading}
          >
            Generate Key
          </Button>
        </HStack>

        {/* Notice Section */}
        <Box w={'full'}>
        <Alert
          status="info"
          variant="subtle"
          flexDirection="row"
          alignItems="flex-start"
          bg="blue.50"
          rounded="md"
          boxShadow="md"
          border="1px"
          borderColor="blue.200"
          w="full"
          p={6}
          mb={8}
        >
          <AlertIcon color="blue.400" />
          <VStack align="flex-start" spacing={2}>
            <Text fontSize="lg" fontWeight="semibold" color="blue.800">
              Important Notice:
            </Text>
            <Text fontSize="md" color="gray.700">
              Registration keys are unique codes used to create admin accounts and grant access to the admin dashboard.
            </Text>
            <Text fontSize="md" fontWeight="bold" color="blue.800">
              As an admin, it is your responsibility to keep these keys secure and ensure they are generated exclusively for authorized personnel.
            </Text>
            <Text fontSize="md" fontWeight="bold" color="red.600">
              Be sure to delete them immediately after use.
            </Text>
          </VStack>
        </Alert>
        </Box>


        {/* Key List */}
        {keys.length === 0 ? (
          <Text fontSize="2xl" textAlign="center" fontWeight="bold" color="gray.500">
            No Registration Keys Found
          </Text>
        ) : (
          <Table variant="striped" colorScheme="gray" size="md">
            <Thead bg="white">
              <Tr>
                <Th>Key</Th>
                <Th>Generated On</Th>
                <Th>Last Used</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {keys.map((key) => (
                <Tr key={key._id}>
                  <Td>{key.key}</Td>
                  <Td>{new Date(key.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    {key.lastUsed
                      ? new Date(key.lastUsed).toLocaleDateString()
                      : <Text color="gray.400" fontStyle="italic">Not used</Text>}
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Delete Key"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDeleteKey(key._id)}
                      size="sm"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Container>
  );
};

export default RegistrationKey;
