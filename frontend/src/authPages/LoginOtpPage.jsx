import { useState } from 'react';
import { Center, Heading, Text, useToast } from '@chakra-ui/react';
import { Button, FormControl, Flex, Stack, Box, useColorModeValue, HStack,
} from '@chakra-ui/react';
import { PinInput, PinInputField } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

function LoginOtpPage() {
  const [otp, setOtp] = useState('');
  const { verifyLoginOtp, isLoading } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await verifyLoginOtp(userId, otp);
      const role = response.user.role;
      console.log('Response: ', response);

      toast({
        title: 'Logged in.',
        description: 'You have logged in successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (role === 'admin') {
        navigate('/admin/reservations');
      } else if (role === 'resident') {
        navigate('/resident');
      }
      
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Invalid or expired OTP',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      px={4}
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box
        w={{ base: 'full', md: 'lg' }}
        bg={useColorModeValue('white', 'gray.800')}
        rounded={'lg'}
        boxShadow={'lg'}
        p={8}
        mx={{ base: 4, md: 0 }}
      >
        <Stack spacing={6}>
          <Center>
            <Heading fontSize={{ base: '2xl', md: '3xl' }}>
              2-Factor Authentication
            </Heading>
          </Center>
          <Text
            textAlign={'center'}
            fontSize={{ base: 'sm', md: 'md' }}
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            We have sent a 6-digit OTP to your phone or email. Please enter it below to verify your login.
          </Text>
          <FormControl>
            <Center>
              <HStack>
                <PinInput onChange={(value) => setOtp(value)} size="md">
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </Center>
          </FormControl>
          <Stack spacing={6}>
            <Button
              w={'full'}
              bg={'blue.400'}
              color={'white'}
              isLoading={isLoading}
              _hover={{
                bg: 'blue.500',
              }}
              onClick={handleVerifyOtp}
            >
              Verify
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
}

export default LoginOtpPage;
