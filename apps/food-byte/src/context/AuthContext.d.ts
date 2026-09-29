import React from 'react';
import { User, Role } from '@repo/api-client';
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, role?: Role) => Promise<void>;
    signup: (email: string, role?: Role) => Promise<{
        message: string;
    }>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;
}
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
