import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Text,
  VStack,
  
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
  Stack} from '@chakra-ui/react';

import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import LoadingSpinner from '../components/LoadingSpinner';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { UseResidentStore } from '../store/residents.js';
import PropTypes from 'prop-types';

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
        <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-between" w="full" flexWrap="wrap">
          {/* Title */}
          <Text fontSize="3xl" fontWeight="bold" color="blue.600">
            Admin Accounts
          </Text>

          {/* Search and Role Filter */}
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} flexWrap="wrap" w={{ base: 'full', md: 'auto' }}>
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
            <Box w={{ base: 'full', md: 'auto' }}>
              <Button w={{ base: 'full', md: 'auto' }} colorScheme="blue" onClick={() => navigate('/admin/create-admin')} leftIcon={<AddIcon />}>
                Create Admin
              </Button>
            </Box>
          </Stack>
        </Stack>

        {/* Admins List */}
        {(!filteredAdmins || filteredAdmins.length === 0) ? (
          <Text fontSize="2xl" textAlign="center" fontWeight="bold" color="gray.500">
            No Admins Found
          </Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredAdmins?.map((admin) => (
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
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align={{ base: 'center', md: 'start' }} textAlign={{ base: 'center', md: 'left' }}>
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
          <VStack align={{ base: 'center', md: 'start' }} spacing={1} flex="1">
            <Text fontWeight="bold" fontSize="lg">
              {admin.name}
            </Text>
            <Text color="gray.600">{admin.email}</Text>
          </VStack>

          {/* View Details Button */}
          <Button onClick={onOpen} colorScheme="blue" w={{ base: 'full', md: 'auto' }}>
            View Details
          </Button>
        </Stack>
      </Box>

      {/* Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }} isCentered>
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
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align={{ base: 'center', md: 'start' }} textAlign={{ base: 'center', md: 'left' }}>
            <Avatar
              name={`${admin.name}`}
              size="xl"
              src={
                admin.profilePicture
                  ? `data:${admin.profilePicture.contentType};base64,${admin.profilePicture.data}`
                  : ''
              }
            />
              <VStack align={{ base: 'center', md: 'start' }}>
                <Text fontWeight="bold" fontSize="2xl">
                  {admin.name}
                </Text>
                <Text color="gray.600">{admin.email}</Text>
                <Text color="gray.600">{admin.phone || 'N/A'}</Text>
              </VStack>
            </Stack>

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
AdminAccountsPage.propTypes = {
  admin: PropTypes.any,
};
AdminCard.propTypes = {
  admin: PropTypes.any,
};
