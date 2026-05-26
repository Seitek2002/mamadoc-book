import { apiGet } from './client';
import type { ApiPhoneCountry } from '@/shared/mock';

export function getPhoneCountries() {
  return apiGet<ApiPhoneCountry[]>('/meta/phone-countries/', { revalidate: 86400 });
}
