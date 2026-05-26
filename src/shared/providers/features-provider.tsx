'use client';

import { createContext, useContext } from 'react';
import type { ApiFeatureFlags } from '@/shared/mock';

const FeaturesContext = createContext<ApiFeatureFlags>({
  branches_enabled: false,
  paylink_enabled: false,
  paylink_by_organization: false,
  paylink_by_professional: false,
});

export const FeaturesProvider = ({
  features,
  children,
}: {
  features: ApiFeatureFlags;
  children: React.ReactNode;
}) => <FeaturesContext.Provider value={features}>{children}</FeaturesContext.Provider>;

export const useFeatures = () => useContext(FeaturesContext);
