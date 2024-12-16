import axios from 'axios';
import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL;


export const UseResidentStore = create((set) => ({
    residents: [],
    admins: [],
    isLoading: false,
    error: null,
    
    approveResident: async (residentId, classification) => {
        try {

            if (!classification) {
                throw new Error('Classification is required for approval.');
            }

            const response = await axios.put(
                `${API_URL}/approve-resident/${residentId}`, 
                { classification: classification },
                {withCredentials: true}
            );

            if (!response.data.success) {
            throw new Error(response.data.message);
            }

             return response.data.resident;
            
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Failed to approve resident';

        }
    },

    declineResident: async (residentId, declineReason) => {
        try {
          if (!declineReason) {
            throw new Error('Decline reason is required.');
          }
    
          const response = await axios.put(
            `${API_URL}/decline-resident/${residentId}`,
            { reason: declineReason },
            { withCredentials: true }
          );
    
          if (!response.data.success) {
            throw new Error(response.data.message);
          }
    
          return response.data.resident;
        } catch (error) {
          throw error.response?.data?.message || error.message || 'Failed to decline resident';
        }
      },
    
    fetchResidents: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/resident-accounts`, {
                withCredentials: true,
            });
            console.log('Fetched residents:', response.data.residents);
            set({ residents: response.data.residents, isLoading: false });
    
        } catch (error) {
            console.error('Error fetching residents:', error);
            set({ error: 'Failed to fetch residents', isLoading: false });
            
        }
    },

    fetchAdmins: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/admin-accounts`, {
                withCredentials: true,
            });
            console.log('Fetched admins:', response.data.admins);
            set({ admins: response.data.admins, isLoading: false });
    
        } catch (error) {
            console.error('Error fetching admins:', error);
            set({ error: 'Failed to fetch admins', isLoading: false });
            
        }
    },

}));
