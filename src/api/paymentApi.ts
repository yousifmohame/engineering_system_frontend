// src/api/paymentApi.ts
import { api } from './axiosConfig';

export interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentFor: string;
  isFollowUpFee: boolean;
  notes?: string;
  receiptImage?: string;
  status: string;
  transactionId: string; // This might be the Code or UUID depending on backend
  transactionTitle?: string;
  clientName: string;
  receivedBy: string;
}

export const paymentApi = {
  // Fetch all cash payments
  getAllCashPayments: async (): Promise<Payment[]> => {
    const response = await api.get('/payments/cash');
    return response.data;
  },

  // Fetch payments for a specific transaction
  getPaymentsByTransaction: async (transactionId: string): Promise<Payment[]> => {
    const response = await api.get(`/payments/transaction/${transactionId}`);
    return response.data;
  },

  // Create a new cash payment
  createCashPayment: async (formData: FormData) => {
    const response = await api.post('/payments/cash', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
};