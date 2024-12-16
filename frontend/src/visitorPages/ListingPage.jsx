import React, { useEffect, useState } from 'react';
import { useListingStore } from "../store/listing";
import ListingCard from '../components/ListingCardClient';
import { Link as ReactRouterLink } from 'react-router-dom';
import { 
  Container,
  SimpleGrid,
  Text,
  VStack,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  HStack,
  Select,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import LoadingSpinner from '../components/LoadingSpinner';

const ListingPage = () => {
  const { fetchListing, listing, isLoading } = useListingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // To filter listings based on the search query
  const filteredListings = listing.filter((listing) => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? listing.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  return (
    <Container maxW={'container.xl'} py={10}>
      <VStack spacing={8}>

        {/* Header Section */}
        <HStack justifyContent="space-between" w="full" mb={8} flexWrap="wrap">
          {/* Title */}
          <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight={'bold'} color={'blue.600'}>
            Equipment and Facilities
          </Text>

          {/* Search, Sort, and Inquire Button */}
          <HStack spacing={4} flexWrap="wrap">
            <InputGroup width={{ base: 'full', md: '250px' }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search"
                size="md"
                variant="outline"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select 
              placeholder="Show All" 
              variant="outline" 
              width={{ base: 'full', md: '150px' }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="equipment">Equipment</option>
              <option value="facility">Facility</option>
            </Select>

            <Button colorScheme="blue" variant="solid" width={{ base: 'full', md: '100px' }} as={ReactRouterLink} to="/request-form">
              Inquire
            </Button>
          </HStack>
        </HStack>

        {/* Main Listing Grid */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
          spacing={{ base: 5, md: 10 }}
          w={'full'}
        >
          {filteredListings.map((item) => (
            <ListingCard key={item._id} listing={item} />
          ))}
        </SimpleGrid>

        {/* No Listings Message */}
        {filteredListings.length === 0 && (
          <Text fontSize={'2xl'} textAlign={'center'} fontWeight={'bold'} color={'gray.500'}>
            No Listings Available
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default ListingPage;