import { apiGet } from './client';
import type { ApiPhoneCountry } from '@/shared/mock';

export function getPhoneCountries() {
  return apiGet<ApiPhoneCountry[]>('/v1/meta/phone-countries/', { revalidate: 86400 });
}
