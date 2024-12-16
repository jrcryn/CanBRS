import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    useToast,
    InputGroup,
    InputRightElement,
    Checkbox
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
  import { useAuthStore } from '../store/auth'
  import { useNavigate, Link } from 'react-router-dom'
  
  function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      identifier: '',
      password: '',
    })
    const toast = useToast()
    const { login, isLoading } = useAuthStore()
    const navigate = useNavigate()
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        const response = await login(formData.identifier, formData.password)
        toast({
          title: 'OTP Sent.',
          description: 'Please check your email for the OTP.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        navigate('/auth/verify-login-otp', { state: { userId: response.userId } })
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error'
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'Error logging in',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        if (errorMessage.includes('Please verify your phone or email')) {
          navigate('/auth/verify-signup-otp')
        }
      }
    }
  
    return (
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <Stack
          spacing={8}
          mx={'auto'}
          maxW={'lg'}
          py={12}
          px={6}
          as="form"
          onSubmit={handleSubmit}
          width="full"
          align={'center'}
          justifyContent={'center'}
        >
          <Button
            onClick={() => navigate('/')}
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
  
          <Stack textAlign={'center'} spacing={2}>
            <Heading fontSize={'4xl'}>
              <Text as={'span'} display={'block'}>
                Admin Login
              </Text>
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={10}
            width={{ base: '100%', md: '400px' }}
            mx="auto"
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="password">
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
              <Stack spacing={6}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox fontSize="sm">Remember me</Checkbox>
                <Text
                  color={'blue.400'}
                  as={Link}
                  to='/auth/forgot-password'
                  fontSize="sm" // Smaller font size
                >
                  Forgot password?
                </Text>
              </Stack>
              <Button
                type="submit"
                bg={'blue.400'}
                color={'white'}
                isLoading={isLoading}
                _hover={{
                  bg: 'blue.500',
                }}>
                Login
              </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }
  
  export default AdminLoginPage