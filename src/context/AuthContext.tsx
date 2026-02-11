import React, { createContext, useContext, useEffect, useState } from 'react';
import { insforge } from '../utils/insforge';

interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const { data, error } = await insforge.auth.getCurrentSession();

            if (error || !data?.session) {
                setUser(null);
                return;
            }

            const sessionUser = data.session.user;

            // Get user profile for role and other custom fields
            const { data: profile } = await insforge.auth.getProfile(sessionUser.id);

            setUser({
                id: sessionUser.id,
                email: sessionUser.email || '',
                name: profile?.name || sessionUser.email?.split('@')[0] || 'User',
                role: (profile as any)?.role || 'staff'
            });
        } catch (err) {
            console.error('Error refreshing user:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        const { data, error } = await insforge.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new Error(error.message);
        }

        if (!data?.user) {
            throw new Error('Login failed');
        }

        // Get user profile for role
        const { data: profile } = await insforge.auth.getProfile(data.user.id);

        setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: profile?.name || data.user.email?.split('@')[0] || 'User',
            role: (profile as any)?.role || 'staff'
        });
    };

    const logout = async () => {
        await insforge.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
