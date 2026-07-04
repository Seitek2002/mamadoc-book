import { apiPost } from './client';

export interface CreatePaylinkResponse {
  payment_intent_id: number;
  transaction_id: string;
  amount: number;
  paylink_url: string;
}

export function createPaylink(branchId: number, token?: string) {
  return apiPost<CreatePaylinkResponse>('/payments/paylink/', { branch_id: branchId }, token);
}
