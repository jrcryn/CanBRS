import { useState } from 'react'
import { Center, Heading, Text, useToast } from '@chakra-ui/react'
import {
  Button,
  FormControl,
  Flex,
  Stack,
  Box,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { PinInput, PinInputField } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function VerifySignup() {
  const [code, setCode] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  const { error, isLoading, verifySignup } = useAuthStore()

  const handleVerify = async (e) => {
    e.preventDefault()
    try {
      const response = await verifySignup(code)
      const role = response.user.role

      toast({
        title: 'Email Verified.',
        description: 'Your email has been verified successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      if (role === 'admin') {
        navigate('/admin/dashboard')
      } else if (role === 'resident') {
        navigate('/resident')
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error verifying email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    console.log(error)
  }

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
              Verify Your Phone or Email
            </Heading>
          </Center>
          <Text
            textAlign={'center'}
            fontSize={{ base: 'sm', md: 'md' }}
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            We have sent a 6-digit code to your phone or email. Please enter it
            below to verify your account.
          </Text>
          <FormControl>
            <Center>
              <HStack>
                <PinInput onChange={(value) => setCode(value)} size="md">
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
              onClick={handleVerify}
            >
              Verify
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  )
}
