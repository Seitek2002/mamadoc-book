import { apiGet } from './client';
import type { ApiFeatureFlags } from '@/shared/mock';

export function getFeatures() {
  return apiGet<ApiFeatureFlags>('/features/', { revalidate: 3600 });
}
