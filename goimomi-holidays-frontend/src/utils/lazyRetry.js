import { lazy } from 'react';

/**
 * A wrapper for React.lazy that retries the import if it fails.
 * This is useful for handling chunk load errors after a new deployment.
 */
export const lazyRetry = (componentImport) => {
  return lazy(async () => {
    const chunkErrorKey = 'last-chunk-error-timestamp';
    
    try {
      return await componentImport();
    } catch (error) {
      const now = Date.now();
      const lastErrorTimestamp = sessionStorage.getItem(chunkErrorKey);
      
      // If we haven't retried in the last 10 seconds, try a reload
      if (!lastErrorTimestamp || (now - parseInt(lastErrorTimestamp)) > 10000) {
        sessionStorage.setItem(chunkErrorKey, now.toString());
        
        console.warn('Chunk load failed. Retrying with page reload...', error);
        
        // Force reload from server
        window.location.reload();
        
        // Return a promise that never resolves to stop execution while reloading
        return new Promise(() => {});
      }

      // If we already retried recently and it still fails, let the error bubble up to ErrorBoundary
      throw error;
    }
  });
};

