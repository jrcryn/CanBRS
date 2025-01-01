import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UseResidentStore } from '../store/residents.js';
import { Container, Text, VStack, HStack, Button, Select, Input, InputGroup, InputLeftElement, Alert, AlertIcon,
} from '@chakra-ui/react';

import { Sitios } from '../components/sitios.js';
import { SearchIcon } from '@chakra-ui/icons';
import ResidentAccountsCard from '../components/ResidentAccountsCard';
import LoadingSpinner from '../components/LoadingSpinner';


const ResidentAccounts = () => {
  const navigate = useNavigate();
  const { residents, fetchResidents, isLoading, error } = UseResidentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSitio, setSelectedSitio] = useState('');



  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  // Get count of unapproved residents
  const unverifiedCount = residents.filter(resident => !resident.isApproved).length;

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error fetching resident accounts. Please try again later.
      </Alert>
    );
  }

  // Filter approved residents
  const filteredResidents = residents
    .filter(resident => resident.isApproved) // Only approved residents
    .filter(resident => {
      const fullName = `${resident.firstname} ${resident.lastname}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());
      const matchesSitio = selectedSitio ? resident.sitio === selectedSitio : true;
      return matchesSearch && matchesSitio;
    });

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={1}>
        {/* Header Section */}
        <HStack justifyContent="space-between" w="full" mb={8} flexWrap="wrap">
          {/* Title */}
          <Text fontSize="3xl" fontWeight="bold" color="blue.600">
            Verified Resident Accounts
          </Text>

          {/* Search, Sitio Filter, and Unverified Accounts Button */}
          <HStack spacing={4} flexWrap="wrap">
            {/* Search Input */}
            <InputGroup width={{ base: 'full', md: '250px' }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                size="md"
                variant="outline"
                placeholder="Search by Resident Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            {/* Sitio Select */}
            <Select
              placeholder="Select Sitio"
              variant="outline"
              width={{ base: 'full', md: '150px' }}
              value={selectedSitio}
              onChange={(e) => setSelectedSitio(e.target.value)}
            >
              {Sitios.map((sitio) => (
                <option key={sitio} value={sitio}>
                  {sitio}
                </option>
              ))}
            </Select>

            {/* Unverified Accounts Button */}
            <Button colorScheme="red" onClick={() => navigate('/admin/unverified-residents')}>
              Unverified Accounts ({unverifiedCount})
            </Button>
          </HStack>
        </HStack>

        {/* Residents List */}
        {filteredResidents.length === 0 ? (
          <Text fontSize="2xl" textAlign="center" fontWeight="bold" color="gray.500">
            No Verified Residents Found
          </Text>
        ) : (
          <VStack spacing={4} w="full" align="stretch">
            {filteredResidents.map((resident) => (
              <ResidentAccountsCard key={resident._id} resident={resident} />
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default ResidentAccounts;