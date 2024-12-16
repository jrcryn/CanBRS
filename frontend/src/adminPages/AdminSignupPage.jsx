import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Box,
  Select,
  Avatar,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';
import { Sitios } from '../components/sitios.js';

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sitio: '',
    email: '',
    phone: '',
    password: '',
    registrationKey: '',
    profilePicture: null,
  });
  const toast = useToast();
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
  
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a JPG or PNG image.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: 'File size should not exceed 5MB.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      setFormData({ ...formData, profilePicture: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('sitio', formData.sitio);
    submissionData.append('email', formData.email);
    submissionData.append('password', formData.password);
    submissionData.append('registrationKey', formData.registrationKey);
    submissionData.append('phone', formData.phone);
    if (formData.profilePicture) {
      submissionData.append('profilePicture', formData.profilePicture);
    }

    try {
      await signup(submissionData);
      toast({
        title: 'Account created.',
        description: 'Your account has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/auth/verify-signup-otp');
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error signing up',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={8} w="full" p={5} align="center" minH="90vh" bg="gray.50">
      {/* Header Section */}
      <HStack justifyContent="space-between" w="full" maxW="container.xl">
        <Text fontSize="3xl" fontWeight="bold" color="blue.600">
          Signup for Admin Account
        </Text>
        <Button colorScheme="blue" variant="outline" onClick={() => navigate('/admin/admin-accounts')}>
          ← Go Back
        </Button>
      </HStack>

      {/* Form Section */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="full"
        maxW="container.md"
        p={8}
        bg="white"
        boxShadow="md"
        borderRadius="md"
      >
        <VStack spacing={4}>
          {/* Name and Sitio Inputs */}
          <HStack w="full" spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} />
            </FormControl>

            <FormControl id="sitio" isRequired>
              <FormLabel>Sitio</FormLabel>
              <Select
                name="sitio"
                value={formData.sitio}
                onChange={handleChange}
                placeholder="Select Sitio"
              >
                {Sitios.map((sitio) => (
                  <option key={sitio} value={sitio}>
                    {sitio}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>

          {/* Email and Phone Number Inputs */}
          <HStack w="full" spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </FormControl>

            <FormControl id="phone" isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </FormControl>
          </HStack>

          {/* Profile Picture Input */}
          <FormControl id="profilePicture">
            <FormLabel>Profile Picture</FormLabel>
            <Input 
            type="file" 
            name="profilePicture" 
            onChange={handleFileChange} accept='.jpg,.jpeg,.png' />
          </FormControl>

          {/* Password Input */}
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {/* Registration Key Input */}
          <FormControl id="registrationKey" isRequired>
            <FormLabel>Registration Key</FormLabel>
            <Input
              type="text"
              name="registrationKey"
              value={formData.registrationKey}
              onChange={handleChange}
            />
          </FormControl>

          {/* Submit Button */}
          <Button
            size="lg"
            colorScheme="blue"
            isLoading={isLoading}
            type="submit"
            w="full"
          >
            Create Account
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
}

export default SignupPage;
