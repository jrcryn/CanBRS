import React, { useEffect, useState } from 'react';
import {
  Container,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  Textarea,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useListingStore } from '../store/listing';
import ListingCardAdmin from '../components/ListingCardAdmin';
import LoadingSpinner from '../components/LoadingSpinner';

const Listings = () => {

  const { listing, fetchListing, createListing, isLoading, error, initializeSocketListeners } = useListingStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newListing, setNewListing] = useState({
    name: '',
    description: '',
    inventory: '',
    address: '',
    image: null,
    type: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchListing();
    initializeSocketListeners();
  }, []);

  const handleAddListing = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newListing.name);
    formData.append('description', newListing.description);
    formData.append('type', newListing.type);
    formData.append('image', newListing.image);

    if (newListing.type === 'equipment') {
      formData.append('inventory', newListing.inventory);
    } else if (newListing.type === 'facility') {
      formData.append('address', newListing.address);
    }

    try {
      await createListing(formData);
      toast({
        title: 'Listing created.',
        description: 'The new listing has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Reset form and close modal
      setNewListing({
        name: '',
        description: '',
        inventory: '',
        address: '',
        image: null,
        type: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating the listing.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error fetching listings. Please try again later.
      </Alert>
    );
  }

    // To filter listings based on the search query
    const filteredListings = listing.filter((listing) => {
      const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType ? listing.type === selectedType : true;
      return matchesSearch && matchesType;
    });

  return (
    <>
    <Container maxW="container.xl" py={5}>
      <VStack spacing={4}>
        {/* Header Section */}
        <HStack justifyContent="space-between" w="full" mb={8} flexWrap="wrap">
          {/* Title */}
          <Text fontSize="3xl" fontWeight="bold" color="blue.600">
            Equipments and Resources
          </Text>

          <HStack>
          <InputGroup width={{ base: 'full', md: '250px' }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                size="md"
                variant="outline"
                placeholder="Search by Listing Name"
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

          {/* Add New Listing Button */}
          <Button colorScheme="blue" onClick={onOpen}>
              Add New Listing
          </Button>
          </HStack>
        </HStack>

        {/* Listings */}
        <VStack spacing={4} w="full">
          {filteredListings.map((item) => (
            <ListingCardAdmin key={item._id} listing={item} />
          ))}

        {/* No Listings Message */}
        {filteredListings.length === 0 && (
          <Text fontSize={'2xl'} textAlign={'center'} fontWeight={'bold'} color={'gray.500'}>
            No Listings Available
          </Text>
        )}
        </VStack>
      </VStack>
    </Container>

  {/* Modal for creating new listings */}
  <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered closeOnOverlayClick={false}>
    <ModalOverlay />
    <ModalContent borderRadius="md" overflow="hidden">
      {/* Header */}
      <ModalHeader bg="blue.600" color="white" fontSize="xl">
        Add New Listing
      </ModalHeader>

      <ModalBody bg="gray.50" py={6}>
        <form onSubmit={handleAddListing}>
          <VStack spacing={4} align="stretch">
            {/* Listing Name */}
            <FormControl isRequired>
              <FormLabel>Listing Name</FormLabel>
              <Input
                placeholder="Enter the name of the listing"
                name="name"
                value={newListing.name}
                onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                focusBorderColor="blue.400"
                bg="white"
                borderColor="gray.300"
              />
            </FormControl>

            {/* Description */}
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter a detailed description of the listing"
                name="description"
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                focusBorderColor="blue.400"
                bg="white"
                borderColor="gray.300"
              />
            </FormControl>

            {/* Type Select */}
            <FormControl isRequired>
              <FormLabel>Type</FormLabel>
              <Select
                placeholder="Select the type of listing"
                name="type"
                value={newListing.type}
                onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                focusBorderColor="blue.400"
                bg="white"
                borderColor="gray.300"
              >
                <option value="equipment">Equipment</option>
                <option value="facility">Facility</option>
              </Select>
            </FormControl>

            {/* Inventory or Address Input */}
            {newListing.type === 'equipment' && (
              <FormControl isRequired>
                <FormLabel>Inventory</FormLabel>
                <Input
                  placeholder="Enter available inventory quantity"
                  name="inventory"
                  type="number"
                  value={newListing.inventory}
                  onChange={(e) => setNewListing({ ...newListing, inventory: e.target.value })}
                  focusBorderColor="blue.400"
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>
            )}

            {newListing.type === 'facility' && (
              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  placeholder="Enter the facility address"
                  name="address"
                  value={newListing.address}
                  onChange={(e) => setNewListing({ ...newListing, address: e.target.value })}
                  focusBorderColor="blue.400"
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>
            )}

            {/* Image Upload */}
            <FormControl isRequired>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewListing({ ...newListing, image: e.target.files[0] })}
                focusBorderColor="blue.400"
                bg="white"
                borderColor="gray.300"
              />
            </FormControl>
          </VStack>

          {/* Footer */}
          <ModalFooter justifyContent="space-between" px={0} mt={6} mb={-5}>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose} borderWidth="1px">
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalBody>
    </ModalContent>
  </Modal>


    </>
  );
};

export default Listings;