import { sha256 } from 'js-sha256';
import { useCallback, useState } from "react";
import api from "../constants/api";

interface DocumentType {
    id: number;
    label: string;
    value: string;
    code: string;
}

interface RegisterUserData {
    full_name: string;
    document_type_id: number;
    document_number: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    address: string;
    birth_date: string;
}

interface DiditVerificationPayload {
    user_id: string | number;
    full_name?: string;
    email: string;
    phone?: string;
    birth_date?: string;
    document_number?: string;
    ip?: string;
}

interface CustomerVerificationResponse {
    customer: {
        status_id: number;
    };
}

interface DocumentCheckResponse {
    success: boolean;
    customer_exists: boolean;
    is_registered: boolean;
    message?: string;
    customer_data?: {
        id: number;
        full_name: string;
        phone_number: string;
        address: string;
        document_type_id: number;
        document_number: string;
        birth_date: string;
        status_id: number;
        email: string | null;
    };
}

export function useRegister() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getDocumentTypes = useCallback(async (): Promise<DocumentType[]> => {
        try {
            const response = await api.get<{ id: number; name: string; code: string }[]>("/doc-type");
            return response.data.map((item) => ({
                id: item.id,
                label: item.name,
                value: item.code,
                code: item.code
            }));
        } catch (err: unknown) {
            const errorMessage = (err as any).response?.data?.message || (err as Error).message || "Error al cargar tipos de documento.";
            setError(errorMessage);
            return [];
        }
    }, []);

    const registerAppUser = useCallback(async (userData: RegisterUserData) => {
        setLoading(true);
        setError(null);
        try {
            const hashedPassword = sha256(userData.password);
            const hashedConfirmation = sha256(userData.password_confirmation);

            const payload = {
                ...userData,
                password: hashedPassword,
                password_confirmation: hashedConfirmation,
            };

            const response = await api.post("/register", payload);
            return { success: true, data: { user: response.data.user, token: response.data.token } };
        } catch (err: unknown) {
            let errorMessage = "Error al registrar usuario de la aplicación.";
            if ((err as any).response?.data?.errors) {
                const apiErrors = (err as any).response.data.errors;
                const firstErrorKey = Object.keys(apiErrors)[0];
                if (firstErrorKey && apiErrors[firstErrorKey].length > 0) {
                    errorMessage = apiErrors[firstErrorKey][0];
                }
            } else if ((err as any).response?.data?.message) {
                errorMessage = (err as any).response.data.message;
            } else if ((err as Error).message) {
                errorMessage = (err as Error).message;
            }
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const checkDocument = useCallback(async (document_type_id: number, document_number: string): Promise<DocumentCheckResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post<DocumentCheckResponse>("/check", { document_type_id, document_number });
            return response.data;
        } catch (err: unknown) {
            if ((err as any).response?.status === 404) {
                return { success: false, customer_exists: false, is_registered: false, message: "Documento Verificado. Ingresa tus datos." };
            }
            let errorMessage = "Error al verificar el documento.";
            if ((err as any).response?.data?.message) {
                errorMessage = (err as any).response.data.message;
            } else if ((err as Error).message) {
                errorMessage = (err as Error).message;
            }
            setError(errorMessage);
            return { success: false, customer_exists: false, is_registered: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);


    const initiateDiditVerification = useCallback(async (payload: DiditVerificationPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/verification/initiate", payload);
            if (response.data && response.data.success) {
                return { success: true, data: response.data.data };
            } else {
                const msg = response.data?.message || "La respuesta de la API no indica éxito.";
                setError(msg);
                return { success: false, error: msg };
            }
        } catch (err: unknown) {
            const errorMessage = (err as any).response?.data?.message || (err as Error).message || "Error al iniciar la verificación con Didit.";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserVerificationStatus = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post<CustomerVerificationResponse>(`/customer/view`, { id: userId });
            const isVerified = response.data.customer.status_id === 4;
            return { success: true, isVerified };
        } catch (err: unknown) {
            const errorMessage = (err as any).response?.data?.message || (err as Error).message || "Error al obtener el estado de verificación.";
            setError(errorMessage);
            return { success: false, isVerified: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    return { getDocumentTypes, registerAppUser, checkDocument, initiateDiditVerification, fetchUserVerificationStatus, loading, error };
}