'use client';

import { useEffect } from 'react';

export function OrgCleaner() {
  useEffect(() => {
    localStorage.removeItem('selected_org');
  }, []);
  return null;
}
