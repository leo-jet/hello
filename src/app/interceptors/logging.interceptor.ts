import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 * Logging interceptor that logs all HTTP requests and responses
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  
  console.group(`🌐 HTTP ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  
  if (req.body) {
    console.log('Request body:', req.body);
  }
  
  return next(req).pipe(
    tap({
      next: (response) => {
        const duration = Date.now() - startTime;
        console.log(`✅ Response received in ${duration}ms:`, response);
        console.groupEnd();
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.log(`❌ Error received in ${duration}ms:`, error);
        console.groupEnd();
      }
    })
  );
};