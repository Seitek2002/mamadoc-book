import { apiGet } from './client';
import type {
  ApiResponse,
  ApiPaginatedResponse,
  ApiDoctorPreview,
  ApiDoctorDetail,
  ApiCalendarDay,
  ApiReview,
} from '@/shared/mock';

export function getDoctors(params?: { specialist_id?: number; search?: string; page?: number }) {
  const qs = new URLSearchParams();
  if (params?.specialist_id) qs.set('specialist_id', String(params.specialist_id));
  if (params?.search) qs.set('search', params.search);
  if (params?.page) qs.set('page', String(params.page));
  const query = qs.toString() ? `?${qs}` : '';
  return apiGet<ApiPaginatedResponse<ApiDoctorPreview[]>>(`/doctors/${query}`);
}

export function getDoctorById(id: number | string) {
  return apiGet<ApiResponse<ApiDoctorDetail>>(`/doctors/${id}/`);
}

export function getDoctorCalendar(id: number | string) {
  return apiGet<ApiResponse<ApiCalendarDay[]>>(`/doctors/${id}/calendar/`);
}

export function getDoctorReviews(id: number | string, page = 1) {
  return apiGet<ApiPaginatedResponse<ApiReview[]>>(
    `/doctors/${id}/reviews/?page=${page}`,
  );
}
