import { apiPost, apiGet, apiDelete } from './client';

export interface CreateBookingRequest {
  doctor_id: number;
  date: string;
  time: string;
  service_ids: number[];
}

export interface BookingService {
  name: string;
  price: number;
}

export interface BookingDoctor {
  full_name: string;
  photo_url: string;
  specialty: string;
  clinic_address: string;
}

export interface BookingResult {
  id: number;
  confirmation_code: string;
  doctor: BookingDoctor;
  date: string;
  time: string;
  services: BookingService[];
  total_price: number;
  status: string;
}

export interface BookingCreateResponse {
  data: BookingResult;
}

export interface MyBooking {
  id: number;
  confirmation_code: string;
  doctor_name: string;
  date: string;
  time: string;
  status: string;
  total_price: number;
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
