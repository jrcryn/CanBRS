import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';

function RegisterAs() {
  const [accountType, setAccountType] = useState('admin');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountType === 'admin') {
      navigate('/auth/admin-signup');
    } else {
      navigate('/auth/resident-signup');
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      p={4}
    >
      <Stack spacing={8} maxW="lg" w="full">
        {/* Back Button */}
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

        {/* Main Card */}
        <Box
          bg="white"
          p={{ base: 6, md: 8 }}
          rounded="lg"
          boxShadow="lg"
          w="full"
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              {/* Heading */}
              <Box textAlign="center">
                <Heading fontSize={{ base: '2xl', md: '3xl' }}>
                  Create an Account
                </Heading>
                <Text mt={2} fontSize="md" color="gray.600">
                  Select your account type
                </Text>
              </Box>

              {/* Radio Group */}
              <RadioGroup onChange={setAccountType} value={accountType}>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={6} justify="center">
                  <Radio value="admin" size="lg" colorScheme="blue">
                    Admin
                  </Radio>
                  <Radio value="resident" size="lg" colorScheme="blue">
                    Resident
                  </Radio>
                </Stack>
              </RadioGroup>

              {/* Continue Button */}
              <Button
                type="submit"
                colorScheme="blue"
                w="full"
                size="lg"
                _hover={{ bg: 'blue.600' }}
              >
                Continue
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default RegisterAs;
