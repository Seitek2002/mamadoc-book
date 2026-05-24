import { apiGet } from './client';
import type { ApiResponse, ApiPaginatedResponse, ApiBranch, ApiDoctorPreview } from '@/shared/mock';

export function getBranches() {
  return apiGet<ApiResponse<ApiBranch[]>>('/branches/');
}

export function getBranchProfessionals(
  branchId: number | string,
  params?: { limit?: number; page?: number; availability_limit?: number },
) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.page) qs.set('page', String(params.page));
  if (params?.availability_limit) qs.set('availability_limit', String(params.availability_limit));
  const query = qs.toString() ? `?${qs}` : '';
  return apiGet<ApiPaginatedResponse<ApiDoctorPreview[]>>(`/branches/${branchId}/professionals/${query}`);
}
