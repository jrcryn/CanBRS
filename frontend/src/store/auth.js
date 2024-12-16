import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true; // to send cookies

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    keys: [],

    signup: async (email, password, name, sitio, registrationKey) => {
        set({ isLoading: true, error: null });
        try {
           const response = await axios.post(`${API_URL}/auth/admin-signup`, { email, password, name, sitio, registrationKey });
           set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    generateRegistrationKey: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/generate-registration-key`);
            set({ registrationKey: response.data.registrationKey, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error generating registration key", isLoading: false });
            throw error;
        }
    },

    fetchKeys: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/auth/registration-keys`);
            set({ keys: response.data.keys, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching keys", isLoading: false });
            throw error;
        }
    },

    deleteRegistrationKey: async (keyId) => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(
                `${API_URL}/auth/delete-registration-key`, { keyId } );
            set({ isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error deleting key",
                isLoading: false,
            });
            throw error;
        }
    },

    residentSignup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/resident-signup`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error signing up', isLoading: false });
            throw error;
        }
    },

    login: async (identifier, password) => {
        set({ isLoading: true, error: null });
        try {
        const response = await axios.post(`${API_URL}/auth/login`, { identifier, password });
        set({ isLoading: false });
        return response.data; // Contains userId
        } catch (error) {
        set({ error: error.response.data.message || 'Error logging in', isLoading: false });
        throw error;
        }
    },

    verifyLoginOtp: async (userId, otp) => {
        set({ isLoading: true, error: null });
        try {
        const response = await axios.post(`${API_URL}/auth/verify-login-otp`, { userId, otp });
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        return response.data; // Contains role
        } catch (error) {
        set({ error: error.response.data.message || 'Error verifying OTP', isLoading: false });
        throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || 'Error logging out', isLoading: false });
          throw error;
        }
      },
    

    verifySignup: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/verify-signup-otp`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data; // Contains role
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/auth/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },

    forgotPassword: async (identifier) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, { identifier });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error sending reset password link", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error resetting password", isLoading: false });
            throw error;
        }
    },
}));