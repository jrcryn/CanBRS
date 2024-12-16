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
      [name]: name === 'inventory' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('type', formData.type);

    if (formData.type === 'equipment') {
      formDataToSend.append('inventory', formData.inventory);
    } else if (formData.type === 'facility') {
      formDataToSend.append('address', formData.address);
    }

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await updateListing(listing._id, formDataToSend);
      onClose();
      toast({
        title: 'Listing updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating listing.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isAvailable = listing.type === 'equipment' ? listing.inventory > 0 : true;
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered closeOnOverlayClick={false} scrollBehavior='inside'>
      <ModalOverlay />
      <ModalContent borderRadius="md" overflow="hidden" maxHeight='100vh'>
        {/* Header */}
        <ModalHeader bg="blue.600" color="white" fontSize="xl">
          Edit Listing
        </ModalHeader>

        {/* Scrollable Content */}
        <form onSubmit={handleUpdate}>
          <ModalBody bg="gray.50" py={6} flex="1" overflowY="auto">
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
              <FormControl isRequired>
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
                <Select
                  placeholder="Select the type of listing"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  focusBorderColor="blue.400"
                  bg="white"
                  borderColor="gray.300"
                >
                  <option value="equipment">Equipment</option>
                  <option value="facility">Facility</option>
                </Select>
              </FormControl>

              {/* Inventory or Address Input */}
              {formData.type === 'equipment' && (
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

              {formData.type === 'facility' && (
                <FormControl isRequired>
                  <FormLabel>Address</FormLabel>
                  <Input
                    placeholder="Enter facility address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
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
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  focusBorderColor="blue.400"
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          {/* Footer */}
          <ModalFooter bg="gray.100" position="sticky" bottom="0" justifyContent="space-between">
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