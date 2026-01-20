import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            isAuthenticated: false, // User (Guest) Auth
            isAdminAuthenticated: false, // Admin Auth
            adminPassword: '1006', // Default Admin PIN

            login: (password) => {
                // Guest Login (Fixed for now)
                if (password === '1234') {
                    set({ isAuthenticated: true });
                    return true;
                }
                return false;
            },

            adminLogin: (password) => {
                if (password === get().adminPassword) {
                    set({ isAdminAuthenticated: true });
                    return true;
                }
                return false;
            },

            changeAdminPassword: (newPassword) => {
                set({ adminPassword: newPassword });
            },

            logout: () => set({ isAuthenticated: false, isAdminAuthenticated: false }),
        }),
        {
            name: 'yeoyeo-gallery-auth',
            partialize: (state) => ({ adminPassword: state.adminPassword }), // Only persist the custom password, NOT the login session
        }
    )
);
