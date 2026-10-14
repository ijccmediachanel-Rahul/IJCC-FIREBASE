'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

// Filter Sanity's internal harmless sortable list warning from triggering Next.js dev overlay
if (typeof window !== 'undefined') {
  const origConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('disableTransition')
    ) {
      return;
    }
    origConsoleError(...args);
  };
}

export default function StudioPage() {
  return <NextStudio config={config} />;
}
