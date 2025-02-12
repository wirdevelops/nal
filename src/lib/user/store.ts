// @/lib/user/store.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, UserSettingsType, RoleType, LoginRequest, RegistrationRequest, UpdateUserType, Roles } from './types';
import * as api from './api'; // Import the API functions
import { AxiosError } from 'axios';


interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    fetchUser: () => Promise<void>;
    updateUser: (updateData: UpdateUserType) => Promise<void>;
    deleteUser: () => Promise<void>;
    setUserActiveRole: (role: typeof Roles[number]) => Promise<void>;
    updateSettings: (settings: UserSettingsType) => Promise<void>;
    clearUser: () => void;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegistrationRequest) => Promise<void>;
    logout: () => Promise<void>;
  }

export const useUserStore = create<UserState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                isLoading: false,
                error: null,
                isAuthenticated: false, 

                fetchUser: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const user = await api.getMe();
                        set({ user, isLoading: false });
                    } catch (error: any) {
                        set({ isLoading: false, error: error.message || 'Failed to fetch user' });
                    }
                },

                updateUser: async (updateData) => {
                    set({ isLoading: true, error: null });
                    try {
                        await api.updateMe(updateData);
						const currentUser = useUserStore.getState().user
						if(currentUser){
							const updatedUser = {...currentUser, ...updateData}
							set({user: updatedUser, isLoading: false})
						}
                        // Optionally re-fetch the user to ensure the store is up-to-date.
                        // await useUserStore.getState().fetchUser();
                    } catch (error: any) {
                        set({ isLoading: false, error: error.message || 'Failed to update user' });
                    }
                },

                deleteUser: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        await api.deleteMe();
                        set({ user: null, isLoading: false }); // Clear user data on deletion
                    } catch (error: any) {
                        set({ isLoading: false, error: error.message || 'Failed to delete user' });
                    }
                },

                setUserActiveRole: async (role) => {
                    set({ isLoading: true, error: null });
                    try {
                        await api.setActiveRole(role);
                        // Update only the activeRole in the user object in the store.
                        set((state) => ({
                            user: state.user ? { ...state.user, activeRole: role } : null,
                            isLoading: false
                        }));
                    } catch (error: any) {
                        set({ isLoading: false, error: error.message || 'Failed to set active role' });
                    }
                },


                updateSettings: async (settings) => {
                    set({ isLoading: true, error: null });
                    try {
                        await api.updateUserSettings(settings);
                        set((state) => {
                            return {
                              user: state.user ? { ...state.user, settings: settings } : null,
                              isLoading: false
                            }
                        });
                    } catch (error: any) {
                         set({ isLoading: false, error: error.message || 'Failed to update settings' });
                    }
                },
                clearUser: () => {
                                  set({user: null, isAuthenticated: false})
                                },
                                login: async (data: LoginRequest) => {
                                  set({isLoading: true, error: null})
                                  try {
                                    const response = await authApi.loginUser(data)
                                    //After successful, fetch the user details
                                    await get().fetchUser() //Calling the fetch user inside the store
                
                                    set({isLoading: false, isAuthenticated: true})
                
                                  } catch(error: any) {
                                     set({ isLoading: false, error: error.message || 'Failed to Login' });
                                  }
                                },
                                register: async(data: RegistrationRequest) => {
                                  set({isLoading: true, error: null})
                                  try {
                                    const response = await authApi.registerUser(data)
                                    set({isLoading: false})
                                  } catch(error: any) {
                                     set({ isLoading: false, error: error.message || 'Failed to Register' });
                                  }
                                },
                                logout: async() => {
                                  set({isLoading: true, error: null})
                                  try {
                                    const response = await authApi.logoutUser()
                                    get().clearUser() //Clearing user state.
                                    set({isLoading: false})
                                  } catch(error: any){
                                    set({ isLoading: false, error: error.message || 'Failed to Logout' });
                                  }
                                }
                            }),
                            {
                                name: 'user-storage', // unique name
                            }
                        )
                    )
                );
                