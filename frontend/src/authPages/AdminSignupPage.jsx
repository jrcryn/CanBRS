import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  Select
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuthStore } from '../store/auth.js'
import { useNavigate } from 'react-router-dom'
import { Sitios } from '../components/sitios.js'

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sitio: '',
    email: '',
    password: '',
    registrationKey: '',
  })
  const toast = useToast()
  const { signup, isLoading } = useAuthStore()
  const navigate = useNavigate() 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.sitio,
        formData.registrationKey
      )
      toast({
        title: 'Account created.',
        description: 'Your account has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      navigate('/auth/verify-signup-otp')

    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error signing up',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} as="form" onSubmit={handleSubmit}>

      <Button
          onClick={() => navigate('/auth/register-as')}
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

        <Stack align={'center'}>
          <Heading fontSize={'3xl'} textAlign={'center'}>
            Create Admin Account
          </Heading>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <HStack>

              {/* Name Input */}
              <Box>
                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                </FormControl>
              </Box>

              {/* Sitio Input */}
              <Box>
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
              </Box>
            </HStack>

            {/* Email Input */}
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
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
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
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

            {/* Create Account Button */}
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg="blue.400"
                color="white"
                isLoading={isLoading}
                type="submit"
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Create Account
              </Button>
            </Stack>
            <Stack pt={3}>
            <Text align="center" fontSize="sm" color="gray.600">
              Already an Admin?{' '}
              <Link color="blue.400" href="/auth/login">
                Login Here
              </Link>
            </Text>
          </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default SignupPage