import { Box, Heading, Image, Text, Badge, Divider, Spacer } from '@chakra-ui/react';
import React from 'react';

const ListingCard = ({ listing }) => {
  const isAvailable = listing.type === 'equipment' ? listing.inventory > 0 : true;
  const type = listing.type === 'equipment' ? 'Equipment' : 'Facility';

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
      maxW="sm"
      display="flex"
      flexDirection="column"
    >
      <Image
        src={`data:${listing.image.contentType};base64,${listing.image.data}`}
        alt={listing.name}
        h="250px"
        w="full"
        objectFit="cover"
      />
      <Box
        p={4}
        flex="1"
        display="flex"
        flexDirection="column"
        minH="160px"
      >
        <Heading as="h3" size="md" mb={2}>
          {listing.name}
        </Heading>

        <Text fontWeight="medium" fontSize="sm" color="gray.500" mb={2} noOfLines={2}>
          {listing.description}
        </Text>

        {listing.type === 'facility' && (
          <Text fontWeight="medium" fontSize="sm" color="black" mb={2}>
            Address: {listing.address}
          </Text>
        )}

        <Spacer />

        <Divider mb={3}/>

        <Box display="flex" gap="2">
          {isAvailable ? (
            <Badge colorScheme="green">Available</Badge>
          ) : (
            <Badge colorScheme="red">Not Available</Badge>
          )}
          <Badge colorScheme="blue">{type}</Badge>
        </Box>
      </Box>
    </Box>
  );
};

export default ListingCard;