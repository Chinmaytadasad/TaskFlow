import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Restore session on page refresh
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Remove token only if it's invalid (401), not if backend is down
                    if (error.response?.status === 401) {
                        localStorage.removeItem('token');
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            const userData = await authService.getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            throw error; // Let UI handle error messages
        }
    };

    const register = async (userData) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
