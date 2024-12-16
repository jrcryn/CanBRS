import React, { useState, useEffect } from 'react';
import { useListingStore } from '../store/listing';
import { useReservationStore } from '../store/reservation';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import ReCAPTCHA from 'react-google-recaptcha';
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Heading,
  Text,
  Select,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  FormHelperText,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { FaCalendarAlt } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const InquireForm = () => {
  const { listingsWithoutImages: listing, fetchListingWithoutImages: fetchListing, isLoading: listingLoading } = useListingStore();
  const { createReservation, isLoading } = useReservationStore();
  const [availableListings, setAvailableListings] = useState([]);
  const [selectedListings, setSelectedListings] = useState([]);
  const navigate = useNavigate();

  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');

  const toast = useToast();

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);


  useEffect(() => {
    // Filter listings with inventory > 0 or type is 'facility'
    if (listing) {
      const available = listing.filter((item) => item.inventory > 0 || item.type === 'facility');
      setAvailableListings(available);
    }

    // Synchronize selectedListings with updated listings
    setSelectedListings((prevSelected) =>
      prevSelected
        .map((selectedItem) => {
          const updatedItem = listing.find((listItem) => listItem._id === selectedItem.resource._id);
          if (updatedItem) {
            return { ...selectedItem, resource: updatedItem };
          }
          return null; // Listing was deleted
        })
        .filter(Boolean)
    );

    // Check for deleted listings
    const removedListings = selectedListings.filter(
      (selectedItem) => !listing.some((listItem) => listItem._id === selectedItem.resource._id)
    );

    if (removedListings.length > 0) {
      toast({
        title: 'Resource Updated',
        description: 'Some selected resources were updated or removed. Please review your selection.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [listing]);

  if (listingLoading) {
    return <LoadingSpinner />;
  }

  const handleTargetResourceChange = (event) => {
    const resourceId = event.target.value;
    const resource = availableListings.find((item) => item._id === resourceId);
    if (resource && !selectedListings.some((item) => item.resource._id === resourceId)) {
      // If the resource is a facility, omit the quantity or set a default value
      const newListing = resource.type === 'facility' ? { resource, quantity: null } : { resource, quantity: 1 };
      setSelectedListings((prev) => [...prev, newListing]);
    }
  };

  const handleQuantityChange = (index, quantity) => {
    if (/^\d*$/.test(quantity)) {
      setSelectedListings((prevListings) => {
        const newListings = [...prevListings];
        newListings[index].quantity = quantity;
        return newListings;
      });
    }
  };

  const handleRemoveListing = (resourceId) => {
    setSelectedListings((prev) => prev.filter((item) => item.resource._id !== resourceId));
  };

  // Recaptcha token handler
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate quantities for equipment only
    const invalidQuantities = selectedListings.some((item) => {
      if (item.resource.type === 'facility') return false;
      const quantity = parseInt(item.quantity, 10);
      return isNaN(quantity) || quantity < 1 || quantity > item.resource.inventory;
    });

    if (invalidQuantities) {
      // Show an error message or toast to the user
      toast({
        title: 'Invalid Quantity',
        description: 'Please enter valid quantities for all selected equipment resources.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Collect form data, including selected listings and their quantities
    const requestData = {
      resources: selectedListings.map((item) => ({
        resourceId: item.resource._id,
        quantity: item.resource.type === 'facility' ? 1 : parseInt(item.quantity, 10),
      })),
      purpose,
      startDate,
      endDate,
      recaptchaToken,
    };

    if (!recaptchaToken) {
      toast({
        title: 'reCAPTCHA Required',
        description: 'Please complete the reCAPTCHA verification.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await createReservation(requestData);
      toast({
        title: 'Request Submitted',
        description: 'Your reservation request has been submitted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/resident/track-reservation');
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast({
        title: 'Submission Error',
        description: 'There was a problem submitting your request.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="1000px"
      mx={{ base: 2, md: "auto" }}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      mt={8}
    >
      <Heading as="h2" size="xl" textAlign="center" color="blue.600" mb={4}>
        Request Form
      </Heading>
      <Text textAlign="center" mb={8}>
        Interested in reserving a barangay community resource? Start by filling out the form below.
      </Text>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>

          {/* Target Resources Field */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl isRequired>
              <FormLabel>Target Resource/s</FormLabel>
              <Select 
                placeholder="Select a resource" 
                value={selectedResourceId}
                onChange={(e) => {
                  setSelectedResourceId(e.target.value);
                  handleTargetResourceChange(e);
                }}
              >
                {availableListings.map((resource) => (
                  <option key={resource._id} value={resource._id}>
                    {resource.type === 'facility' 
                      ? `${resource.name} - ${resource.address}` 
                      : resource.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>

          {/* Selected Listings Display */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel>Selected Resource/s</FormLabel>
              <List spacing={2} borderWidth={1} borderRadius="md" p={2}>
                {selectedListings.length > 0 ? (
                  selectedListings.map((item, index) => (
                    <ListItem
                      key={item.resource._id}
                      color="gray.700"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text flex="1">
                        {item.resource.type === 'facility'
                          ? `${item.resource.name} - ${item.resource.address}`
                          : item.resource.name}
                      </Text>
                      {item.resource.type !== 'facility' && (
                        <Input
                          type="number"
                          min={1}
                          max={item.resource.inventory}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          width="80px"
                          mr={2}
                        />
                      )}
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveListing(item.resource._id)}
                      >
                        <CloseIcon boxSize={3} />
                      </Button>
                    </ListItem>
                  ))
                ) : (
                  <Text color="gray.500">No resources selected yet</Text>
                )}
              </List>
            </FormControl>
          </GridItem>

          {/* Start Date Field */}
          <FormControl isRequired>
            <FormLabel>Start Date</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<FaCalendarAlt color="gray.300" />} />

              <Input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} />
            </InputGroup>
            <FormHelperText>
              Enter the date when you will start using and borrowing the resources.
            </FormHelperText>
          </FormControl>

          {/* End Date Field */}
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<FaCalendarAlt color="gray.300" />} />
                <Input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} />
              </InputGroup>
              <FormHelperText>
                Enter the date when you will finish using and borrowing the resources. It can be the same day or one day later.
              </FormHelperText>
            </FormControl>
          </GridItem>

          {/* Purpose Field */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl isRequired>
              <FormLabel>Purpose</FormLabel>
              <Input 
                placeholder="Purpose for reserving (e.g., Birthday Party)"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)} />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Recaptcha */}
        <Box mt={6} textAlign="center" display="flex" justifyContent="center">
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={handleRecaptchaChange}
            size='normal'
          />
        </Box>

        <Box mt={5} textAlign="center">
          <Button 
            colorScheme="blue" 
            type="submit" 
            width={{ base: "100%", md: "50%" }} 
            isLoading={isLoading} 
          >
            Submit Request
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default InquireForm;