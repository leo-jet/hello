import { HttpInterceptorFn } from '@angular/common/http';
import { delay, retry, timer } from 'rxjs';

/**
 * Retry interceptor that automatically retries failed requests
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // Only retry GET requests to avoid side effects
  if (req.method === 'GET') {
    return next(req).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          console.log(`Retrying request to ${req.url} (attempt ${retryCount})`);
          // Exponential backoff: 1s, 2s, 4s
          return timer(Math.pow(2, retryCount - 1) * 1000);
        }
      })
    );
  }

  return next(req);
};
