import { apiPost } from './client';

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  message: string;
  expires_in: number;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface VerifyOtpResponse {
  access_token: string;
  token_type: string;
  is_new_patient: boolean;
}

export function sendOtp(body: SendOtpRequest) {
  return apiPost<SendOtpResponse>('/auth/send-otp/', body);
}

export function verifyOtp(body: VerifyOtpRequest) {
  return apiPost<VerifyOtpResponse>('/auth/verify-otp/', body);
}
