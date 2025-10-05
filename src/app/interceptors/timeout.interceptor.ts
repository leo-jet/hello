import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs';

/**
 * Timeout interceptor that adds timeout to HTTP requests
 */
export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  // Default timeout of 30 seconds
  const timeoutDuration = 30000;
  
  // Check if request has custom timeout header
  const customTimeout = req.headers.get('X-Timeout');
  const requestTimeout = customTimeout ? parseInt(customTimeout, 10) : timeoutDuration;
  
  return next(req).pipe(
    timeout(requestTimeout)
  );
};