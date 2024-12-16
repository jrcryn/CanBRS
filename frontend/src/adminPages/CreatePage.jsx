import { useState } from 'react';
import {
    Container,
    VStack,
    Heading,
    Box,
    Input,
    Textarea,
    Select,
    Button,
    useColorModeValue,
} from '@chakra-ui/react';
import { useListingStore } from '../store/listing';

const CreatePage = () => {
    const [newListing, setNewListing] = useState({
        name: "",
        description: "",
        inventory: "",
        address: "",
        image: null,
        type: "",
    });
    const { createListing, isLoading } = useListingStore();

    const handleAddListing = async () => {
        const formData = new FormData();
        formData.append('name', newListing.name);
        formData.append('description', newListing.description);
        formData.append('type', newListing.type);
        formData.append('image', newListing.image);

        if (newListing.type === 'equipment') {
            formData.append('inventory', newListing.inventory);
        } else if (newListing.type === 'facility') {
            formData.append('address', newListing.address);
        }

        try {
            const data = await createListing(formData);
            // Handle success or error
        } catch (error) {
            console.error('Error creating listing:', error);
        }
    };

    return (
        <Container maxW={"container.sm"}>
            <VStack spacing={8}>
                <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                    Create New Listing
                </Heading>

                <Box
                    w={"full"}
                    bg={useColorModeValue("white", "gray.800")}
                    p={6}
                    rounded={"lg"}
                    shadow={"md"}
                >
                    <VStack spacing={4}>
                        <Input
                            placeholder="Listing Name"
                            name="name"
                            value={newListing.name}
                            onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                        />
                        <Textarea
                            placeholder="Description"
                            name="description"
                            value={newListing.description}
                            onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                        />
                        <Select
                            placeholder="Select Type"
                            name="type"
                            value={newListing.type}
                            onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                        >
                            <option value="equipment">Equipment</option>
                            <option value="facility">Facility</option>
                        </Select>

                        {newListing.type === 'equipment' && (
                            <Input
                                placeholder="Inventory"
                                name="inventory"
                                type="number"
                                value={newListing.inventory}
                                onChange={(e) => setNewListing({ ...newListing, inventory: parseInt(e.target.value, 10) || '' })}
                            />
                        )}

                        {newListing.type === 'facility' && (
                            <Input
                                placeholder="Address"
                                name="address"
                                value={newListing.address}
                                onChange={(e) => setNewListing({ ...newListing, address: e.target.value })}
                            />
                        )}

                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewListing({ ...newListing, image: e.target.files[0] })}
                        />
                        <Button colorScheme="blue" onClick={handleAddListing} w="full" isLoading={isLoading}>
                            Add Listing
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default CreatePage;