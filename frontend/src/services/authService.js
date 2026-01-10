import api from './api';

export const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/api/auth/login', credentials);
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    },

    // Get current user profile
    getCurrentUser: async () => {
        const response = await api.get('/api/auth/me');
        return response.data;
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await api.put('/api/auth/profile', userData);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};
