import { lazy } from 'react';

/**
 * A wrapper for React.lazy that retries the import if it fails.
 * This is useful for handling chunk load errors after a new deployment.
 */
export const lazyRetry = (componentImport) => {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Log the error to the console for debugging
        console.error('Lazy import failed, attempting page reload:', error);
        
        // Mark that we've already refreshed to avoid infinite loops
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        
        // Reload the page
        window.location.reload();
        return;
      }

      // If we already refreshed and it still fails, throw the error
      // The ErrorBoundary will catch it and show the error UI
      throw error;
    }
  });
};
