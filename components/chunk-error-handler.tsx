'use client';

import { useEffect } from 'react';

export function ChunkErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.error?.name === 'ChunkLoadError' ||
        event.message?.includes('Loading chunk') ||
        event.message?.includes('ChunkLoadError')
      ) {
        console.log('[BEAGVS] ChunkLoadError detected, reloading...');
        window.location.reload();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason?.name === 'ChunkLoadError' ||
        reason?.message?.includes('Loading chunk') ||
        reason?.message?.includes('ChunkLoadError')
      ) {
        console.log('[BEAGVS] ChunkLoadError (promise) detected, reloading...');
        window.location.reload();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
