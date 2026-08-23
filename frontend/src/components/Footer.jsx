
import { Box, chakra, Container, SimpleGrid, Stack, Text, VisuallyHidden, useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types';


const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  )
}

export default function Footer() {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid templateColumns={{ base: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }} spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Text fontSize={'2xl'} fontWeight={'bold'} color={'blue.500'}>
                CanBRS
              </Text>
              <Text fontSize={'sm'} color={'gray.500'} mt={1}>
                Canlubang Booking and Reservation System
              </Text>
            </Box>
            <Text fontSize={'sm'}>© {new Date().getFullYear()} Barangay Canlubang. All rights reserved.</Text>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Quick Links</ListHeader>
            <Box as={RouterLink} to={'/'} _hover={{ textDecoration: 'none', color: 'blue.500' }}>
              Home
            </Box>
            <Box as={RouterLink} to={'/listing'} _hover={{ textDecoration: 'none', color: 'blue.500' }}>
              Availabilities
            </Box>
            <Box as={RouterLink} to={'/request-form'} _hover={{ textDecoration: 'none', color: 'blue.500' }}>
              Inquire
            </Box>
            <Box as={RouterLink} to={'/reservation-policies'} _hover={{ textDecoration: 'none', color: 'blue.500' }}>
              Reservation Policies
            </Box>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Resources</ListHeader>
            <Box as={RouterLink} to={'/urgent-needs'} _hover={{ textDecoration: 'none', color: 'blue.500' }}>
              Urgent Needs
            </Box>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Contact Us</ListHeader>
            <Stack spacing={2}>
              <Text fontSize={'sm'}>
                Barangay Hall, Canlubang,<br />
                Calamba City, Laguna
              </Text>
              <Text fontSize={'sm'}>
                Phone: (123) 456-7890
              </Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

SocialButton.propTypes = {
  children: PropTypes.any,
  label: PropTypes.any,
  href: PropTypes.any,
};
ListHeader.propTypes = {
  children: PropTypes.any,
  label: PropTypes.any,
  href: PropTypes.any,
};
Footer.propTypes = {
  children: PropTypes.any,
  label: PropTypes.any,
  href: PropTypes.any,
};
