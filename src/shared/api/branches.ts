import { apiGet } from './client';
import type { ApiResponse, ApiBranch } from '@/shared/mock';

export function getBranches() {
  return apiGet<ApiResponse<ApiBranch[]>>('/branches/');
}
