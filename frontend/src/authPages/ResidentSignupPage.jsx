import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Select,
  Grid,
  GridItem,
  useColorModeValue,
  useToast,
  Link,
  FormHelperText
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuthStore } from '../store/auth.js';
import { useNavigate } from 'react-router-dom'
import { Sitios } from '../components/sitios.js'

function ResidentSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    suffix: '',
    birthdate: '',
    blknum: '',
    lotnum: '',
    sitio: '',
    phone: '',
    password: '',
    validID: null,
    validIdNumber: '',
    selfie: null,
    gender: '',
  })

  const toast = useToast()
  const navigate = useNavigate()
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

  const { residentSignup, isLoading } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
  
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload JPEG, JPG or PNG files only',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      e.target.value = null;
      return;
    }
  
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'File size should be less than 5MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      e.target.value = null;
      return;
    }
  
    // If validations pass, update form data
    setFormData(prev => ({
      ...prev,
      [e.target.name]: file
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = [
      'firstname', 
      'lastname', 
      'birthdate', 
      'gender',
      'validIdNumber',
      'phone',
      'password',
      'validIDfront',
      'validIDback',
      'selfie'
    ]

    const missingFields = requiredFields.filter(field => !formData[field])

    if (missingFields.length > 0) {
      toast({
        title: 'Missing Fields',
        description: `Please fill in: ${missingFields.join(', ')}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    const submissionData = new FormData()
    submissionData.append('firstname', formData.firstname)
    submissionData.append('middlename', formData.middlename || '')
    submissionData.append('lastname', formData.lastname)
    submissionData.append('suffix', formData.suffix || '')
    submissionData.append('birthdate', formData.birthdate)
    submissionData.append('blknum', formData.blknum)
    submissionData.append('lotnum', formData.lotnum)
    submissionData.append('sitio', formData.sitio)
    submissionData.append('phone', formData.phone)
    submissionData.append('password', formData.password)
    submissionData.append('validIdNumber', formData.validIdNumber)
    submissionData.append('gender', formData.gender)

    // Append files
    submissionData.append('validIDfront', formData.validIDfront)
    submissionData.append('validIDback', formData.validIDback)
    submissionData.append('selfie', formData.selfie)

    try {
      await residentSignup(submissionData)

      toast({
        title: 'Account created.',
        description: 'Your account has been created successfully.',
        status: 'success', 
        duration: 5000,
        isClosable: true,
      })

      navigate('/auth/please-wait-for-verification')

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
    <Flex minH={'100vh'} align={'center'} justify={'center'} px={4}>
      <Stack spacing={8} mx={'auto'} w={'full'} maxW={'5xl'} py={12}>
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

        <Stack align={'center'}>
          <Heading fontSize={'3xl'} textAlign={'center'}>
            Create Resident Account
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'} align={'center'}>
            Fields with red asterisk (<span style={{ color: 'red' }}>*</span>) are required.
          </Text>
        </Stack>
        <Box
          as="form"
          onSubmit={handleSubmit}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            <GridItem colSpan={1}>
              <FormControl id="firstname" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl id="middlename">
                <FormLabel>Middle Name</FormLabel>
                <Input
                  type="text"
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl id="lastname" isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl id="suffix">
                <FormLabel>Suffix</FormLabel>
                <Input
                  type="text"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mt={4}>
            <GridItem colSpan={1}>
              <FormControl id="blknum" isRequired>
                <FormLabel>Block Number</FormLabel>
                <Input
                  type="number"
                  name="blknum"
                  value={formData.blknum}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl id="lotnum" isRequired>
                <FormLabel>Lot Number</FormLabel>
                <Input
                  type="number"
                  name="lotnum"
                  value={formData.lotnum}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
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
            </GridItem>
          </Grid>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mt={4}>
            {/* Valid ID (Front) */}
            <GridItem colSpan={1}>
            <FormControl id="validIdfront" isRequired>
                <FormLabel>Valid ID Front</FormLabel>
                  <Input
                    accept='.jpg,.jpeg,.png'
                    type="file"
                    name="validIDfront"
                    onChange={handleFileChange}
                  />
                  <FormHelperText>
                    For better service, please upload a valid ID that matches your resident classification:
                    <br />• Senior citizens: Senior Citizen ID
                    <br />• PWD: PWD ID  
                    <br />• Pregnant: PWD ID / Other Proof
                    <br />• Regular resident: Any government-issued ID
                    <br /><br />
                    (Accepted formats: JPG, JPEG, PNG)
                    <br />
                    (Maximum size: 5MB)
                  </FormHelperText>
              </FormControl>
            </GridItem>

            {/* Valid ID (Back) */}
            <GridItem colSpan={1}>
            <FormControl id="validIdback" isRequired>
                <FormLabel>Valid ID Back</FormLabel>
                  <Input
                    accept='.jpg,.jpeg,.png'
                    type="file"
                    name="validIDback"
                    onChange={handleFileChange}
                  />

                <FormHelperText>
                  Please upload a clear photo of the back side of your ID.
                  <br /><br />
                  (Accepted formats: JPG, JPEG, PNG)
                  <br />
                  (Maximum size: 5MB)
                </FormHelperText>
              </FormControl>
            </GridItem>

            {/* Selfie */}
            <GridItem colSpan={1}>
            <FormControl id="selfie" isRequired>
                <FormLabel>Selfie</FormLabel>
                  <Input
                    accept='.jpg,.jpeg,.png'
                    type="file"
                    name="selfie"
                    onChange={handleFileChange}
                  />
                <FormHelperText>
                  Please upload a recent, clear photo of yourself.
                  <br /><br />
                  (Accepted formats: JPG, JPEG, PNG) 
                  <br />
                  (Maximum size: 5MB)
                </FormHelperText>
              </FormControl>
            </GridItem>

          </Grid>

          {/* Valid ID Number and Birthdate */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mt={4}>
            
            <GridItem colSpan={1}>
              <FormControl id="phone" isRequired>
                <FormLabel>Valid ID Number</FormLabel>
                <Input
                  type="number"
                  name="validIdNumber"
                  value={formData.validIdNumber}
                  onChange={handleChange}
                />
                <FormHelperText>
                  Please enter the number on your valid ID, make sure it's correct.
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
              <FormControl id="birthdate" isRequired>
                <FormLabel>Birthdate</FormLabel>
                <Input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
              <FormControl id="gender" isRequired>
                <FormLabel>Sex</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Select Sex"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </FormControl>
            </GridItem>
            
          </Grid>



          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mt={4}>
            <GridItem colSpan={1}>
              <FormControl id="phone" isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <FormHelperText>
                  Please enter a valid phone number. It will be used for logging in and for receiving OTP codes and other updates.
                </FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((show) => !show)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            </GridItem>
          </Grid>

          
          <Stack spacing={6} pt={6}>
            <Button
              type="submit"
              size="lg"
              bg="blue.400"
              color="white"
              isLoading={isLoading}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Create Account
            </Button>
            <Text textAlign={'center'} fontSize="sm" color="gray.600">
              All of the information you provide will be securely stored and used for resident account verification purposes, so make sure they're correct. We will not share your information with any third parties.
            </Text>
          </Stack>
          <Stack pt={4}>
            <Text align="center" fontSize="sm" color="gray.600">
              By signing up, you agree to our{' '}
              <Link color="blue.400" href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>.
            </Text>
          </Stack>
          <Stack pt={3}>
            <Text align="center" fontSize="sm" color="gray.600">
              Already a Resident User?{' '}
              <Link color="blue.400" href="/auth/login">
                Login Here
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default ResidentSignupPage