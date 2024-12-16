// LoadingScreen.js

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionText = motion.create(Text);

const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="gray.100"
      flexDirection="column"
    >
      <MotionText
        fontSize="6xl"
        fontWeight="bold"
        color="blue.500"
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        CanBRS
      </MotionText>
      <Text fontSize="lg" color="gray.600" mt={4}>
        Loading...
      </Text>
    </Box>
  );
};

export default LoadingSpinner;
