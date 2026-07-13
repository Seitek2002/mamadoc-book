import { apiGet } from './client';
import type { ApiResponse, ApiPaginatedResponse, ApiBranch, ApiDoctorPreview } from '@/shared/mock';

export function getBranches() {
  return apiGet<ApiResponse<ApiBranch[]>>('/branches/');
}

export function getBranchById(branchId: number | string) {
  return apiGet<ApiResponse<ApiBranch>>(`/branches/${branchId}/`);
}

export function getBranchProfessionals(
  branchId: number | string,
  params?: {
    limit?: number;
    page?: number;
    availability_limit?: number;
    specialist_id?: number;
    search?: string;
  },
) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.page) qs.set('page', String(params.page));
  if (params?.availability_limit) qs.set('availability_limit', String(params.availability_limit));
  if (params?.specialist_id) qs.set('specialist_id', String(params.specialist_id));
  if (params?.search) qs.set('search', params.search);
  const query = qs.toString() ? `?${qs}` : '';
  return apiGet<ApiPaginatedResponse<ApiDoctorPreview[]>>(`/branches/${branchId}/professionals/${query}`);
}
