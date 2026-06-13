'use client';

import { useEffect } from 'react';

import { logSaloWebBuildVersion } from '@/lib/buildVersion';

export default function BuildVersionLogger() {
  useEffect(() => {
    logSaloWebBuildVersion();
  }, []);

  return null;
}
