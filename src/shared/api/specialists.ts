import { apiGet } from './client';
import type { ApiResponse, ApiSpecialist } from '@/shared/mock';

export function getSpecialists() {
  return apiGet<ApiResponse<ApiSpecialist[]>>('/specialists/');
}
