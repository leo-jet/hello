import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

/**
 * Authentication interceptor that adds JWT token to outgoing requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage or a service
  const token = localStorage.getItem('authToken');

  if (token) {
    // Clone the request and add authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};
