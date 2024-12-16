import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Icon,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'

const PleaseWaitForVerification = () => {
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container maxW="container.md" py={{ base: 10, md: 20 }}>
        <Box
          bg={bgColor}
          p={{ base: 6, md: 12 }}
          rounded="lg"
          shadow="lg"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Icon
              as={CheckCircleIcon}
              w={{ base: 16, md: 20 }}
              h={{ base: 16, md: 20 }}
              color="green.500"
            />

            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="bold"
              color="blue.600"
            >
              Registration Successful!
            </Heading>

            <VStack spacing={3}>
              <Text fontSize={{ base: 'md', md: 'lg' }} color={textColor}>
                Your account is currently pending verification by our administrators.
              </Text>
              <Text fontSize={{ base: 'md', md: 'lg' }} color={textColor}>
                You will receive an SMS notification on your registered phone number
                once your account has been verified.
              </Text>
              <Text fontSize={{ base: 'md', md: 'lg' }} color={textColor}>
                After verification, you can log in and start using our services.
              </Text>
            </VStack>

            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate('/auth/login')}
              w={{ base: 'full', md: 'auto' }}
            >
              Back to Login
            </Button>
          </VStack>
        </Box>
      </Container>
    </Flex>
  )
}

export default PleaseWaitForVerification