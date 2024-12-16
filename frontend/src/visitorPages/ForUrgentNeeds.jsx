import { 
  Container,
  Text,
  VStack,
  HStack,
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  SimpleGrid,
} from '@chakra-ui/react';

const resources = [
  {
    title: "Ambulance Service",
    description: "24/7 emergency ambulance service for urgent medical needs.",
    contact: "Contact: 0912-345-6789",
    additionalInfo: "Response time may vary based on location.",
  },
  {
    title: "Oxygen Tank",
    description: "Emergency oxygen supply for individuals with respiratory needs.",
    contact: "Contact: 0918-456-7890",
    additionalInfo: "Limited availability; please call ahead.",
  },
  {
    title: "Fire Department",
    description: "Available for fire emergencies and safety checks.",
    contact: "Contact: 0917-234-5678",
    additionalInfo: "In case of a fire, contact immediately.",
  },
  {
    title: "Local Police",
    description: "24-hour hotline for reporting crimes and other urgent security issues.",
    contact: "Contact: 0915-678-4321",
    additionalInfo: "For immediate police assistance, call directly.",
  },
];

const ForUrgentNeeds = () => {
  return (
    <Container maxW={'container.xl'} py={10}>
      <VStack spacing={8} align="start">
        
        {/* Header Section */}
        <HStack justifyContent="space-between" w="full" flexWrap="wrap">
          <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color="blue.600">
            For Urgent Needs
          </Text>
        </HStack>
        
        <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
          The following resources and services are available without booking or reserving for your emergency needs.
        </Text>

        {/* Resource Cards in a Responsive Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
          {resources.map((resource, index) => (
            <Card key={index} maxW="full" bg="gray.50" shadow="md" h="full">
              <CardBody display="flex" flexDirection="column" justifyContent="space-between" h="full">
                <VStack align="start" spacing={3} flexGrow={1}>
                  <Heading size="md" color="blue.600">{resource.title}</Heading>
                  <Text fontSize="sm" color="gray.600">{resource.description}</Text>
                </VStack>
                
                <VStack align="start" spacing={1} mt={4}>
                  <Text fontSize="sm" fontWeight="bold">{resource.contact}</Text>
                  <Text fontSize="xs" color="gray.500">{resource.additionalInfo}</Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
        
      </VStack>
    </Container>
  );
};

export default ForUrgentNeeds;
