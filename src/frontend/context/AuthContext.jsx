import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { useToast } from '../components/ToastProvider.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('accessToken') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();

    const clearAuth = useCallback(() => {
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    }, []);

    const restoreSession = useCallback(async () => {
        const storedToken = localStorage.getItem('accessToken');

        if (!storedToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await authApi.getCurrentUser();
            const currentUser = response.data?.data;

            if (currentUser) {
                setUser(currentUser);
                setToken(storedToken);
                localStorage.setItem('user', JSON.stringify(currentUser));
            } else {
                clearAuth();
            }
        } catch (err) {
            clearAuth();
        } finally {
            setLoading(false);
        }
    }, [clearAuth]);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    useEffect(() => {
        const handleExpired = () => {
            clearAuth();
            navigate('/login', { replace: true });
        };

        window.addEventListener('auth:expired', handleExpired);
        return () => window.removeEventListener('auth:expired', handleExpired);
    }, [clearAuth, navigate]);

    const login = useCallback(async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.login(payload);
            const authData = response.data?.data;
            const nextToken = authData?.accessToken;
            const nextUser = authData?.user;

            if (nextToken && nextUser) {
                setUser(nextUser);
                setToken(nextToken);
                localStorage.setItem('accessToken', nextToken);
                localStorage.setItem('user', JSON.stringify(nextUser));
                success('Signed in', 'Welcome back to your workspace.');
                navigate('/', { replace: true });
                return { success: true };
            }

            throw new Error('Invalid authentication response');
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Unable to sign in.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const signup = useCallback(async (payload) => {
        setLoading(true);
        setError(null);

        try {
            await authApi.signup(payload);
            success('Account created', 'You can sign in with your new credentials.');
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Unable to create account.';
            setError(message);
            toastError('Signup failed', message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error(err);
        } finally {
            clearAuth();
            success('Signed out', 'You have been logged out.');
            navigate('/login', { replace: true });
        }
    }, [clearAuth, navigate, success]);

    const value = useMemo(() => ({
        user,
        token,
        loading,
        error,
        isAuthenticated: Boolean(user && token),
        login,
        signup,
        logout,
        clearAuth,
        setError,
    }), [user, token, loading, error, login, signup, logout, clearAuth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};
