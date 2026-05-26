import { apiGet } from './client';
import type {
  ApiResponse,
  ApiPaginatedResponse,
  ApiDoctorPreview,
  ApiDoctorDetail,
  ApiCalendarDay,
  ApiReview,
  ApiService,
} from '@/shared/mock';

export function getProfessionals(params?: {
  specialist_id?: number;
  specialist_ids?: number[];
  organization_id?: number;
  service_id?: number;
  service_ids?: number[];
  search?: string;
  page?: number;
  limit?: number;
  availability_limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.specialist_id) qs.set('specialist_id', String(params.specialist_id));
  if (params?.specialist_ids?.length) qs.set('specialist_ids', params.specialist_ids.join(','));
  if (params?.organization_id) qs.set('organization_id', String(params.organization_id));
  if (params?.service_id) qs.set('service_id', String(params.service_id));
  if (params?.service_ids?.length) qs.set('service_ids', params.service_ids.join(','));
  if (params?.search) qs.set('search', params.search);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.availability_limit) qs.set('availability_limit', String(params.availability_limit));
  const query = qs.toString() ? `?${qs}` : '';
  return apiGet<ApiPaginatedResponse<ApiDoctorPreview[]>>(`/professionals/${query}`);
}

export interface AvailableTimesResponse {
  date: string;
  duration_min: number;
  times: string[];
}

export function getProfessionalAvailableTimes(
  id: number | string,
  params: { date: string; service_ids: number[] },
) {
  const qs = new URLSearchParams();
  qs.set('date', params.date);
  qs.set('service_ids', params.service_ids.join(','));
  return apiGet<AvailableTimesResponse>(`/professionals/${id}/available-times/?${qs}`);
}

export function getProfessionalAvailableServices(
  id: number | string,
  params: { date: string; time: string },
) {
  const qs = new URLSearchParams();
  qs.set('date', params.date);
  qs.set('time', params.time);
  return apiGet<ApiResponse<ApiService[]>>(`/professionals/${id}/available-services/?${qs}`);
}

export function getProfessionalById(id: number | string) {
  return apiGet<ApiResponse<ApiDoctorDetail>>(`/professionals/${id}/`);
}

export function getProfessionalCalendar(id: number | string) {
  return apiGet<ApiResponse<ApiCalendarDay[]>>(`/professionals/${id}/calendar/`);
}

export function getProfessionalReviews(id: number | string, page = 1) {
  return apiGet<ApiPaginatedResponse<ApiReview[]>>(
    `/professionals/${id}/reviews/?page=${page}`,
  );
}
