import { apiGet } from './client';
import type {
  ApiResponse,
  ApiPaginatedResponse,
  ApiDoctorPreview,
  ApiDoctorDetail,
  ApiCalendarDay,
  ApiReview,
} from '@/shared/mock';

export function getProfessionals(params?: { specialist_id?: number; search?: string; page?: number }) {
  const qs = new URLSearchParams();
  if (params?.specialist_id) qs.set('specialist_id', String(params.specialist_id));
  if (params?.search) qs.set('search', params.search);
  if (params?.page) qs.set('page', String(params.page));
  const query = qs.toString() ? `?${qs}` : '';
  return apiGet<ApiPaginatedResponse<ApiDoctorPreview[]>>(`/v1/professionals/${query}`);
}

export function getProfessionalById(id: number | string) {
  return apiGet<ApiResponse<ApiDoctorDetail>>(`/v1/professionals/${id}/`);
}

export function getProfessionalCalendar(id: number | string) {
  return apiGet<ApiResponse<ApiCalendarDay[]>>(`/v1/professionals/${id}/calendar/`);
}

export function getProfessionalReviews(id: number | string, page = 1) {
  return apiGet<ApiPaginatedResponse<ApiReview[]>>(
    `/v1/professionals/${id}/reviews/?page=${page}`,
  );
}
