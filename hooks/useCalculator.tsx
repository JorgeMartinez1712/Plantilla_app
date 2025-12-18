import { useState, useEffect, useCallback } from 'react';
import api from '../constants/api';

export interface Product {
  id: number;
  name: string;
  base_price: string;
  retailer: {
    id: number;
    comercial_name: string;
  };
}

export interface FinancingPlan {
  id: number;
  name: string;
  interest_rate: string;
  min_down_payment_rate: string | null;
  min_down_payment_fixed: string | null;
  max_financing_amount: string;
  cuotas: string;
}

export interface CalculationResult {
  totalFinanced: number;
  monthlyPayment: number;
  totalToPay: number;
  initialPayment: number;
  capital: number;
  interest: number;
  isFinancingPossible: boolean;
  financingLimitExceeded: boolean;
  maxFinancingAllowed: number;
}

export function useFinancier() {
  const [products, setProducts] = useState<Product[]>([]);
  const [financingPlans, setFinancingPlans] = useState<FinancingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/product');
      setProducts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFinancingPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/financier');
      setFinancingPlans(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar planes de financiamiento.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchFinancingPlans();
  }, [fetchProducts, fetchFinancingPlans]);

  const calculateFinancing = useCallback((
    productPrice: number,
    selectedPlan: FinancingPlan | null,
    installments: number,
    initialPaymentAmount: number
  ): CalculationResult | null => {
    if (!selectedPlan || productPrice <= 0 || installments <= 0) {
      return null;
    }

    const interestRate = parseFloat(selectedPlan.interest_rate) / 100;
    const maxFinancingAllowed = parseFloat(selectedPlan.max_financing_amount);

    let actualInitialPayment = initialPaymentAmount;

    if (selectedPlan.min_down_payment_rate && productPrice > 0) {
      const minRatePayment = (parseFloat(selectedPlan.min_down_payment_rate) / 100) * productPrice;
      actualInitialPayment = Math.max(actualInitialPayment, minRatePayment);
    } else if (selectedPlan.min_down_payment_fixed) {
      const minFixedPayment = parseFloat(selectedPlan.min_down_payment_fixed);
      actualInitialPayment = Math.max(actualInitialPayment, minFixedPayment);
    }

    let amountToFinance = productPrice - actualInitialPayment;

    if (amountToFinance < 0) {
      amountToFinance = 0;
      actualInitialPayment = productPrice;
    }

    const financingLimitExceeded = amountToFinance > maxFinancingAllowed;
    const isFinancingPossible = !financingLimitExceeded && amountToFinance > 0;

    let monthlyPayment = 0;
    let totalInterest = 0;

    let effectiveAmountToFinance = amountToFinance;
    if (financingLimitExceeded) {
      effectiveAmountToFinance = 0;
    }

    if (effectiveAmountToFinance > 0 && installments > 0) {
      if (interestRate > 0) {
        monthlyPayment = effectiveAmountToFinance * (interestRate * Math.pow(1 + interestRate, installments)) / (Math.pow(1 + interestRate, installments) - 1);
      } else {
        monthlyPayment = effectiveAmountToFinance / installments;
      }
      totalInterest = (monthlyPayment * installments) - effectiveAmountToFinance;
    }

    const totalFinanced = effectiveAmountToFinance;
    const totalToPay = totalFinanced + totalInterest;

    return {
      totalFinanced: parseFloat(totalFinanced.toFixed(2)),
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalToPay: parseFloat(totalToPay.toFixed(2)),
      initialPayment: parseFloat(actualInitialPayment.toFixed(2)),
      capital: parseFloat(totalFinanced.toFixed(2)),
      interest: parseFloat(totalInterest.toFixed(2)),
      isFinancingPossible: isFinancingPossible,
      financingLimitExceeded: financingLimitExceeded,
      maxFinancingAllowed: maxFinancingAllowed,
    };
  }, []);

  return {
    products,
    financingPlans,
    loading,
    error,
    fetchProducts,
    fetchFinancingPlans,
    calculateFinancing,
  };
}