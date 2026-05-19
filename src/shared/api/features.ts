import { apiGet } from './client';
import type { ApiFeatureFlags } from '@/shared/mock';

export function getFeatures() {
  return apiGet<ApiFeatureFlags>('/v1/features/', { revalidate: 3600 });
}
