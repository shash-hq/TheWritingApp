import { create } from 'zustand';
import { apiClient } from '../lib/axios';

interface User {
    id: string;
    username: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    streak?: number;
    followersCount?: number;
    followingCount?: number;
    createdAt?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => {
        set({ user, isAuthenticated: true });
    },
    login: async (email, password) => {
        const { data } = await apiClient.post('/users/login', { email, password });
        set({ user: data.user, isAuthenticated: true });
    },
    register: async (username, email, password) => {
        const { data } = await apiClient.post('/users/register', { username, email, password });
        set({ user: data.user, isAuthenticated: true });
    },
    logout: async () => {
        try {
            await apiClient.post('/users/logout');
        } catch {
            // logout endpoint might fail; clear state regardless
        }
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: async () => {
        try {
            const { data } = await apiClient.get('/users/me');
            set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
