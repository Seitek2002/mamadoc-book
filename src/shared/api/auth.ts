import { apiPost } from './client';

export interface SendOtpRequest {
  phone: string;
  full_name: string;
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
  needs_profile: boolean;
  is_new_patient: boolean;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  phone?: string;
  code?: string;
  message?: string;
}

export interface CompleteProfileRequest {
  phone: string;
  full_name?: string;
  inn?: number | null;
  birth_date?: string;
  gender?: string;
  nickname?: string;
  telegram?: string;
  instagram?: string;
}

export interface CompleteProfileResponse {
  access_token: string;
  token_type: string;
}

export function sendOtp(body: SendOtpRequest) {
  return apiPost<SendOtpResponse>('/auth/send-otp/', body);
}

export function verifyOtp(body: VerifyOtpRequest) {
  return apiPost<VerifyOtpResponse>('/auth/verify-otp/', body);
}

export function completeProfile(body: CompleteProfileRequest, token: string) {
  return apiPost<CompleteProfileResponse>('/auth/complete-profile/', body, token);
}
