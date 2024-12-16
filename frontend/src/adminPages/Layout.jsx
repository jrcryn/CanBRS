import React from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box display="flex" >
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <Box flex="1" ml="250px" p={4} position={'sticky'}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
