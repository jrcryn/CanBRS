import { create } from 'zustand';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL);

// Ensure axios sends cookies if your backend uses sessions
axios.defaults.withCredentials = true;

export const useListingStore = create((set) => ({
    listing: [],
    listingsWithoutImages: [], //for listings without images
    isLoading: false,
    error: null,
    setListing: (listing) => set({ listing }),

    createListing: async (newListing) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`${API_URL}/create-listing`, newListing);
            const data = res.data;
            set((state) => ({ listing: [...state.listing, data.data] }));
            set({ isLoading: false });
            return data;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
        
    },
    fetchListing: async (excludeImages = false) => {
      set({ isLoading: true });
      try {
        const res = await axios.get(`${API_URL}/listing`, {
          params: { excludeImages },
        });
        const data = res.data;
        console.log('Fetched listings:', data);
        set({ listing: data.data, isLoading: false });
      } catch (error) {
        console.error('Error fetching listings:', error);
        set({ isLoading: false, error });
      }
    },

    //fetch listings without images
    fetchListingWithoutImages: async () => {
      set({ isLoading: true });
      try {
        const res = await axios.get(`${API_URL}/listing`, {
          params: { excludeImages: true },
          withCredentials: true,
        });
        set({ listingsWithoutImages: res.data.data, isLoading: false });
      } catch (error) {
        console.error('Error fetching listings without images:', error);
        set({ isLoading: false, error });
      }
    },

    updateListing: async (id, updates) => {
        set({ isLoading: true });
        try {
          const response = await axios.put(`${API_URL}/update-listing/${id}`, updates);
          const updatedListing = response.data.data;
          set((state) => ({
            listing: state.listing.map((listing) =>
              listing._id === id ? updatedListing : listing
            ),
          }));
          set({ isLoading: false });
          return updatedListing;
        } catch (error) {
          console.error('Error updating listing:', error);
          set({ isLoading: false });
          throw error;
        }
    },

    deleteListing: async (id) => {
        set({ isLoading: true });
        try {
          await axios.delete(`${API_URL}/delete-listing/${id}`);
          set((state) => ({
            listing: state.listing.filter((listing) => listing._id !== id),
          }));
          set({ isLoading: false });
        } catch (error) {
          console.error('Error deleting listing:', error);
          set({ isLoading: false });
        }
    },

    initializeSocketListeners: () => {
        socket.on('listingCreated', (newListing) => {
          set((state) => ({ listing: [...state.listing, newListing] }));
        });
    
        socket.on('listingUpdated', (updatedListing) => {
          set((state) => ({
            listing: state.listing.map((listing) =>
              listing._id === updatedListing._id ? updatedListing : listing
            ),
          }));
        });
    
        socket.on('listingDeleted', ({ id }) => {
          set((state) => ({
            listing: state.listing.filter((listing) => listing._id !== id),
          }));
        });
    },
}));