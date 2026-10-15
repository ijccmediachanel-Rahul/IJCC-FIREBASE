'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

// Filter Sanity Studio's internal harmless React warnings from triggering Next.js dev overlay
if (typeof window !== 'undefined') {
  const origConsoleError = console.error;
  const origConsoleWarn = console.warn;

  const shouldSuppress = (args: any[]) => {
    try {
      const fullMessage = args
        .map((a) => {
          if (typeof a === 'string') return a;
          if (a instanceof Error) return a.message + ' ' + (a.stack || '');
          if (typeof a === 'object') return JSON.stringify(a);
          return String(a);
        })
        .join(' ');

      return (
        fullMessage.includes('disableTransition') ||
        fullMessage.includes('disabletransition') ||
        fullMessage.includes('React does not recognize the `disableTransition`')
      );
    } catch {
      return false;
    }
  };

  console.error = (...args: any[]) => {
    if (shouldSuppress(args)) {
      return;
    }
    origConsoleError(...args);
  };

  console.warn = (...args: any[]) => {
    if (shouldSuppress(args)) {
      return;
    }
    origConsoleWarn(...args);
  };
}

export default function StudioPage() {
  return <NextStudio config={config} />;
}
