import { apiGet } from './client';
import type { ApiResponse, ApiSpecialist } from '@/shared/mock';

export function getSpecialists() {
  return apiGet<ApiResponse<ApiSpecialist[]>>('/specialists/');
}

export function getBranchSpecialists(branchId: number | string) {
  return apiGet<ApiResponse<ApiSpecialist[]>>(`/branches/${branchId}/specialists/`);
}
