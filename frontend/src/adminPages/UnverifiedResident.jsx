import React, { useEffect, useState } from 'react';
import { UseResidentStore } from '../store/residents.js';
import { useNavigate } from 'react-router-dom';
import { Container,Text, VStack, HStack, Button, Select, Input, InputGroup, InputLeftElement, Alert, AlertIcon,
} from '@chakra-ui/react';

import { Sitios } from '../components/sitios.js';
import { SearchIcon } from '@chakra-ui/icons';
import ResidentAccountsCard from '../components/ResidentAccountsCard';
import LoadingSpinner from '../components/LoadingSpinner';
const UnverifiedResidents = () => {
  const { residents, fetchResidents, isLoading, error } = UseResidentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSitio, setSelectedSitio] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error fetching resident accounts. Please try again later.
      </Alert>
    );
  }

    // Filter unapproved residents
    const filteredResidents = residents
    .filter(resident => !resident.isApproved) // Only unapproved residents
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
          <Text fontSize="3xl" fontWeight="bold" color="red.600">
            Unverified Resident Accounts
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

            {/* Go Back Button */}
            <Button 
            colorScheme="Blue" 
            onClick={() => navigate('/admin/resident-accounts')}
            bg={'blue.500'}
            variant="outline"
            >
                ← Go Back
            </Button>
          </HStack>
        </HStack>

        {/* Residents List */}
        {filteredResidents.length === 0 ? (
          <Text fontSize="2xl" textAlign="center" fontWeight="bold" color="gray.500">
            No Unverified Residents Found
          </Text>
        ) : (
          <VStack spacing={4} w="full" align="stretch">
            {filteredResidents.map((resident) => (
              <ResidentAccountsCard key={resident._id} resident={resident}/>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );

};

export default UnverifiedResidents;