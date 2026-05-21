import { apiGet } from './client';
import type {
  ApiResponse,
  ApiOrganizationPreview,
  ApiOrganizationDetail,
  ApiBranch,
  ApiService,
  ApiDoctorPreview,
} from '@/shared/mock';

export function getOrganizations() {
  return apiGet<ApiResponse<ApiOrganizationPreview[]>>('/organizations/', {
    revalidate: 300,
  });
}

export function getOrganizationById(id: number | string) {
  return apiGet<ApiResponse<ApiOrganizationDetail>>(`/organizations/${id}/`);
}

export function getOrganizationBranches(id: number | string) {
  return apiGet<ApiResponse<ApiBranch[]>>(`/organizations/${id}/branches/`);
}

export function getOrganizationServices(id: number | string) {
  return apiGet<ApiResponse<ApiService[]>>(`/organizations/${id}/services/`, {
    revalidate: 300,
  });
}

export function getOrganizationProfessionals(
  id: number | string,
  params?: { limit?: number; page?: number; availability_limit?: number },
) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.page) qs.set('page', String(params.page));
  if (params?.availability_limit) qs.set('availability_limit', String(params.availability_limit));
  const query = qs.toString() ? `?${qs}` : '';
  return apiGet<ApiResponse<ApiDoctorPreview[]>>(
    `/organizations/${id}/professionals/${query}`,
  );
}
