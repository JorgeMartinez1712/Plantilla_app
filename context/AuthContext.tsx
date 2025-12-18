import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../constants/api';

export interface AppUser {
  id: string;
  email: string;
  customers_id?: string;
  token?: string;
  app_customer_statuses_id?: number;
}

export interface LevelPivot {
  customer_id: number;
  level_id: number;
  point: number;
  credit: string;
  estatus: boolean;
  created_at: string;
  updated_at: string;
}

export interface Level {
  id: number;
  nivel: string;
  descripcion: string;
  amount: string;
  point_from: number;
  score_from: number;
  credit_from: string;
  created_at: string;
  updated_at: string;
  credit_to: string;
  score_to: number;
  point_to: number;
  pivot: LevelPivot;
}

export interface CustomerDetails {
  id: number;
  customer_type_id: number;
  full_name: string;
  profile_picture?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  card_name?: string;
  card_number?: string;
  card_expiry?: string;
  app_user?: {
    email: string;
    avatar?: string;
    app_user_status_id?: number; 
  };
  levels: Level[];
  document_type_id: number;
  document_number: string;
  birth_date: string;
  status_id: number;
  is_active: boolean;
  sales: any[];
}

export interface FinancialMetrics {
  total_pagado?: number;
  total_ventas?: number;
  ventas_pendientes?: number;
  porcentaje_pagado?: number;
  solvencia?: string | number;
  disponibilidad?: string | number;

  totalVentas?: number;
  totalPagado?: number;
  totalPendiente?: number;
  solvenciaPorc?: number;
  credito?: number;
  creditoPagado?: number;
  creditoPagadoPorc?: number;
  creditoDisponible?: number;
  creditoDisponiblePorc?: number;
  moneda?: string;
}

interface AuthContextType {
  user: AppUser | null;
  customerDetails: CustomerDetails | null;
  financialMetrics: FinancialMetrics | null;
  loading: boolean;
  loadingCustomerDetails: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  fetchCustomerDetails: (customerId: string, token: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  setCustomerDetails: React.Dispatch<React.SetStateAction<CustomerDetails | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCustomerDetails, setLoadingCustomerDetails] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | number | null>(null);

  const DEFAULT_AVATAR_URI = 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png';

  const logout = async () => {
    setLoading(true);
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('user');
      setUser(null);
      setCustomerDetails(null);
      setFinancialMetrics(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId: string, token: string, silentUpdate: boolean = false) => {
    if (!silentUpdate) {
      setLoadingCustomerDetails(true);
    }
    try {
      const response = await api.post(`/customer/view`, { id: customerId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedCustomerDetails = response.data.customer;
      const fetchedFinancialMetrics = response.data.metricas_financieras;
      if (!fetchedCustomerDetails.profile_picture) {
        fetchedCustomerDetails.profile_picture = DEFAULT_AVATAR_URI;
      }

      const shouldUpdateState = !silentUpdate || (customerDetails?.is_active === false && fetchedCustomerDetails.is_active === true);

      if (shouldUpdateState) {
        setCustomerDetails(fetchedCustomerDetails);
        setFinancialMetrics(fetchedFinancialMetrics);
      }

      return fetchedCustomerDetails;

    } catch (error: any) {
      if (!silentUpdate) {
        setCustomerDetails(null);
        setFinancialMetrics(null);
      }

      if (error.response) {
        if (error.response.status >= 500) {
          logout();
        }
      } else {
        if (!silentUpdate) {
          logout();
        }
      }
    } finally {
      if (!silentUpdate) {
        setLoadingCustomerDetails(false);
      }
    }
  };

  const checkUserStatus = async () => {
    if (!user?.customers_id || !user?.token) {
      return;
    }
    try {
      const fetchedDetails = await fetchCustomerDetails(user.customers_id, user.token, true);
      if (fetchedDetails && customerDetails?.is_active === false && fetchedDetails.is_active === true) {
        setCustomerDetails(fetchedDetails);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        const storedToken = await SecureStore.getItemAsync('userToken');

        if (storedUser && storedToken) {
          const parsedUser: AppUser = JSON.parse(storedUser);
          const userWithToken = { ...parsedUser, token: storedToken };
          setUser(userWithToken);
          if (parsedUser.customers_id) {
            await fetchCustomerDetails(parsedUser.customers_id, storedToken);
          }
        } else {
          setUser(null);
          setCustomerDetails(null);
          setFinancialMetrics(null);
        }
      } catch (error) {
        await SecureStore.deleteItemAsync('user');
        await SecureStore.deleteItemAsync('userToken');
        setUser(null);
        setCustomerDetails(null);
        setFinancialMetrics(null);
      } finally {
        setLoading(false);
      }
    };
    loadStoredData();
  }, []);

  useEffect(() => {
    if (user?.token && customerDetails?.is_active === false) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        checkUserStatus();
      }, 60000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [user?.token, customerDetails?.is_active]);

  const value = {
    user,
    customerDetails,
    financialMetrics,
    loading,
    loadingCustomerDetails,
    isAuthenticated: !!user,
    logout,
    fetchCustomerDetails,
    setUser,
    setCustomerDetails,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}