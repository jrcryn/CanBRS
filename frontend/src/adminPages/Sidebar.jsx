import React from 'react';
import { useAuthStore } from '../store/auth';

import { Link } from 'react-router-dom';
import {
  Box,
  Icon,
  Button,
} from '@chakra-ui/react';
import { FaClipboardList, FaUsers, FaSignOutAlt, FaTruckLoading, FaHouseUser, FaKey } from 'react-icons/fa';
import { RiAdminFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";

const Dashboard = () => {
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      as="nav"
      bg="blue.600"
      color="white"
      w="250px"
      h="100vh"
      p={4}
      display="flex"
      flexDirection="column"
      position="fixed"
    >
      {/* Logo Placeholder */}
      <Box
        mb={6}
        textAlign="center"
        fontSize="2xl"
        fontWeight="bold"
        color="whiteAlpha.900"
        p={3}
        pb={6}
        borderBottom="2px solid white"
      >
        CanBRS ADMIN
      </Box>

      {/* Navigation Buttons */}

      <Button
        as={Link}
        to="/admin/reservations"
        color={'white'}
        leftIcon={<Icon as={FaClipboardList} />}
        justifyContent="flex-start"
        variant="ghost"
        fontWeight="normal"  
        _hover={{ bg: 'white', color: 'blue.600' }}
        mb={2}
        borderRadius="md"
      >
        Reservations
      </Button>
      <Button
        as={Link}
        to="/admin/in-use-resources"
        color={'white'}
        leftIcon={<Icon as={FaTruckLoading} />}
        justifyContent="flex-start"
        variant="ghost"
        fontWeight="normal"  
        _hover={{ bg: 'white', color: 'blue.600' }}
        mb={2}
        borderRadius="md"
      >
        In-Use Resources
      </Button>

      <Button
        as={Link}
        to="/admin/listings"
        color={'white'}
        leftIcon={<Icon as={MdDashboard} />}
        justifyContent="flex-start"
        variant="ghost"
        fontWeight="normal"  
        _hover={{ bg: 'white', color: 'blue.600' }}
        mb={2}
        borderRadius="md"
      >
        Listings
      </Button>

      <Button
        as={Link}
        to="/admin/admin-accounts"
        color={'white'}
        leftIcon={<Icon as={RiAdminFill} />}
        justifyContent="flex-start"
        variant="ghost"
        fontWeight="normal"  
        _hover={{ bg: 'white', color: 'blue.600' }}
        mb={2}
        borderRadius="md"
      >
        Admin Accounts
      </Button>
      
      <Button
        as={Link}
        to="/admin/resident-accounts"
        color={'white'}
        leftIcon={<Icon as={FaHouseUser} />}
        justifyContent="flex-start"
        variant="ghost"
        fontWeight="normal"  
        _hover={{ bg: 'white', color: 'blue.600' }}
        mb={2}
        borderRadius="md"
      >
        Resident Accounts
      </Button>

      <Button
        as={Link}
        to="/admin/registration-key"
        color={'white'}
        leftIcon={<Icon as={FaKey} />}
        justifyContent="flex-start"
        variant="ghost"
        fontWeight="normal"  
        _hover={{ bg: 'white', color: 'blue.600' }}
        mb={2}
        borderRadius="md"
      >
        Registration Key
      </Button>

      {/* Log Out Button */}
      <Button
        onClick={handleLogout}
        leftIcon={<Icon as={FaSignOutAlt} />}
        color={'white'}
        justifyContent="flex-start"
        variant="ghost"
        fontWeight="normal"  
        _hover={{ bg: 'white', color: 'blue.600' }}
        mt="auto"
        borderRadius="md"
      >
        Log Out
      </Button>
    </Box>
  );
};

export default Dashboard;
