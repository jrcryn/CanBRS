
import { Box, Flex, IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import Sidebar from './Sidebar';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box display="flex">
      {/* Desktop Sidebar */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Sidebar />
      </Box>

      {/* Mobile Drawer Sidebar */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="blue.600">
          <DrawerCloseButton color="white" mt={2} />
          <Sidebar isMobile onClose={onClose} />
        </DrawerContent>
      </Drawer>
      
      {/* Main content area */}
      <Box flex="1" ml={{ base: 0, md: '250px' }} position="relative">
        {/* Mobile Navbar */}
        <Flex 
          display={{ base: 'flex', md: 'none' }} 
          bg="blue.600" 
          p={4} 
          alignItems="center" 
          color="white"
          boxShadow="sm"
        >
          <IconButton 
            icon={<HamburgerIcon />} 
            onClick={onOpen} 
            variant="outline" 
            colorScheme="whiteAlpha" 
            aria-label="Open Menu" 
          />
          <Box ml={4} fontWeight="bold" fontSize="lg">
            CanBRS ADMIN
          </Box>
        </Flex>

        {/* Page Content */}
        <Box p={{ base: 2, md: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

Layout.propTypes = {
  children: PropTypes.any,
};
