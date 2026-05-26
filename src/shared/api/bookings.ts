import { apiPost, apiGet, apiDelete } from './client';

export interface CreateBookingRequest {
  professional_id: number;
  date: string;
  time: string;
  service_ids: number[];
}

export interface BookingService {
  name: string;
  price: number;
}

export interface BookingProfessional {
  full_name: string;
  photo_url: string;
  specialty: string;
  clinic_address: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface BookingResult {
  id: number;
  confirmation_code: string;
  organization_id: number | null;
  branch_id: number | null;
  professional: BookingProfessional;
  date: string;
  time: string;
  services: BookingService[];
  total_price: number;
  status: BookingStatus;
}

export interface BookingCreateResponse {
  data: BookingResult;
}

export interface MyBooking {
  id: number;
  confirmation_code: string;
  professional_name: string;
  date: string;
  time: string;
  status?: BookingStatus;
  total_price?: number | null;
}

export interface MyBookingsResponse {
  data: MyBooking[];
}

export function createBooking(body: CreateBookingRequest, token: string) {
  return apiPost<BookingCreateResponse>('/bookings/', body, token);
}

export function getMyBookings(token: string) {
  return apiGet<MyBookingsResponse>('/bookings/my/', { token });
}

export function cancelBooking(bookingId: number, token: string) {
  return apiDelete<{ message: string }>(`/bookings/${bookingId}/`, token);
}
