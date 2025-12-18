import { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useAuthContext } from '../context/AuthContext';
import api from '../constants/api';
import { sha256 } from 'js-sha256';

export const useLogin = () => {
    const { user, isAuthenticated, loading, setUser, fetchCustomerDetails } = useAuthContext();
    const router = useRouter();
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [recoverLoading, setRecoverLoading] = useState(false);
    const [recoverError, setRecoverError] = useState<string | null>(null);
    const [resetPassLoading, setResetPassLoading] = useState(false);
    const [resetPassError, setResetPassError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string; statusId?: number; customerId?: string; email?: string }> => {
        setLoginLoading(true);
        setLoginError(null);
        try {
            const hashedPassword = sha256(password);
            const response = await api.post('/login', {
                email,
                password: hashedPassword,
            });

            if (response.data.error) {
                const errorMessage = response.data.error;
                setLoginError(errorMessage);
                return { success: false, error: errorMessage };
            }

            const { token, user: userData } = response.data;

            if (token && userData) {
                const parts = token.split('|');
                const cleanToken = parts.length > 1 ? parts[1] : token;

                const userWithCustomerId = {
                    ...userData,
                    customers_id: userData.customer_id
                };
                await SecureStore.setItemAsync('userToken', cleanToken);
                await SecureStore.setItemAsync('user', JSON.stringify(userWithCustomerId));
                setUser({ ...userWithCustomerId, token: cleanToken });
                if (userWithCustomerId.customers_id) {
                    await fetchCustomerDetails(userWithCustomerId.customers_id.toString(), cleanToken);
                }
                return {
                    success: true,
                    statusId: userData.app_user_status_id,
                    customerId: userData.customer_id,
                    email: userData.email
                };
            } else {
                const errorMessage = 'Respuesta de API inesperada';
                setLoginError(errorMessage);
                return { success: false, error: errorMessage };
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error de red o credenciales incorrectas';
            setLoginError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoginLoading(false);
        }
    };

    const sendVerificationCode = async (email: string): Promise<{ success: boolean; data?: any; error?: string }> => {
        setRecoverLoading(true);
        try {
            const response = await api.post("/forgot-password", { email });
            return { success: true, data: response.data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error al enviar el enlace de recuperación.";
            setRecoverError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setRecoverLoading(false);
        }
    };

    const resetPassword = async (email: string, token: string, newPassword: string, passwordConfirmation: string): Promise<{ success: boolean; data?: any; error?: string }> => {
        setResetPassLoading(true);
        try {
            const hashedNewPassword = sha256(newPassword);
            const response = await api.post("/reset-password", {
                email,
                token,
                password: hashedNewPassword,
                password_confirmation: sha256(passwordConfirmation),
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error al restablecer la contraseña. Verifica el código.";
            setResetPassError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setResetPassLoading(false);
        }
    };

    return {
        isAuthenticated,
        user,
        loading,
        customerDetails: null,
        login: handleLogin,
        fetchCustomerDetails,
        loginLoading,
        loginError,
        recoverLoading,
        recoverError,
        resetPassLoading,
        resetPassError,
        sendVerificationCode,
        resetPassword,
    };
};