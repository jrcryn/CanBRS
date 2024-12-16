import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  Box,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import LoadingSpinner from '../components/LoadingSpinner';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { UseResidentStore } from '../store/residents.js';

const AdminAccountsPage = () => {

  const { admins, isLoading, error, fetchAdmins } = UseResidentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  // Filter admins based on search query and selected role
  const filteredAdmins = admins.filter(admin =>
    `${admin.name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={4} align="stretch">
        {/* Header Section */}
        <HStack justifyContent="space-between" w="full" flexWrap="wrap">
          {/* Title */}
          <Text fontSize="3xl" fontWeight="bold" color="blue.600">
            Admin Accounts
          </Text>

          {/* Search and Role Filter */}
          <HStack spacing={4} flexWrap="wrap">
            {/* Search Input */}
            <InputGroup width={{ base: 'full', md: '250px' }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                size="md"
                variant="outline"
                placeholder="Search by Admin Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <HStack>
            <Button colorScheme="blue" onClick={() => navigate('/admin/create-admin')} leftIcon={<AddIcon />}>
              Create Admin
            </Button>
          </HStack>
          </HStack>
        </HStack>

        {/* Admins List */}
        {filteredAdmins.length === 0 ? (
          <Text fontSize="2xl" textAlign="center" fontWeight="bold" color="gray.500">
            No Admins Found
          </Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredAdmins.map((admin) => (
              <AdminCard key={admin._id} admin={admin} />
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

// AdminCard Component within the same file
const AdminCard = ({ admin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        _hover={{ shadow: 'lg' }}
        transition="all 0.2s"
      >
        <HStack spacing={4}>
          {/* Avatar */}
          <Avatar
            name={`${admin.name}`}
            size="lg"
            src={
              admin.profilePicture
                ? `data:${admin.profilePicture.contentType};base64,${admin.profilePicture.data}`
                : ''
            }
          />

          {/* Admin Info */}
          <VStack align="start" spacing={1} flex="1">
            <Text fontWeight="bold" fontSize="lg">
              {admin.name}
            </Text>
            <Text color="gray.600">{admin.email}</Text>
          </VStack>

          {/* View Details Button */}
          <Button onClick={onOpen} colorScheme="blue">
            View Details
          </Button>
        </HStack>
      </Box>

      {/* Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="md" overflow="hidden">
        {/* Header */}
        <ModalHeader bg="blue.600" color="white" fontSize="xl">
          Admin Details
        </ModalHeader>

        {/* Body */}
        <ModalBody bg="gray.50" py={6}>
          <VStack spacing={6} align="stretch">
            {/* Admin Info */}
            <HStack spacing={4}>
            <Avatar
              name={`${admin.name}`}
              size="xl"
              src={
                admin.profilePicture
                  ? `data:${admin.profilePicture.contentType};base64,${admin.profilePicture.data}`
                  : ''
              }
            />
              <VStack align="start">
                <Text fontWeight="bold" fontSize="2xl">
                  {admin.name}
                </Text>
                <Text color="gray.600">{admin.email}</Text>
                <Text color="gray.600">{admin.phone || 'N/A'}</Text>
              </VStack>
            </HStack>

            {/* Contact Information */}
            <Box p={4} bg="white" borderRadius="md" shadow="sm" border="1px solid" borderColor="gray.200">
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                Contact Information
              </Text>
              <Text>Email: {admin.email}</Text>
              <Text>Phone: {admin.phone || 'N/A'}</Text>
            </Box>

            {/* Profile Picture Section */}
            {admin.profilePicture && (
              <Box p={4} bg="white" borderRadius="md" shadow="sm" border="1px solid" borderColor="gray.200">
                <Text fontWeight="bold" fontSize="lg" mb={2}>
                  Profile Picture
                </Text>
                <Zoom>
                  <Avatar
                    name={`${admin.firstname} ${admin.lastname}`}
                    src={admin.profilePicture}
                    size="2xl"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                  />
                </Zoom>
              </Box>
            )}
          </VStack>
        </ModalBody>

        {/* Footer */}
        <ModalFooter bg="gray.100">
          <Button onClick={onClose} colorScheme="blue" width="full">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    </>
  );
};

export default AdminAccountsPage;