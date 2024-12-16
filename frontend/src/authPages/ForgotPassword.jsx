import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    identifier: '',
  })
  const { isLoading, forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, identifier: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(formData.identifier);
      toast({
        title: 'Password Reset Link Sent',
        description: 'Please check your inbox or phone for the reset link.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/auth/login');
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error sending reset link',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}>

        <Button
          onClick={() => navigate('/auth/login')}
          colorScheme="blue"
          variant="outline"
          position={{ base: 'relative', md: 'absolute' }}
          top={{ md: 5 }}
          left={{ md: 5 }}
          display={{ base: 'block' }}
          _hover={{ bg: 'blue.100' }}
        >
          ← Go Back
        </Button>

      <Stack
        spacing={4}
        w="full"
        maxW="md"
        bg={useColorModeValue('white', 'gray.700')}
        rounded="xl"
        boxShadow="lg"
        p={6}
        my={12}
        as="form"
        onSubmit={handleSubmit}>

          
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          If an account exists for the email or phone number provided, you will receive a password reset link shortly.
        </Text>

        <FormControl id="email">
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            value={formData.identifier}
            type="text"
            onChange={handleChange}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            type="submit"
            bg={'blue.400'}
            color={'white'}
            isLoading={isLoading}
            _hover={{
              bg: 'blue.500',
            }}>
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default ForgotPassword;