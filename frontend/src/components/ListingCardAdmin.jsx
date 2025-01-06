import React from 'react';
import {
  Box, Image, Text, VStack, HStack, Badge, Button, Divider, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Select, useDisclosure, useToast,
  FormControl, FormLabel
} from '@chakra-ui/react';
import { useListingStore } from '../store/listing';

const ListingCardAdmin = ({ listing }) => {
  const { updateListing, isLoading } = useListingStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = React.useState({
    name: listing.name,
    description: listing.description,
    inventory: listing.inventory,
    address: listing.address,
    type: listing.type,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'inventory' ? (value === '' ? '' : parseInt(value, 10)) : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updates = {};
  
    if (formData.name !== listing.name) updates.name = formData.name;
    if (formData.description !== listing.description) updates.description = formData.description;
    if (formData.inventory !== listing.inventory) updates.inventory = parseInt(formData.inventory, 10) || 0;
    if (formData.address !== listing.address) updates.address = formData.address;
  
    // Check if an image is being updated
    const isImageUpdated = !!formData.image;
  
    try {
      if (isImageUpdated) {
        const form = new FormData();
        Object.keys(updates).forEach((key) => {
          if (updates[key] !== undefined) {
            form.append(key, updates[key]);
          }
        });
        form.append('image', formData.image);
        await updateListing(listing._id, form, true);
      } else {
        await updateListing(listing._id, updates, false);
      }
  
      toast({
        title: 'Listing updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error updating listing.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const isAvailable = listing.inventory ? true : false;
  const type = listing.type === 'equipment' ? 'Equipment' : 'Facility';

  return (
    <>
      <Box
        w="full"
        p={4}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        _hover={{ shadow: 'lg' }}
        transition="all 0.2s"
        display="flex"
        flexDirection="column"
      >
        <HStack spacing={4} align="start">
          <Image
            boxSize="150px"
            objectFit="cover"
            src={
              listing.image && listing.image.contentType
                ? `data:${listing.image.contentType};base64,${listing.image.data}`
                : 'placeholder-image-url' // Replace with an actual placeholder image URL
            }
            alt={listing.name}
            borderRadius="md"
          />
          <VStack align="start" spacing={1} flex="1">
            <Text fontWeight="bold" fontSize="lg">{listing.name}</Text>
            <Text fontSize="sm" color="gray.600" noOfLines={3}>{listing.description}</Text>

            {listing.type === 'equipment' && (
              <HStack spacing={2}>
                <Text fontWeight="medium">Inventory:</Text>
                <Text>{listing.inventory}</Text>
              </HStack>
            )}

            {listing.type === 'facility' && (
              <HStack spacing={2}>
                <Text fontWeight="medium">Address:</Text>
                <Text>{listing.address}</Text>
              </HStack>
            )}
          </VStack>
          <Button colorScheme="blue" onClick={onOpen} size="md" w='75px'>
            Edit
          </Button>
        </HStack>

        <Divider my={3} />

        <HStack>
          <Badge colorScheme={isAvailable ? 'green' : 'red'}>
            {isAvailable ? 'Available' : 'Not Available'}
          </Badge>
          <Badge colorScheme="blue">{type}</Badge>
        </HStack>
      </Box>

    {/* Edit Listing Modal */}
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered closeOnOverlayClick={false} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent display="flex" flexDirection="column" h="95vh" maxH="100vh" borderRadius="lg">
        {/* Header */}
        <ModalHeader
          fontWeight="bold"
          fontSize="xl"
          color="white"
          bg="blue.600"
          px={6}
          py={4}
          borderTopRadius="lg"
        >
          Edit Listing
        </ModalHeader>

        {/* Scrollable Content */}
        <form onSubmit={handleUpdate}>
          <ModalBody bg="gray.50" py={6} flex="1" overflowY="auto" maxHeight="80vh">
            <VStack spacing={4} align="stretch">
              {/* Listing Name */}
              <FormControl isRequired>
                <FormLabel>Listing Name</FormLabel>
                <Input
                  placeholder="Enter listing name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  focusBorderColor="blue.400"
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>

              {/* Description */}
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter description of the listing"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  focusBorderColor="blue.400"
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>

              {/* Type Select */}
              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Input
                  value={listing.type === 'equipment' ? 'Equipment' : 'Facility'}
                  isReadOnly
                  bg="gray.100"
                  borderColor="gray.300"
                />
              </FormControl>

              {/* Inventory or Address Input */}
              {listing.type === 'equipment' && (
                <FormControl isRequired>
                  <FormLabel>Inventory</FormLabel>
                  <Input
                    placeholder="Enter available inventory"
                    name="inventory"
                    type="number"
                    value={formData.inventory}
                    onChange={handleChange}
                    focusBorderColor="blue.400"
                    bg="white"
                    borderColor="gray.300"
                  />
                </FormControl>
              )}

              {listing.type === 'facility' && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Address</FormLabel>
                    <Input
                      placeholder="Enter the facility address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      focusBorderColor="blue.400"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Inventory</FormLabel>
                    <Input
                      placeholder="Enter available inventory"
                      name="inventory"
                      type="number"
                      value={formData.inventory}
                      onChange={handleChange}
                      focusBorderColor="blue.400"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                </>
              )}

              {/* Image Upload */}
              <FormControl>
                <FormLabel>Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  focusBorderColor="blue.400"
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          {/* Footer */}
          <ModalFooter 
            justifyContent="space-between" 
            p={6} 
            borderTop="1px solid" 
            borderColor="gray.200" 
            bg="white"
            position="sticky" 
            bottom="0" 
          >
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose} borderWidth="1px">
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>



    </>
  );
};

export default ListingCardAdmin;