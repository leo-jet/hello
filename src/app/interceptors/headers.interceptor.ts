import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Headers interceptor that adds common headers to all requests
 */
export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  // Add common headers to all requests
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  return next(modifiedReq);
};
