import React, { useEffect, useState, forwardRef } from 'react';
import { Box, Text, HStack, VStack, Icon, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Flex, Input, Textarea, useToast, FormControl, FormLabel, Select,
} from '@chakra-ui/react';
import { FaClipboardList, FaUser, FaMapMarkerAlt, FaPhone, FaIdBadge } from 'react-icons/fa';
import { useReservationStore } from '../store/reservation.js'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const ReservationCardAdmin = React.memo(
  (({ isOpen, onOpen, onClose, reservation, bookings, listings }) => {

  const { updateReservationAdmin } = useReservationStore();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const toast = useToast()

  const [localListings, setLocalListings] = useState(listings);

  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [excludeTimesForDate, setExcludeTimesForDate] = useState([]);
  const [initialRemarks, setInitialRemarks] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [dateError, setDateError] = useState(false);

  const [editedPurpose, setEditedPurpose] = useState(reservation?.purpose || '');
  const [editedStartDate, setEditedStartDate] = useState(reservation?.startDate || '');
  const [editedEndDate, setEditedEndDate] = useState(reservation?.endDate || '');
  const [editedStatus, setEditedStatus] = useState(reservation?.status || '');
  const [editedResources, setEditedResources] = useState(
    reservation?.resources?.map((item) => ({
      ...item,
      originalQuantity: item.quantity,
    })) || []
  );

  // Function to get the color based on the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'yellow.100'; // Light yellow
      case 'Approved':
        return 'green.100'; // Light green
      case 'Declined':
        return 'red.100'; // Light red
      case 'In-Use':
        return 'blue.100'; // Light blue
      case 'Returned':
        return 'orange.100'; // Light orange
      default:
        return 'gray.100'; // Default color
    }
  };

  const createTime = (date, hours, minutes) => {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  // Helper function to calculate total slots
  const calculateTotalSlots = (start, end, interval) => {
    const startInMinutes = start.hours * 60 + start.minutes;
    const endInMinutes = end.hours * 60 + end.minutes;
    const totalMinutes = endInMinutes - startInMinutes;
    return totalMinutes / interval;
  };

  const BUSINESS_HOURS_START = { hours: 8, minutes: 30 }; // 8:30 AM
  const BUSINESS_HOURS_END = { hours: 16, minutes: 30 };  // 4:30 PM

  const lunchBreakTimes = selectedDate
  ? [
      createTime(selectedDate, 12, 0),  // 12:00 PM
      createTime(selectedDate, 12, 30),  // 1:00 PM
    ]
  : [];

  const minTime = selectedDate
  ? createTime(selectedDate, BUSINESS_HOURS_START.hours, BUSINESS_HOURS_START.minutes)
  : createTime(new Date(), BUSINESS_HOURS_START.hours, BUSINESS_HOURS_START.minutes);

const maxTime = selectedDate
  ? createTime(selectedDate, BUSINESS_HOURS_END.hours, BUSINESS_HOURS_END.minutes)
  : createTime(new Date(), BUSINESS_HOURS_END.hours, BUSINESS_HOURS_END.minutes);

  // Custom input for the time picker
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Input
    onClick={onClick}
    value={value}
    ref={ref}
    placeholder="Select appointment date and time"
    readOnly
    width="full"
    cursor="pointer"
    _hover={{ borderColor: 'blue.500' }}
  />
  ));

  // Calendar Container for DatePicker
  const CalendarContainer = ({ children }) => {
    return (
      <Box zIndex={1500} position="relative">
        {children}
      </Box>
    );
  };

  // Styled DatePickerWrapper
  const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block;
    width: 100%;
  }

  .react-datepicker__time-container {
    width: 120px;
  }

  .react-datepicker__time-box {
    width: 120px !important;
  }
`;

  // Update excludeTimesForDate when selectedDate changes
  useEffect(() => {
    console.log('Selected Date:', selectedDate);
    console.log('Received bookings:', bookings);
  
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0];
      console.log('Looking for date key:', dateKey);
  
      const bookedTimes = bookings[dateKey] || [];
      console.log('Found booked times for date:', bookedTimes);
  
      // Calculate total available slots (e.g., 30-minute intervals)
      const interval = 30; // minutes
      const totalSlots = calculateTotalSlots(BUSINESS_HOURS_START, BUSINESS_HOURS_END, interval);
      console.log('Total available slots:', totalSlots);
  
      if (bookedTimes.length < totalSlots) {
        const times = bookedTimes.map((bookedTime) => {
          const bookedDate = new Date(bookedTime);
          const time = createTime(selectedDate, bookedDate.getHours(), bookedDate.getMinutes());
          console.log('Created excluded time:', time.toLocaleTimeString());
          return time;
        });
  
        console.log('Final excluded times:', times);
        setExcludeTimesForDate(times);
      } else {
        console.log('All times are booked for this date.');
        setExcludeTimesForDate([]);
      }
    } else {
      setExcludeTimesForDate([]);
    }
  }, [selectedDate, bookings]);


  // Combine booked times with lunch break times
  const excludeTimes = excludeTimesForDate.concat(lunchBreakTimes);


  // Function to handle APPROVING a reservation
  const handleApprove = async (event) => {
    event.preventDefault();
    try {

      if (!appointmentDate) {
        setDateError(true);
        toast({
          title: 'Appointment Date Required',
          description: 'Please set an appointment date and time before approving.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

    const appointmentDateObj = new Date(appointmentDate);

    // Verify that the appointmentDateObj is a valid date
    if (isNaN(appointmentDateObj.getTime())) {
      toast({
        title: 'Invalid Appointment Date',
        description: 'The selected appointment date and time is invalid.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }


      // Check if sufficient inventory is available for each resource
      for (const resource of reservation.resources) {
        // Find the latest inventory
        const listingResource = localListings.find(
          (item) => item._id === resource.resourceId._id
        );
  
        if (!listingResource) {
          toast({
            title: 'Resource Not Found',
            description: `Resource ${resource.resourceId.name} not found.`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
  
        if (listingResource.inventory < resource.quantity) {
          toast({
            title: 'Insufficient Inventory',
            description: `Not enough ${resource.resourceId.name} resource/s to cover the reservation.`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
      }
  
      const updates = {
        status: 'Approved',
        appointmentDate: appointmentDateObj,
        adminMessage: adminMessage,
        resources: reservation.resources.map(item => ({
          resourceId: item.resourceId._id,
          quantity: item.quantity
        }))
      };
  
      await updateReservationAdmin(reservation._id, updates);
  
      toast({
        title: 'Reservation approved.',
        description: 'The resident has been notified.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();

    } catch (err) {
      console.error('Error approving reservation:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error approving reservation request.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Function to handle DECLINING a reservation
  const handleDecline = async () => {
    event.preventDefault();
    try {

      if (!adminMessage) {
        toast({
          title: 'Admin Message Required',
          description: 'Please provide a decline reason why before declining.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await updateReservationAdmin(reservation._id, { status: 'Declined' });
      toast({
        title: 'Reservation request declined.',
        description: 'Reservation request declined successfully, notifying resident now.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose();

    } catch (err) {
      console.error('Error declining reservation:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error declining reservation request.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  };

  // Function to handle makring a reservation as IN-USE
  const handleInUse = async () => {
    event.preventDefault();
    try {

      await updateReservationAdmin(reservation._id, { 
        status: 'In-Use',
        initialRemarks: initialRemarks
       });

      toast({
        title: 'Reservation status updated.',
        description: 'Reservation status updated to In-Use.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose();

    } catch (err) {
      console.error('Error updating reservation:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error updating reservation status.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  };

  // Function to handle EDITING A RESERVATION in approved status
  const handleEditReservation = async () => {
    onEditOpen(); // Open the edit modal
  };

      // Handle quantity change
      const handleQuantityChange = (index, quantity) => {
        if (/^\d*$/.test(quantity)) {
          setEditedResources((prevResources) => {
            const newResources = [...prevResources];
            newResources[index].quantity = quantity;
            return newResources;
          });
        }
      };

      // Handle removing a resource
      const handleRemoveResource = (resourceId) => {
        setEditedResources((prevResources) =>
          prevResources.filter((item) => item.resourceId._id !== resourceId)
        );
      };

      // Handle adding a new resource
      const handleAddResource = (event) => {
        const resourceId = event.target.value;
        const resource = localListings.find((item) => item._id === resourceId);
      
        if (resource && !editedResources.some((item) => item.resourceId._id === resourceId)) {
          const defaultQuantity = resource.type === 'facility' ? 1 : 1; // Ensure quantity is set to 1 for facilities
          setEditedResources((prevResources) => [
            ...prevResources,
            { resourceId: resource, quantity: defaultQuantity, originalQuantity: resource.type === 'facility' ? 1 : 0 },
          ]);
        }
      };

  // Function to handle UPDATING A RESERVATION
  const handleUpdateReservation = async (event) => {
    event.preventDefault();
  
    // Validate all fields before proceeding
    let hasErrors = false;
  
    // Validate purpose
    if (!editedPurpose.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Reservation purpose cannot be empty.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      hasErrors = true;
    }
  
    // Validate dates
    if (!editedStartDate || !editedEndDate) {
      toast({
        title: 'Invalid Input',
        description: 'Start and End dates must be provided.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      hasErrors = true;
    } else if (new Date(editedStartDate) > new Date(editedEndDate)) {
      toast({
        title: 'Invalid Dates',
        description: 'Start date cannot be later than the end date.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      hasErrors = true;
    } 
  
    // Validate resources
    const invalidResources = editedResources.filter(
      (item) => item.quantity <= 0 || !item.quantity
    );
  
    if (invalidResources.length > 0) {
      toast({
        title: 'Invalid Resource Quantity',
        description: 'Each resource/s must have a valid quantity greater than 0.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      hasErrors = true;
    }
  
    // Stop the operation if there are validation errors
    if (hasErrors) return;
  
    try {
      // Prepare updated data for submission
      const updatedData = {
        purpose: editedPurpose,
        startDate: editedStartDate,
        endDate: editedEndDate,
        resources: editedResources.map((item) => ({
          resourceId: item.resourceId._id || item.resourceId,
          quantity: item.quantity,
        })),
        status: editedStatus,
      };

      if (editedStatus === 'Pending') {
        updatedData.appointmentDate = null;
      };
  
      // Perform the update operation
      await updateReservationAdmin(reservation._id, updatedData);
  
      // Show success message
      toast({
        title: 'Reservation Updated',
        description: 'The reservation details have been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      onEditClose(); // Close the modal
  
    } catch (err) {
      console.error('Error updating reservation:', err);
  
      // Show error message
      toast({
        title: 'Error',
        description: 'An error occurred while updating the reservation.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

      // Handle canceling the edit button
      const handleEditCancel = () => {
        onEditClose(); // Close the edit modal
      };

  // Function to handle setting back to pending status from declined status
  const handlePending = async () => {
    event.preventDefault();
    try {
      await updateReservationAdmin(reservation._id, { status: 'Pending' });
      toast({
        title: 'Reservation status updated.',
        description: 'Reservation status updated back to Pending.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose();

    } catch (err) {
      console.error('Error updating reservation:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error updating reservation status.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  };

  // Function to handle MARKING A RESERVATION AS RETURNED
  const handleReturned = async () => {
    event.preventDefault();
    try {
      await updateReservationAdmin(reservation._id, { status: 'Returned' });
      toast({
        title: 'Reservation status updated.',
        description: 'Reservation status updated to Returned.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose();

    } catch (err) {
      console.error('Error updating reservation:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error updating reservation status.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  };

  return (
    <>
      <Box
        p={3}
        borderWidth={1}
        borderRadius="md"
        boxShadow="sm"
        w="full"
        bg="white"
        _hover={{ boxShadow: 'md' }}
        transition="all 0.2s"
        bgColor={getStatusColor(reservation.status)}
      >
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={4} // Adjust for spacing when wrapping
        >
          {/* Reservation ID */}
          <HStack spacing={2} pr={2} align="center">
            <Icon as={FaClipboardList} color="blue.500" boxSize={4} />
            <Text fontWeight="bold" fontSize="sm" color="blue.600">
              ID: {reservation._id}
            </Text>
          </HStack>

          {/*Resident Name, Address, Phone, and Purpose */}

          <Flex flex="1" justify="center" align="center" gap={6}>
            {/* Resident Name */}
            <HStack spacing={2} align="center">
              <Icon as={FaUser} color="gray.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600" isTruncated>
                {reservation.resident.firstname} {reservation.resident.lastname}
              </Text>
              </HStack>
              
            {/* Resident Address */}
            <HStack spacing={2} align="center">
              <Icon as={FaMapMarkerAlt} color="gray.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600" isTruncated>
                B{reservation.resident.blknum} L{reservation.resident.lotnum}, {reservation.resident.sitio}
              </Text>
            </HStack>

            {/* Resident Phone Number */}
            <HStack spacing={2} align="center">
              <Icon as={FaPhone} color="gray.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600" isTruncated>
                {reservation.resident.phone}
              </Text>
            </HStack>

            {/* Resident Classification */}
            <HStack spacing={2} align="center">
              <Icon as={FaIdBadge} color="gray.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600" isTruncated>
                {reservation.resident.classification}
              </Text>
            </HStack>

            {/* Purpose */}
            <Text
              color="gray.700"
              fontSize="sm"
              noOfLines={1}
              textAlign="center"
            >
              <strong>Purpose:</strong> {reservation.purpose}
            </Text>
          </Flex>

          {/* View Details Button */}
          <Button
            size="sm"
            colorScheme="blue"
            onClick={onOpen}
            variant="outline"
          >
            View Details
          </Button>
        </Flex>
      </Box>

      {/* Modal popup for pending reservation requests */}
      {reservation.status === 'Pending' && (
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside" closeOnOverlayClick={false}>
        <ModalOverlay/>
        <ModalContent h="95vh" maxH="100vh" borderRadius="lg">
          <ModalHeader
            fontWeight="bold"
            fontSize="xl"
            color="white"
            bg="blue.600"
            px={6}
            py={4}
            borderTopRadius={'lg'}
          >
            Reservation Request Details
          </ModalHeader>
          <ModalBody p={6}>
            <VStack align="start" spacing={4} w="full">
              {/* Resident and Resources */}
              <HStack align="start" spacing={6} w="full">
                {/* Resident Details */}
                <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Resident Info
                  </Text>
                  <VStack align="start" spacing={3} w="full">
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Name:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        {reservation.resident.firstname} {reservation.resident.middlename} {reservation.resident.lastname} {reservation.resident.suffix}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Phone:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        {reservation.resident.phone}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Address:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        B{reservation.resident.blknum} L{reservation.resident.lotnum}, Sitio {reservation.resident.sitio}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Resources */}
                <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Resource/s
                  </Text>
                  <VStack align="start" spacing={3} w="full">
                    {reservation.resources.map((item) => (
                      <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                        <Text color="gray.700" fontSize="md">
                          {item.resourceId.name}
                          {item.resourceId.type === 'facility' && item.resourceId.address && (
                            <> - {item.resourceId.address}</>
                          )}
                        </Text>
                        {item.resourceId.type !== 'facility' && (
                          <Text color="blue.600" fontWeight="bold" fontSize="sm">
                            x {item.quantity}
                          </Text>
                        )}
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </HStack>

              {/* Current Resource Inventory */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Current Resource/s Inventory
                </Text>
                <VStack align="start" spacing={3} w="full">
                  {reservation.resources.map((item) => (
                    <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">{item.resourceId.name}</Text>
                      {item.resourceId.type !== 'facility' ? (
                        <Text color="red.500" fontWeight="bold">Available: {item.resourceId.inventory}</Text>
                      ) : (
                        <Text color={item.resourceId.inventory === 0 ? 'red.500' : 'green.500'} fontWeight="bold">
                          {item.resourceId.inventory === 0 ? 'Not Available' : 'Available'}
                        </Text>
                      )}
                    </HStack>
                  ))}
                </VStack>
              </Box>

  	        {/* Requested On */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Requested On
              </Text>
              <Text
                color="gray.700"
                fontSize="md"
                bg="gray.100"
                p={3}
                borderRadius="md"
                fontWeight="bold"
              >
                {new Date(reservation.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </Text>
            </Box>

              {/* Purpose and Appointment Date */}
              <VStack spacing={4} w="full" align="stretch">
                {/* Purpose */}
                <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Purpose
                  </Text>
                  <Text
                    color="gray.700"
                    fontSize="md"
                    bg="gray.100"
                    p={3}
                    borderRadius="md"
                    fontWeight="bold"
                  >
                    {reservation.purpose}
                  </Text>
                </Box>

                  {/* Appointment Date and Time */}
                  <Box
                    p={4}
                    bg="gray.50"
                    w="full"
                    borderRadius="md"
                    borderWidth="1px"
                  >
                    <FormControl isRequired w="full">
                      <FormLabel
                        fontWeight="bold"
                        color="gray.600"
                        fontSize="lg"
                        mb={2}
                      >
                        Set Appointment Date and Time
                      </FormLabel>
                      <DatePickerWrapper>
                      <DatePicker
                        selected={appointmentDate}
                        onChange={(date) => {
                          setAppointmentDate(date);
                          setSelectedDate(date);
                          console.log('Date selected:', date);
                        }}
                        showTimeSelect
                        showTimeSelectOnly={false}
                        minTime={minTime}
                        maxTime={maxTime}
                        timeIntervals={30}
                        excludeTimes={excludeTimes}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        placeholderText="Select appointment date and time"
                        customInput={<CustomInput />}
                        minDate={new Date()} // Prevent selecting past dates

                        // Add this prop to render the picker in a portal
                        popperContainer={CalendarContainer}
                        popperPlacement="bottom"
                        popperModifiers={[
                          {
                            name: 'offset',
                            options: {
                              offset: [0, 10],
                            },
                          },
                        ]}
                      />
                      </DatePickerWrapper>
                    </FormControl>
                  </Box>

              </VStack>


              {/* Dates */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Date/s Needed
                </Text>
                <HStack w='full' spacing={4}>
                  <VStack align="start" w='50%'>
                    <Text  color="gray.600" fontSize="md">
                      Start Date:
                    </Text>
                    <Text color="blue.600" fontSize="md" fontWeight="bold">
                      {new Date(reservation.startDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <VStack align="start" w='50%'>
                    <Text  color="gray.600" fontSize="md">
                      End Date:
                    </Text>
                    <Text color="blue.600" fontSize="md" fontWeight="bold">
                      {new Date(reservation.endDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Admin Message */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Add. Message
                </Text>
                <Textarea
                  placeholder='Enter additional message here...'
                  value={adminMessage} // Controlled state for the remark
                  onChange={(e) => setAdminMessage(e.target.value)} // Handle change
                  bg="gray.100"
                  color="gray.700"
                  borderRadius="md"
                  fontSize="md"
                  p={3}
                />
              </Box>

              {/* Status */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Status
                </Text>
                <Text
                  color={
                    reservation.status === 'Pending'
                      ? 'yellow.600'
                      : reservation.status === 'Approved'
                      ? 'green.600'
                      : 'red.600'
                  }
                  fontWeight="bold"
                  fontSize="md"
                  bg={
                    reservation.status === 'Pending'
                      ? 'yellow.100'
                      : reservation.status === 'Approved'
                      ? 'green.100'
                      : 'red.100'
                  }
                  p={3}
                  borderRadius="md"
                >
                  {reservation.status}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="space-between" p={6}>
            {/* Action Buttons */}
            <HStack spacing={3}>
              <Button
                colorScheme="green"
                _hover={{ bg: 'green.600' }} 
                bg="green.500"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                colorScheme="red"
                _hover={{ bg: 'red.600' }} 
                bg="red.500"
                onClick={handleDecline}
              >
                Decline
              </Button>
            </HStack>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )}

      {/* Modal popup for approved reservation requests */}
      {reservation.status === 'Approved' && (
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside" closeOnOverlayClick={false}> 
        <ModalOverlay/>
        <ModalContent h="95vh" maxH="100vh" borderRadius="lg" >
          <ModalHeader
            fontWeight="bold"
            fontSize="xl"
            color="white"
            bg="blue.600"
            px={6}
            py={4}
            borderTopRadius={'lg'}
          >
            Reservation Details
          </ModalHeader>
          <ModalBody p={6} overflowY="auto">
            <VStack align="start" spacing={4} w="full">
              {/* Resident and Resources */}
              <HStack align="start" spacing={6} w="full">
                {/* Resident Details */}
                <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Resident Info
                  </Text>
                  <VStack align="start" spacing={3} w="full">
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Name:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        {reservation.resident.firstname} {reservation.resident.middlename} {reservation.resident.lastname} {reservation.resident.suffix}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Phone:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        {reservation.resident.phone}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Address:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        B{reservation.resident.blknum} L{reservation.resident.lotnum}, Sitio {reservation.resident.sitio}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Resources */}
                <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Resource/s
                  </Text>
                  <VStack align="start" spacing={3} w="full">
                    {reservation.resources.map((item) => (
                      <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                        <Text color="gray.700" fontSize="md">
                          {item.resourceId.name}
                          {item.resourceId.type === 'facility' && item.resourceId.address && (
                            <> - {item.resourceId.address}</>
                          )}
                        </Text>
                        {item.resourceId.type !== 'facility' && (
                          <Text color="blue.600" fontWeight="bold" fontSize="sm">
                            x {item.quantity}
                          </Text>
                        )}
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </HStack>

              {/* Purpose and Appointment Date */}
              <VStack spacing={4} w="full" align="stretch">
                {/* Purpose */}
                <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Purpose
                  </Text>
                  <Text
                    color="gray.700"
                    fontSize="md"
                    bg="gray.100"
                    p={3}
                    borderRadius="md"
                    fontWeight="bold"
                  >
                    {reservation.purpose}
                  </Text>
                </Box>

                {/* Appointment Date and Time */}
                <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Appointment Details
                  </Text>
                  <Text
                    color="gray.700"
                    fontSize="md"
                    bg="gray.100"
                    p={3}
                    borderRadius="md"
                    fontWeight="bold"
                  >
                    {new Date(reservation.appointmentDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })} at{' '}
                    {new Date(reservation.appointmentDate).toLocaleTimeString('en-US', {
                        timeZone: 'Asia/Manila', // UTC+8
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                  </Text>
                </Box>
              </VStack>


              {/* Dates */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Date/s Needed
                </Text>
                <HStack w='full' spacing={4}>
                  <VStack align="start" w='50%'>
                    <Text  color="gray.600" fontSize="md">
                      Start Date:
                    </Text>
                    <Text color="blue.600" fontSize="md" fontWeight="bold">
                      {new Date(reservation.startDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <VStack align="start" w='50%'>
                    <Text  color="gray.600" fontSize="md">
                      End Date:
                    </Text>
                    <Text color="blue.600" fontSize="md" fontWeight="bold">
                      {new Date(reservation.endDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Admin Message */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Admin Message
                </Text>
                <Text color="gray.700" fontSize="md" bg="gray.100" p={3} borderRadius="md">
                  {reservation.adminMessage}
                </Text>
              </Box> 

              {/* Initial Remarks */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Initial Remarks
                </Text>
                <Textarea
                  placeholder='Enter initial remarks here...'
                  value={initialRemarks} // Controlled state for the remark
                  onChange={(e) => setInitialRemarks(e.target.value)} // Handle change
                  bg="gray.100"
                  color="gray.700"
                  borderRadius="md"
                  fontSize="md"
                  p={3}
                />
              </Box>
 

              {/* Status */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Status
                </Text>
                <Text
                  color={
                    reservation.status === 'Pending'
                      ? 'yellow.600'
                      : reservation.status === 'Approved'
                      ? 'green.600'
                      : 'red.600'
                  }
                  fontWeight="bold"
                  fontSize="md"
                  bg={
                    reservation.status === 'Pending'
                      ? 'yellow.100'
                      : reservation.status === 'Approved'
                      ? 'green.100'
                      : 'red.100'
                  }
                  p={3}
                  borderRadius="md"
                >
                  {reservation.status}
                </Text>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="space-between" p={6}>
            {/* Action Buttons */}
            <HStack spacing={3}>
              <Button
                colorScheme="green"
                _hover={{ bg: 'green.600' }} 
                bg="green.500"
                onClick={handleInUse}
              >
                Provide Resource/s
              </Button>
              <Button
                colorScheme="red"
                _hover={{ bg: 'yellow.600' }} 
                bg="yellow.500"
                onClick={handleEditReservation}
              >
                Edit Reservation
              </Button>
            </HStack>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
        
      </Modal>
      )}
      
      {/* Edit Reservation Modal */}
      <Modal isOpen={isEditOpen} onClose={handleEditCancel} size="xl" isCentered closeOnOverlayClick={false} scrollBehavior="inside">
          <ModalOverlay/>
          <ModalContent h="90vh" maxH="100vh" borderRadius="lg">
            <ModalHeader
              fontWeight="bold"
              fontSize="xl"
              color="white"
              bg="blue.600"
              px={6}
              py={4}
              borderTopRadius="lg"
            >
              Edit Reservation
            </ModalHeader>

            <ModalBody 
              overflowY="auto"
              px={6} 
              py={4}
            >
              <VStack spacing={5} align="stretch">

                {/* Current Resource Inventory */}
                <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Current Resource/s Inventory
                  </Text>
                  <VStack align="start" spacing={3} w="full">
                    {reservation.resources.map((item) => (
                      <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                        <Text color="gray.700" fontSize="md">{item.resourceId.name}</Text>
                        {item.resourceId.type !== 'facility' ? (
                          <Text color="red.500" fontWeight="bold">Available: {item.resourceId.inventory}</Text>
                        ) : (
                          <Text color={item.isTaken ? 'red.500' : 'green.500'} fontWeight="bold">
                            {item.isTaken ? 'Not Available' : 'Available'}
                          </Text>
                        )}
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Editable Resources List */}
                <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                  <FormControl>
                    <FormLabel fontWeight="bold" color="gray.600" fontSize="lg">
                      Resource/s
                    </FormLabel>
                    <VStack align="stretch" spacing={4}>
                      {editedResources.map((item, index) => (
                        <HStack key={item.resourceId._id} spacing={4}>
                          <Text flex="1" fontWeight="medium" color="gray.700">
                            {item.resourceId.name}
                            {item.resourceId.type === 'facility' && item.resourceId.address && (
                              <> - {item.resourceId.address}</>
                            )}
                          </Text>
                          {item.resourceId.type !== 'facility' && (
                            <Input
                              type="number"
                              min={1}
                              max={item.resourceId.inventory + item.quantity} // Account for original quantity
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(index, e.target.value)}
                              width="100px"
                            />
                          )}
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleRemoveResource(item.resourceId._id)}
                          >
                            Remove
                          </Button>
                        </HStack>
                      ))}
                    </VStack>
                  </FormControl>
                </Box>

                {/* Add New Resource */}
                <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                  <FormControl>
                    <FormLabel fontWeight="bold" color="gray.600" fontSize="lg">
                      Add Resource
                    </FormLabel>
                    <Select placeholder="Select a resource" onChange={handleAddResource}>
                      {localListings.map((resource) => (
                        <option key={resource._id} value={resource._id}>
                          {resource.name}
                          {resource.type === 'facility' 
                      ? ` - ${resource.address}` 
                      : resource.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Purpose */}
                <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                  <FormControl>
                    <FormLabel fontWeight="bold" color="gray.600" fontSize="lg">
                      Purpose
                    </FormLabel>
                    <Textarea
                      value={editedPurpose}
                      onChange={(e) => setEditedPurpose(e.target.value)}
                      bg="white"
                      borderRadius="md"
                    />
                  </FormControl>
                </Box>

                {/* Start and End Date */}
                <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                  <FormControl>
                    <FormLabel fontWeight="bold" color="gray.600" fontSize="lg">
                      Date/s Needed
                    </FormLabel>
                    <HStack spacing={6}>
                      <Box flex="1">
                        <FormControl>
                          <FormLabel fontWeight="medium" color="gray.600">
                            Start Date
                          </FormLabel>
                          <Input
                            type="date"
                            value={editedStartDate.substring(0, 10)}
                            onChange={(e) => setEditedStartDate(e.target.value)}
                            bg="white"
                            borderRadius="md"
                          />
                        </FormControl>
                      </Box>
                      <Box flex="1">
                        <FormControl>
                          <FormLabel fontWeight="medium" color="gray.600">
                            End Date
                          </FormLabel>
                          <Input
                            type="date"
                            value={editedEndDate.substring(0, 10)}
                            onChange={(e) => setEditedEndDate(e.target.value)}
                            bg="white"
                            borderRadius="md"
                          />
                        </FormControl>
                      </Box>
                    </HStack>
                  </FormControl>
                </Box>

                {/* Reservation Status */}
                <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                <FormControl>
                  <FormLabel fontWeight="bold" color="gray.600" fontSize="lg">
                    Reservation Status
                  </FormLabel>
                  <Select
                    placeholder="Change Status"
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    bg="white"
                    borderRadius="md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </Select>
                </FormControl>
              </Box>

              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleUpdateReservation}
              type="button"
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleEditCancel}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
      </Modal>

      {/* Modal popup for declined reservation requests */}    
      {reservation.status === 'Declined' && (            
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside" closeOnOverlayClick={false}>
        <ModalOverlay/>
        <ModalContent h="95vh" maxH="100vh" borderRadius="lg">
          <ModalHeader
            fontWeight="bold"
            fontSize="xl"
            color="white"
            bg="blue.600"
            px={6}
            py={4}
            borderTopRadius={'lg'}
          >
            Reservation Request Details
          </ModalHeader>
          <ModalBody p={6}>
            <VStack align="start" spacing={4} w="full">
              {/* Resident and Resources */}
              <HStack align="start" spacing={6} w="full">
                {/* Resident Details */}
                <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Resident Info
                  </Text>
                  <VStack align="start" spacing={3} w="full">
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Name:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        {reservation.resident.firstname} {reservation.resident.middlename} {reservation.resident.lastname} {reservation.resident.suffix}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Phone:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        {reservation.resident.phone}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">Address:</Text>
                      <Text color="blue.600" fontWeight="bold">
                        B{reservation.resident.blknum} L{reservation.resident.lotnum}, Sitio {reservation.resident.sitio}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Resources */}
                <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Resource/s
                  </Text>
                  <VStack align="start" spacing={3} w="full">
                    {reservation.resources.map((item) => (
                      <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                        <Text color="gray.700" fontSize="md">
                          {item.resourceId.name}
                          {item.resourceId.type === 'facility' && item.resourceId.address && (
                            <> - {item.resourceId.address}</>
                          )}
                        </Text>
                        {item.resourceId.type !== 'facility' && (
                          <Text color="blue.600" fontWeight="bold" fontSize="sm">
                            x {item.quantity}
                          </Text>
                        )}
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </HStack>

              {/* Current Resource Inventory */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Current Resource/s Inventory
                </Text>
                <VStack align="start" spacing={3} w="full">
                  {reservation.resources.map((item) => (
                    <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">{item.resourceId.name}</Text>
                      {item.resourceId.type !== 'facility' ? (
                        <Text color="red.500" fontWeight="bold">Available: {item.resourceId.inventory}</Text>
                      ) : (
                        <Text color={item.isTaken ? 'red.500' : 'green.500'} fontWeight="bold">
                          {item.isTaken ? 'Not Available' : 'Available'}
                        </Text>
                      )}
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Purpose and Appointment Date */}
              <HStack spacing={4} w="full" align="stretch">
                {/* Purpose */}
                <Box p={4} bg="gray.50" w="100%" borderRadius="md" borderWidth='1px'>
                  <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                    Purpose
                  </Text>
                  <Text
                    color="gray.700"
                    fontSize="md"
                    bg="gray.100"
                    p={3}
                    borderRadius="md"
                    fontWeight="bold"
                  >
                    {reservation.purpose}
                  </Text>
                </Box>
              </HStack>

              {/* Dates */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Date/s Needed
                </Text>
                <HStack w='full' spacing={4}>
                  <VStack align="start" w='50%'>
                    <Text  color="gray.600" fontSize="md">
                      Start Date:
                    </Text>
                    <Text color="blue.600" fontSize="md" fontWeight="bold">
                      {new Date(reservation.startDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <VStack align="start" w='50%'>
                    <Text  color="gray.600" fontSize="md">
                      End Date:
                    </Text>
                    <Text color="blue.600" fontSize="md" fontWeight="bold">
                      {new Date(reservation.endDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Status */}
              <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth='1px'>
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Status
                </Text>
                <Text
                  color={
                    reservation.status === 'Pending'
                      ? 'yellow.600'
                      : reservation.status === 'Approved'
                      ? 'green.600'
                      : 'red.600'
                  }
                  fontWeight="bold"
                  fontSize="md"
                  bg={
                    reservation.status === 'Pending'
                      ? 'yellow.100'
                      : reservation.status === 'Approved'
                      ? 'green.100'
                      : 'red.100'
                  }
                  p={3}
                  borderRadius="md"
                >
                  {reservation.status}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="space-between" p={6}>
            {/* Action Buttons */}
            <HStack spacing={3}>
              <Button
                colorScheme="green"
                _hover={{ bg: 'yellow.600' }} 
                bg="yellow.500"
                onClick={handlePending}
              >
                Set Back to Pending
              </Button>
            </HStack>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )} 

      {/* Modal popup for In-Use reservation requests */}
      {reservation.status === 'In-Use' && (
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent h="95vh" maxH="100vh" borderRadius="lg">
        <ModalHeader
          fontWeight="bold"
          fontSize="xl"
          color="white"
          bg="blue.600"
          px={6}
          py={4}
          borderTopRadius="lg"
        >
          In-Use Reservation Details
        </ModalHeader>
        <ModalBody p={6}>
          <VStack align="start" spacing={4} w="full">
            {/* Resident and Resources */}
            <HStack align="start" spacing={6} w="full">
              {/* Resident Details */}
              <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth="1px">
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Resident Info
                </Text>
                <VStack align="start" spacing={3} w="full">
                  <HStack justifyContent="space-between" w="full">
                    <Text color="gray.700" fontSize="md">Name:</Text>
                    <Text color="blue.600" fontWeight="bold">
                      {reservation.resident.firstname} {reservation.resident.middlename} {reservation.resident.lastname} {reservation.resident.suffix}
                    </Text>
                  </HStack>
                  <HStack justifyContent="space-between" w="full">
                    <Text color="gray.700" fontSize="md">Phone:</Text>
                    <Text color="blue.600" fontWeight="bold">
                      {reservation.resident.phone}
                    </Text>
                  </HStack>
                  <HStack justifyContent="space-between" w="full">
                    <Text color="gray.700" fontSize="md">Address:</Text>
                    <Text color="blue.600" fontWeight="bold">
                      B{reservation.resident.blknum} L{reservation.resident.lotnum}, Sitio {reservation.resident.sitio}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
    
              {/* Resources */}
              <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth="1px">
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Resource/s
                </Text>
                <VStack align="start" spacing={3} w="full">
                  {reservation.resources.map((item) => (
                    <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">{item.resourceId.name}</Text>
                      <Text color="blue.600" fontWeight="bold">x {item.quantity}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </HStack>
    
            {/* Current Resource Inventory */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Current Resource/s Inventory
                </Text>
                <VStack align="start" spacing={3} w="full">
                  {reservation.resources.map((item) => (
                    <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">{item.resourceId.name}</Text>
                      {item.resourceId.type !== 'facility' ? (
                        <Text color="red.500" fontWeight="bold">Available: {item.resourceId.inventory}</Text>
                      ) : (
                        <Text color={item.resourceId.inventory === 0 ? 'red.500' : 'green.500'} fontWeight="bold">
                          {item.resourceId.inventory === 0 ? 'Not Available' : 'Available'}
                        </Text>
                      )}
                    </HStack>
                  ))}
                </VStack>
              </Box>
    
            {/* Purpose */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Purpose
              </Text>
              <Text
                color="gray.700"
                fontSize="md"
                bg="gray.100"
                p={3}
                borderRadius="md"
                fontWeight="bold"
              >
                {reservation.purpose}
              </Text>
            </Box>
    
            {/* Dates */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Date/s Needed
              </Text>
              <HStack w="full" spacing={4}>
                <VStack align="start" w="50%">
                  <Text color="gray.600" fontSize="md">
                    Start Date:
                  </Text>
                  <Text color="blue.600" fontSize="md" fontWeight="bold">
                    {new Date(reservation.startDate).toLocaleDateString()}
                  </Text>
                </VStack>
                <VStack align="start" w="50%">
                  <Text color="gray.600" fontSize="md">
                    End Date:
                  </Text>
                  <Text color="blue.600" fontSize="md" fontWeight="bold">
                    {new Date(reservation.endDate).toLocaleDateString()}
                  </Text>
                </VStack>
              </HStack>
            </Box>
    
            {/* Admin Message */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Initial Remarks
              </Text>
              <Text
                color="gray.700"
                fontSize="md"
                bg="gray.100"
                p={3}
                borderRadius="md"
                fontWeight="bold"
              >
                {reservation.initialRemarks}
              </Text>
            </Box>

            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Returned Remarks
              </Text>
              <Textarea
                placeholder='Enter returned remarks here...'
                color="gray.700"
                fontSize="md"
                bg="gray.100"
                p={3}
                borderRadius="md"
                value={reservation.returnedRemarks}
              />
            </Box>
    
            {/* Status */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Status
              </Text>
              <Text
                color={
                  reservation.status === 'In-Use'
                    ? 'orange.600'
                    : reservation.status === 'Completed'
                    ? 'green.600'
                    : 'red.600'
                }
                fontWeight="bold"
                fontSize="md"
                bg={
                  reservation.status === 'In-Use'
                    ? 'orange.100'
                    : reservation.status === 'Completed'
                    ? 'green.100'
                    : 'red.100'
                }
                p={3}
                borderRadius="md"
              >
                {reservation.status}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="space-between" p={6}>
          <Button colorScheme='green' onClick={handleReturned}>
            Mark as Returned
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>
      )}

      {/* Modal popup for Returned reservation requests */}
      {reservation.status === 'Returned' && (
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent h="95vh" maxH="100vh" borderRadius="lg">
        <ModalHeader
          fontWeight="bold"
          fontSize="xl"
          color="white"
          bg="blue.600"
          px={6}
          py={4}
          borderTopRadius="lg"
        >
          In-Use Reservation Details
        </ModalHeader>
        <ModalBody p={6}>
          <VStack align="start" spacing={4} w="full">
            {/* Resident and Resources */}
            <HStack align="start" spacing={6} w="full">
              {/* Resident Details */}
              <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth="1px">
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Resident Info
                </Text>
                <VStack align="start" spacing={3} w="full">
                  <HStack justifyContent="space-between" w="full">
                    <Text color="gray.700" fontSize="md">Name:</Text>
                    <Text color="blue.600" fontWeight="bold">
                      {reservation.resident.firstname} {reservation.resident.middlename} {reservation.resident.lastname} {reservation.resident.suffix}
                    </Text>
                  </HStack>
                  <HStack justifyContent="space-between" w="full">
                    <Text color="gray.700" fontSize="md">Phone:</Text>
                    <Text color="blue.600" fontWeight="bold">
                      {reservation.resident.phone}
                    </Text>
                  </HStack>
                  <HStack justifyContent="space-between" w="full">
                    <Text color="gray.700" fontSize="md">Address:</Text>
                    <Text color="blue.600" fontWeight="bold">
                      B{reservation.resident.blknum} L{reservation.resident.lotnum}, Sitio {reservation.resident.sitio}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
    
              {/* Resources */}
              <Box p={4} bg="gray.50" w="50%" borderRadius="md" borderWidth="1px">
                <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                  Resource/s
                </Text>
                <VStack align="start" spacing={3} w="full">
                  {reservation.resources.map((item) => (
                    <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                      <Text color="gray.700" fontSize="md">{item.resourceId.name}</Text>
                      <Text color="blue.600" fontWeight="bold">x {item.quantity}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </HStack>
    
            {/* Current Resource Inventory */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Current Resource/s Inventory
              </Text>
              <VStack align="start" spacing={3} w="full">
                {reservation.resources.map((item) => (
                  <HStack key={item.resourceId._id} justifyContent="space-between" w="full">
                    <Text color="gray.700" fontSize="md">{item.resourceId.name}</Text>
                    <Text color="red.500" fontWeight="bold">Available: {item.resourceId.inventory}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Requested On */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Requested On
              </Text>
              <Text
                color="gray.700"
                fontSize="md"
                bg="gray.100"
                p={3}
                borderRadius="md"
                fontWeight="bold"
              >
                {new Date(reservation.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </Text>
            </Box>
    
            {/* Purpose */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Purpose
              </Text>
              <Text
                color="gray.700"
                fontSize="md"
                bg="gray.100"
                p={3}
                borderRadius="md"
                fontWeight="bold"
              >
                {reservation.purpose}
              </Text>
            </Box>
    
            {/* Dates */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Date/s Needed
              </Text>
              <HStack w="full" spacing={4}>
                <VStack align="start" w="50%">
                  <Text color="gray.600" fontSize="md">
                    Start Date:
                  </Text>
                  <Text color="blue.600" fontSize="md" fontWeight="bold">
                    {new Date(reservation.startDate).toLocaleDateString()}
                  </Text>
                </VStack>
                <VStack align="start" w="50%">
                  <Text color="gray.600" fontSize="md">
                    End Date:
                  </Text>
                  <Text color="blue.600" fontSize="md" fontWeight="bold">
                    {new Date(reservation.endDate).toLocaleDateString()}
                  </Text>
                </VStack>
              </HStack>
            </Box>
    
            {/* Admin Message */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Initial Remarks
              </Text>
              <Text
                color="gray.700"
                fontSize="md"
                bg="gray.100"
                p={3}
                borderRadius="md"
                fontWeight="bold"
              >
                {reservation.initialRemarks}
              </Text>
            </Box>

            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Returned Remarks
              </Text>
              <Text
                color="gray.700"
                fontSize="md"
                bg="gray.100"
                p={3}
                borderRadius="md"
                fontWeight="bold"
              >
                {reservation.returnedRemarks}
              </Text>
            </Box>

            
    
            {/* Status */}
            <Box p={4} bg="gray.50" w="full" borderRadius="md" borderWidth="1px">
              <Text fontWeight="bold" color="gray.600" fontSize="lg" mb={2}>
                Status
              </Text>
              <Text
                color={
                  reservation.status === 'In-Use'
                    ? 'orange.600'
                    : reservation.status === 'Completed'
                    ? 'green.600'
                    : 'red.600'
                }
                fontWeight="bold"
                fontSize="md"
                bg={
                  reservation.status === 'In-Use'
                    ? 'orange.100'
                    : reservation.status === 'Completed'
                    ? 'green.100'
                    : 'red.100'
                }
                p={3}
                borderRadius="md"
              >
                {reservation.status}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter p={6}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>
      )}

    </>
    );
  }
));

export default ReservationCardAdmin;