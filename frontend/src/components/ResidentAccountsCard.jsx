import React from 'react';
import { useState } from 'react';
import { Box, Text, Button, VStack, HStack, Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Image, Select, useToast, Textarea, Alert, AlertIcon,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';


import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { UseResidentStore } from '../store/residents';

const ResidentAccountsCard = ({ resident }) => {
const { isOpen, onOpen, onClose } = useDisclosure();
const toast = useToast();

const { approveResident, fetchResidents, declineResident } = UseResidentStore();

const [classification, setClassification] = useState(resident?.classification || '');
const [declineReason, setDeclineReason] = useState('');
const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

const openDeclineModal = () => {
  setDeclineReason('');
  setIsDeclineModalOpen(true);
};

const closeDeclineModal = () => {
  setIsDeclineModalOpen(false);
};

// Handle classification change
const handleClassificationChange = (event) => {
  setClassification(event.target.value);
};


const handleApproveResident = async () => {
    try {
        if (!classification) {
            toast({
                title: 'Classification Empty',
                description: 'Please select a classification for the resident.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        await approveResident(resident._id, classification);
        fetchResidents();

        toast({
            title: 'Resident Approved.',
            description: 'Resident has been approved successfully. Notifying resident now.',
            status: 'success',
            duration: 5000,
        })
        onClose();
    } catch (error) {
        console.error('Error approving resident:', error);
        toast({
          title: 'Error',
          description: typeof error === 'string' ? error : 'Failed to approve resident.',
          status: 'error',
          duration: 5000,
          isClosable: true,
      });
    }
};

const handleDeclineResident = async () => {
  try {
    if (!declineReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for declining the account.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (declineReason.length > 80) {
      toast({
        title: 'Reason Too Long',
        description: 'Reason must be 60 characters or less.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    await declineResident(resident._id, declineReason);
    await fetchResidents();

    toast({
      title: 'Resident Declined.',
      description: 'Resident has been declined and notified.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    closeDeclineModal();
    onClose();
  } catch (error) {
    console.error('Error declining resident:', error);
    toast({
      title: 'Error',
      description: typeof error === 'string' ? error : 'Failed to decline resident.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
};

// Function to format base64 image
const formatBase64Image = (imageData) => {
    if (!imageData || !imageData.data) return '';
    return `data:${imageData.contentType};base64,${imageData.data}`;
};

// Function to calculate age
const calculateAge = (birthdate) => {
  const birthDate = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

  return (
    <>

    {/* Resident Card */}

    {/* If the resident is already approved show this */}
    {resident?.isApproved === true && (
      <Box
        w="full"
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        _hover={{ shadow: 'lg' }}
        transition="all 0.2s"
        display="flex"
        flexDirection="column"
      >
        <HStack spacing={4} align="center">
          {/* Avatar */}
          <Avatar
            name={`${resident?.firstname} ${resident?.lastname}`}
            size="lg"
            src={formatBase64Image(resident?.selfie)}
          />

          {/* Resident Info */}
          <VStack align="start" spacing={1} flex="1">
            <Text fontWeight="bold" fontSize="lg">
              {resident?.firstname} {resident?.middlename} {resident?.lastname} {resident?.suffix}
            </Text>
            <Text color="gray.600">
              Blk {resident?.blknum} Lot {resident?.lotnum}, Sitio {resident?.sitio}
            </Text>
            <Text color="gray.600">{resident?.phone}</Text>
          </VStack>

          {/* View Details Button */}
          <Button onClick={onOpen} colorScheme="blue">
            View Details
          </Button>
        </HStack>
      </Box>
    )}

    {/* If the resident is not approved show this */}
    {resident?.isApproved === false && (
      <Box
        p={5}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        w="full"
        maxW="100%"
                _hover={{ shadow: 'lg' }}
        transition="all 0.2s"
      >
        {/* Content for unapproved residents */}
        <HStack spacing={5} align="center">
          {/* Avatar */}
          <Avatar
            name={`${resident?.firstname} ${resident?.lastname}`}
            size="xl"
            src={formatBase64Image(resident?.selfie)}
          />
    
          {/* Resident Info */}
          <VStack align="start" spacing={1} flex="1">
            <Text fontWeight="bold" fontSize="lg">
              {resident?.firstname} {resident?.middlename} {resident?.lastname} {resident?.suffix}
            </Text>
            <Text color="gray.600">
              Blk {resident?.blknum} Lot {resident?.lotnum}, Sitio {resident?.sitio}
            </Text>
            <Text color="gray.600">{resident?.phone}</Text>
          </VStack>
    
          {/* View Details Button */}
          <Button onClick={onOpen} colorScheme="blue">
            View Details
          </Button>
        </HStack>
      </Box>
    )}
    

{/* -------------------------------------------------------------------------------- */}

      {/* Details Modal */}


      {/* If the resident is approved */}
      {resident?.isApproved === true && (
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered scrollBehavior='inside' trapFocus={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent h="95vh" maxH="100vh" borderRadius="lg">
        <ModalHeader 
        bg="blue.600" 
        color="white" 
        borderTopRadius="lg"
        >
          Resident Details
        </ModalHeader>
        <ModalBody pt={5}>
          <VStack spacing={4} align="stretch" w="full">
            {/* Valid ID Number */}
            <Box p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
              <Text fontWeight="bold" fontSize="lg" mb={2}>Valid ID Number:</Text>
              <Text color="gray.700">{resident?.validIdNumber}</Text>
            </Box>

            {/* Valid ID Images */}
            <Box p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
              <Text fontWeight="bold" fontSize="lg" mb={4}>Valid ID:</Text>
              <HStack spacing={4} w="full">
                {/* Valid ID Front */}
                <Box flex="1" textAlign="center">
                  <Text fontWeight="semibold" mb={2}>Front:</Text>
                  <Zoom>
                  <Image
                    src={formatBase64Image(resident?.validIDfront)}
                    alt="Valid ID Front"
                    w="full"
                    maxH="300px"
                    objectFit="contain"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                    fallbackSrc="https://via.placeholder.com/200?text=No+Image"
                  />
                  </Zoom>
                </Box>

                {/* Valid ID Back */}
                <Box flex="1" textAlign="center">
                  <Text fontWeight="semibold" mb={2}>Back:</Text>
                  <Zoom>
                  <Image
                    src={formatBase64Image(resident?.validIDback)}
                    alt="Valid ID Back"
                    w="full"
                    maxH="300px"
                    objectFit="contain"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                    fallbackSrc="https://via.placeholder.com/200?text=No+Image"
                  />
                  </Zoom>
                </Box>
              </HStack>
            </Box>

            {/* Selfie and Personal Details */}
            <HStack spacing={4} align="start" w="full">
              {/* Selfie */}
              <Box flex="1" p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
                <Text fontWeight="bold" fontSize="lg" mb={4}>Selfie:</Text>
                <Zoom>
                <Image
                  src={formatBase64Image(resident?.selfie)}
                  alt="Selfie"
                  w="full"
                  maxH="330px"
                  objectFit="contain"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.300"
                  fallbackSrc="https://via.placeholder.com/200?text=No+Image"
                />
                </Zoom>
              </Box>

              {/* Personal Details */}
              <Box flex="2" p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
                <Text fontWeight="bold" fontSize="lg" mb={4}>Personal Details:</Text>
                <VStack align="start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Full Name:</Text>
                    <Text color="gray.700">
                      {resident?.firstname} {resident?.middlename} {resident?.lastname} {resident?.suffix}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Birthdate:</Text>
                    <Text color="gray.700">
                      {resident?.birthdate ? new Date(resident.birthdate).toLocaleDateString( 'EN-US', {
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                        }) : 'N/A'}
                    </Text>
                  </HStack>

                  {/* Age */}
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Age:</Text>
                    <Text color="gray.700">
                      {resident?.birthdate ? `${calculateAge(resident.birthdate)} years old` : 'N/A'}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Sex:</Text>
                    <Text color="gray.700">
                      {resident?.gender === 'male' ? 'Male' :
                      resident?.gender === 'female' ? 'Female' :
                      resident?.gender || 'Not Specified'}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Address:</Text>
                    <Text color="gray.700">
                      Blk {resident?.blknum} Lot {resident?.lotnum}, Sitio {resident?.sitio}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Phone:</Text>
                    <Text color="gray.700">{resident?.phone}</Text>
                  </HStack>
                </VStack>

                {/* Classification Select Options */}
                <Box
                  mt={4}
                  p={4}
                  bg="gray.50"
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  w="full"
                >
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    Classification:
                  </Text>
                  <Box bg="white" border="2px solid" borderColor="gray.200" p={1.5} borderRadius="md">
                  <Text pl={2}>{resident.classification}</Text>
                  </Box>
                </Box>
              </Box>
            </HStack>


            {/* Account Status */}
            <Box p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
              <Text fontWeight="bold" fontSize="lg" mb={4}>Account Status:</Text>
              <VStack align="start" spacing={3}>
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold">Role:</Text>
                  <Text color="gray.700">
                  {resident?.role === 'resident' ? 'Resident' :
                  resident?.role === 'admin' ? 'Admin' :
                  resident?.role || 'Unknown'}
                </Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold">Account Status:</Text>
                  <Text color={resident?.isApproved ? "green.500" : "red.500"} fontWeight="bold">
                    {resident?.isApproved ? 'Approved' : 'Not Approved'}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold">Last Login:</Text>
                  <Text color="gray.700">
                    {resident?.lastLogin ? new Date(resident.lastLogin).toLocaleString() : 'Never'}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold">Account Created:</Text>
                  <Text color="gray.700">
                    {resident?.createdAt ? new Date(resident.createdAt).toLocaleString() : 'N/A'}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
            <Button onClick={onClose} colorScheme="blue">Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
      )}

      {/* If the resident is not approved */}
      {resident?.isApproved === false && (
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered scrollBehavior='inside' trapFocus={false} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent h="95vh" maxH="100vh" borderRadius="lg">
          <ModalHeader 
          bg="blue.600" 
          color="white" 
          borderTopRadius="lg"
          >
            Resident Details
          </ModalHeader>
          <ModalBody pt={5}>
            <VStack spacing={4} align="stretch" w="full">
              {/* Valid ID Number */}
              <Box p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
                <Text fontWeight="bold" fontSize="lg" mb={2}>Valid ID Number:</Text>
                <Text color="gray.700">{resident?.validIdNumber}</Text>
              </Box>

              {/* Valid ID Images */}
              <Box p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
                <Text fontWeight="bold" fontSize="lg" mb={4}>Valid ID:</Text>
                <HStack spacing={4} w="full">
                  {/* Valid ID Front */}
                  <Box flex="1" textAlign="center">
                    <Text fontWeight="semibold" mb={2}>Front:</Text>
                    <Zoom>
                    <Image
                      src={formatBase64Image(resident?.validIDfront)}
                      alt="Valid ID Front"
                      w="full"
                      maxH="300px"
                      objectFit="contain"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.300"
                      fallbackSrc="https://via.placeholder.com/200?text=No+Image"
                    />
                    </Zoom>
                  </Box>

                  {/* Valid ID Back */}
                  <Box flex="1" textAlign="center">
                    <Text fontWeight="semibold" mb={2}>Back:</Text>
                    <Zoom>
                    <Image
                      src={formatBase64Image(resident?.validIDback)}
                      alt="Valid ID Back"
                      w="full"
                      maxH="300px"
                      objectFit="contain"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.300"
                      fallbackSrc="https://via.placeholder.com/200?text=No+Image"
                    />
                    </Zoom>
                  </Box>
                </HStack>
              </Box>

              {/* Selfie and Personal Details */}
              <HStack spacing={4} align="start" w="full">
                {/* Selfie */}
                <Box flex="1" p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
                  <Text fontWeight="bold" fontSize="lg" mb={4}>Selfie:</Text>
                  <Zoom>
                  <Image
                    src={formatBase64Image(resident?.selfie)}
                    alt="Selfie"
                    w="full"
                    maxH="330px"
                    objectFit="contain"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                    fallbackSrc="https://via.placeholder.com/200?text=No+Image"
                  />
                  </Zoom>
                </Box>

                {/* Personal Details */}
                <Box flex="2" p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
                  <Text fontWeight="bold" fontSize="lg" mb={4}>Personal Details:</Text>
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">Full Name:</Text>
                      <Text color="gray.700">
                        {resident?.firstname} {resident?.middlename} {resident?.lastname} {resident?.suffix}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">Birthdate:</Text>
                      <Text color="gray.700">
                        {resident?.birthdate ? new Date(resident.birthdate).toLocaleDateString( 'EN-US', {
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                          }) : 'N/A'}
                      </Text>
                    </HStack>

                    {/* Age */}
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">Age:</Text>
                      <Text color="gray.700">
                        {resident?.birthdate ? `${calculateAge(resident.birthdate)} years old` : 'N/A'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">Sex:</Text>
                      <Text color="gray.700">
                        {resident?.gender === 'male' ? 'Male' :
                        resident?.gender === 'female' ? 'Female' :
                        resident?.gender || 'Not Specified'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">Address:</Text>
                      <Text color="gray.700">
                        Blk {resident?.blknum} Lot {resident?.lotnum}, Sitio {resident?.sitio}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">Phone:</Text>
                      <Text color="gray.700">{resident?.phone}</Text>
                    </HStack>
                  </VStack>

                  {/* Classification Select Options */}
                  <Box
                    mt={4}
                    p={4}
                    bg="gray.50"
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    w="full"
                  >
                    <Text fontWeight="bold" fontSize="lg" mb={2}>
                      Classification:
                    </Text>
                    <Select 
                    placeholder="Select Classification" 
                    bg="white"
                    value={classification}
                    onChange={handleClassificationChange}
                    >
                      <option value="Regular">Regular</option>
                      <option value="PWD">PWD</option>
                      <option value="Pregnant">Pregnant</option>
                      <option value="Elderly">Elderly</option>
                    </Select>
                  </Box>
                </Box>
              </HStack>


              {/* Account Status */}
              <Box p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md">
                <Text fontWeight="bold" fontSize="lg" mb={4}>Account Status:</Text>
                <VStack align="start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Role:</Text>
                    <Text color="gray.700">
                    {resident?.role === 'resident' ? 'Resident' :
                    resident?.role === 'admin' ? 'Admin' :
                    resident?.role || 'Unknown'}
                  </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Account Status:</Text>
                    <Text color={resident?.isApproved ? "green.500" : "red.500"} fontWeight="bold">
                      {resident?.isApproved ? 'Approved' : 'Not Approved'}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Last Login:</Text>
                    <Text color="gray.700">
                      {resident?.lastLogin ? new Date(resident.lastLogin).toLocaleString() : 'Never'}
                    </Text>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text fontWeight="bold">Account Created:</Text>
                    <Text color="gray.700">
                      {resident?.createdAt ? new Date(resident.createdAt).toLocaleString() : 'N/A'}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4} w="full" justify="space-between">
              <HStack spacing={4}>
                <Button 
                colorScheme="green"
                onClick={handleApproveResident}
                >
                  Approve Resident
                </Button>
                <Button 
                colorScheme="red"
                onClick={openDeclineModal}
                >
                  Decline
                </Button>
              </HStack>
              <Button onClick={onClose} colorScheme="blue">Close</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )}

      {/* Decline Reason Modal */}
      <Modal isOpen={isDeclineModalOpen} onClose={closeDeclineModal} size="md" isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent borderRadius="lg">
          <ModalHeader bg="red.600" color="white" borderTopRadius="lg">
            <HStack>
              <WarningIcon boxSize={5} />
              <Text>Decline Resident Account</Text>
            </HStack>
          </ModalHeader>
          <ModalBody py={6}>
            <VStack spacing={4} align="stretch">
              <Text>
                You are about to decline the account of{' '}
                <strong>
                  {resident?.firstname} {resident?.lastname}
                </strong>
                . Please provide a reason (max 80 characters):
              </Text>
              <Textarea
                placeholder="Enter decline reason..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                size="md"
                maxLength={80}
                resize="vertical"
              />
              <HStack justifyContent="space-between">
                <Text fontSize="sm" color="gray.500">
                  {declineReason.length}/80 characters
                </Text>
                {declineReason.length === 100 && (
                  <Text fontSize="sm" color="red.500">
                    Maximum character limit reached.
                  </Text>
                )}
              </HStack>
              <Alert status="warning" variant="left-accent">
                <AlertIcon />
                Account will be permanently deleted from the database. This action cannot be undone, and the resident will be notified via SMS.
                </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeDeclineModal}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeclineResident}
              isDisabled={!declineReason.trim()}
              ml={3}
            >
              Decline Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>




    </>
  );
};

export default ResidentAccountsCard;