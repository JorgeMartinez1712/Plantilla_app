import { useCallback, useEffect, useState } from 'react';
import api from '../constants/api';
import { useAuthContext } from '../context/AuthContext';

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

export interface PaymentMethod {
  id: number;
  financier_id?: number;
  code?: string;
  name: string;
  payment_status_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  icon: string;
  currency_id: number;
  type: number;
  fields_front: string | null;
  currency: Currency;
}

export interface PaymentMovement {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface PaymentDetail {
  id: number;
  amount: string;
  amount_converted: string;
  reference_number: string;
  notes: string | null;
  retail_unit: {
    id: number;
    name: string;
  } | null;
  status: {
    id: number;
    name: string;
    code: string;
  };
  sale: {
    id: number;
    sale_code: string;
    sale_date: string;
  };
  payment_method: {
    id: number;
    code: string;
    name: string;
    icon: string;
  };
  installments: Array<{
    id: number;
    due_date: string;
    amount: string;
    number: number;
    is_inicial: boolean;
    pivot: {
      amount_applied: string;
      payment_type_id: number;
      created_at: string;
    };
    status: {
      name: string;
    };
  }>;
}

export const usePayments = () => {
  const { user } = useAuthContext();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [movements, setMovements] = useState<PaymentMovement[]>([]);
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);
  const [loadingMethods, setLoadingMethods] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [errorMethods, setErrorMethods] = useState<string | null>(null);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [paymentMethodDetails, setPaymentMethodDetails] = useState<any | null>(null);
  const [loadingMethodDetails, setLoadingMethodDetails] = useState<boolean>(false);
  const [errorMethodDetails, setErrorMethodDetails] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false);
  const [errorSubmission, setErrorSubmission] = useState<string | null>(null);
  
  const requestDebitOtp = useCallback(async (
    payload: { tipoDocumento: number; cedula: number; telefono: number; codigoBanco: string; monto: number }
  ) => {
    setLoadingSubmission(true);
    setErrorSubmission(null);
    setSubmissionResult(null);

    try {
      const response = await api.post('/debito-solicitudOtp', payload);
      const data = response.data?.data || response.data;
      setSubmissionResult(data);
      return data;
    } catch (err: any) {
      setErrorSubmission('Error al solicitar OTP.');
      throw err;
    } finally {
      setLoadingSubmission(false);
    }
  }, []);

  const chargeDebit = useCallback(async (
    payload: {
      sale_id: number;
      payment_method_id: number;
      amount: number;
      amount_converted: number;
      bcv_currency_id?: number;
      origin_bank: string;
      origin_mobile_number: string;
      type_document: number;
      document: number;
      token_otp: string | number;
    }
  ) => {
    setLoadingSubmission(true);
    setErrorSubmission(null);
    setSubmissionResult(null);

    try {
      const response = await api.post('/payments/process', payload);
      const data = response.data?.data || response.data;
      setSubmissionResult(data);
      return data;
    } catch (err: any) {
      setErrorSubmission('Error al procesar el cobro.');
      throw err;
    } finally {
      setLoadingSubmission(false);
    }
  }, []);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoadingMethods(true);
      const response = await api.post('/methodsPay/list');

      const filteredData: PaymentMethod[] = response.data.filter((method: PaymentMethod) => method.type === 2 || method.type === 3);

      setPaymentMethods(filteredData);
    } catch (err: any) {
      console.error('Error fetching payment methods:', err);
      setErrorMethods('Error al cargar los métodos de pago.');
    } finally {
      setLoadingMethods(false);
    }
  }, []);

  const fetchPaymentsHistory = useCallback(async () => {
    if (!user?.customers_id || !user?.token) {
      setErrorHistory('User or token not available.');
      setLoadingHistory(false);
      return;
    }

    const customerId = user.customers_id;
    const token = user.token;

    try {
      setLoadingHistory(true);
      const response = await api.get(`/${customerId}/payment-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const paymentsData = response.data.data.historial_pagos.map((payment: any) => ({
        id: String(payment.id),
        date: new Date(payment.created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        description: `Orden #${payment.sale_code} - ${payment.payment_method?.name ?? 'Método no disponible'}`,
        amount: -parseFloat(payment.amount),
      }));
      setMovements(paymentsData);
    } catch (err: any) {
      console.error('API error fetching payments history:', err.message);
      setErrorHistory('Error fetching payments history.');
    } finally {
      setLoadingHistory(false);
    }
  }, [user]);

  const fetchPaymentDetailById = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setErrorDetail(null);
    setPaymentDetail(null);

    try {
      const response = await api.post('/payments/view', { payment_id: Number(id) });
      setPaymentDetail(response.data as PaymentDetail);
    } catch (err: any) {
      console.error('Error fetching payment detail:', err);
      setErrorDetail('Error al cargar los detalles del pago.');
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const fetchPaymentMethodDetails = useCallback(async (payment_method_id: number, currency_sale: number) => {
    setLoadingMethodDetails(true);
    setErrorMethodDetails(null);
    setPaymentMethodDetails(null);

    try {
      const payload = {
        payment_method_id,
        currency_sale,
      };

  const response = await api.post('/methodsPay/details', payload);

      const raw = response.data?.data || response.data;

      try {
        const details = { ...raw };
        if (details?.payment_methods?.fields_front && typeof details.payment_methods.fields_front === 'string') {
          try {
            details.payment_methods.fields_front = JSON.parse(details.payment_methods.fields_front);
          } catch (e) {
            console.warn('Could not parse fields_front JSON string:', e);
          }
        }

        setPaymentMethodDetails(details);
      } catch (e) {
        console.error('Error normalizing payment method details:', e);
        setPaymentMethodDetails(raw);
      }
    } catch (err: any) {
      console.error('Error fetching payment method details:', err);
      setErrorMethodDetails('Error al cargar los detalles del método de pago.');
    } finally {
      setLoadingMethodDetails(false);
    }
  }, []);

  const submitPaymentMethodForm = useCallback(async (
    payment_method_id: number,
    formPayload: Record<string, any>,
    currency_sale?: number
  ) => {
    setLoadingSubmission(true);
    setErrorSubmission(null);
    setSubmissionResult(null);

    try {
      const payload: any = {
        payment_method_id,
        ...formPayload,
      };

      if (typeof currency_sale !== 'undefined') payload.currency_sale = currency_sale;

      const response = await api.post('/payments/process', payload);

      const data = response.data?.data || response.data;
      setSubmissionResult(data);
      return data;
    } catch (err: any) {
      console.error('Error submitting payment method form:', err);
      setErrorSubmission('Error al enviar los datos del formulario.');
      throw err;
    } finally {
      setLoadingSubmission(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
    fetchPaymentsHistory();
  }, [fetchPaymentMethods, fetchPaymentsHistory]);

  return {
    paymentMethods,
    movements,
    paymentDetail,
    loadingMethods,
    loadingHistory,
    loadingDetail,
    errorMethods,
    errorHistory,
    errorDetail,
    fetchPaymentMethods,
    fetchPaymentsHistory,
    fetchPaymentDetailById,
    // new
    paymentMethodDetails,
    loadingMethodDetails,
    errorMethodDetails,
    fetchPaymentMethodDetails,
    // submission
    submitPaymentMethodForm,
    submissionResult,
    loadingSubmission,
    errorSubmission,
    requestDebitOtp,
    chargeDebit,
  };
};