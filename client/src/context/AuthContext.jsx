import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('craftelier_token');
        const savedUser = localStorage.getItem('craftelier_user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                // Verify token is still valid
                authAPI.getMe()
                    .then(res => {
                        setUser(res.data.data);
                        localStorage.setItem('craftelier_user', JSON.stringify(res.data.data));
                    })
                    .catch(() => {
                        logout();
                    })
                    .finally(() => setLoading(false));
            } catch {
                logout();
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { user: userData, token } = res.data.data;
        localStorage.setItem('craftelier_token', token);
        localStorage.setItem('craftelier_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const signup = async (data) => {
        const res = await authAPI.signup(data);
        const { user: userData, token } = res.data.data;
        localStorage.setItem('craftelier_token', token);
        localStorage.setItem('craftelier_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('craftelier_token');
        localStorage.removeItem('craftelier_user');
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('craftelier_user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
