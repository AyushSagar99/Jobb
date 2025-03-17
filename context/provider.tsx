'use client';

import React from 'react';
import { JobApplicationProvider } from './job-context';

export function JobApplicationProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <JobApplicationProvider>
      {children}
    </JobApplicationProvider>
  );
}