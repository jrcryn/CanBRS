import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useReservationStore = create((set) => ({
    reservation: [],
    isLoading: false,
    error: null,

    createReservation: async (newReservation) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`${API_URL}/request-form`, newReservation, {
                withCredentials: true,
            });
            const data = res.data;
            set((state) => ({ reservation: [...state.reservation, data.data], isLoading: false }));
            return data;

        } catch (error) {
            set({ isLoading: false, error });
            throw error;
        }
    },

    fetchReservationResident: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`${API_URL}/track-reservations`);
            const data = res.data;
            console.log('Fetched reservations:', data); // to see reservations in console
            set({ reservation: data.data, isLoading: false });

        } catch (error) {
            console.error('Error fetching reservations:', error);
            set({ isLoading: false, error });
        }
    },

    fetchReservationAdmin: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`${API_URL}/reservations`, {
                withCredentials: true,
            });
            const data = res.data;
            console.log('Fetched reservations:', data); // to see reservations in console
            set({ reservation: data.data, isLoading: false });

        } catch (error) {
            console.error('Error fetching reservations:', error);
            set({ isLoading: false, error });
        }
    },

    updateReservationAdmin: async (id, updates) => {
        set({ isLoading: true });
        try {
          const response = await axios.put(`${API_URL}/reservations/${id}`, updates, {
            withCredentials: true,
          });
          const updatedReservation = response.data.data;
    
          set((state) => ({
            reservation: state.reservation.map((res) =>
              res._id === id ? updatedReservation : res
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error });
          throw error;
        }
    },

    deleteReservationAdmin: async (id) => {
        set({ isLoading: true });
        try {
          await axios.delete(`${API_URL}/reservations/${id}`, { withCredentials: true });
          set((state) => ({
            reservation: state.reservation.filter((res) => res._id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false, error });
          throw error;
        }
    },

}));