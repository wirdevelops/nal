import { useCallback, useState } from 'react';
import type { PaymentMethodDetails } from '@/types/store';
import { toast } from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'stripe';
  last4?: string;
  brand?: string;
  isDefault: boolean;
  expiryDate?: string;
}

interface UsePaymentHook {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
  addPaymentMethod: (details: PaymentMethodDetails) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  setDefaultMethod: (id: string) => Promise<void>;
  selectPaymentMethod: (id: string) => void;
  validatePaymentDetails: (details: PaymentMethodDetails) => boolean;
  processPayment: (amount: number, currency: string) => Promise<void>;
  getPaymentHistory: () => Promise<void>;
}

export function usePayment(): UsePaymentHook {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsyncOperation = useCallback(async (
    operation: () => Promise<void>,
    errorMessage: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await operation();
    } catch (err) {
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPaymentMethod = useCallback(async (details: PaymentMethodDetails) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch('/api/payment-methods', {
      //   method: 'POST',
      //   body: JSON.stringify(details)
      // });
      // const newMethod = await response.json();
      
      const newMethod: PaymentMethod = {
        id: crypto.randomUUID(),
        type: details.gateway as 'credit_card' | 'paypal' | 'stripe',
        last4: details.last4,
        brand: details.brand,
        isDefault: paymentMethods.length === 0,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setPaymentMethods(prev => [...prev, newMethod]);
      toast.success('Payment method added');
    }, 'Failed to add payment method');
  }, [handleAsyncOperation, paymentMethods]);

  const removePaymentMethod = useCallback(async (id: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' });
      
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      if (selectedMethod?.id === id) {
        setSelectedMethod(null);
      }
      toast.success('Payment method removed');
    }, 'Failed to remove payment method');
  }, [handleAsyncOperation, selectedMethod]);

  const setDefaultMethod = useCallback(async (id: string) => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // await fetch(`/api/payment-methods/${id}/default`, { method: 'POST' });
      
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === id
      })));
      toast.success('Default payment method updated');
    }, 'Failed to set default payment method');
  }, [handleAsyncOperation]);

  const selectPaymentMethod = useCallback((id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method) {
      setSelectedMethod(method);
    }
  }, [paymentMethods]);

  const validatePaymentDetails = useCallback((details: PaymentMethodDetails): boolean => {
    // Basic validation - expand based on payment type
    return !!(details.gateway && details.transactionId);
  }, []);

  const processPayment = useCallback(async (amount: number, currency: string) => {
    if (!selectedMethod) {
      throw new Error('No payment method selected');
    }

    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch('/api/payments', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     methodId: selectedMethod.id,
      //     amount,
      //     currency
      //   })
      // });
      
      toast.success(`Payment processed: ${amount} ${currency}`);
    }, 'Payment failed');
  }, [handleAsyncOperation, selectedMethod]);

  const getPaymentHistory = useCallback(async () => {
    await handleAsyncOperation(async () => {
      // Later: API integration
      // const response = await fetch('/api/payments/history');
      // return await response.json();
    }, 'Failed to fetch payment history');
  }, [handleAsyncOperation]);

  return {
    paymentMethods,
    selectedMethod,
    isLoading,
    error,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultMethod,
    selectPaymentMethod,
    validatePaymentDetails,
    processPayment,
    getPaymentHistory
  };
}