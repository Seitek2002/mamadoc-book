'use client';

import { useEffect } from 'react';

export function OrgCleaner() {
  useEffect(() => {
    localStorage.removeItem('selected_org');
    window.dispatchEvent(new CustomEvent('org-changed'));
  }, []);
  return null;
}
