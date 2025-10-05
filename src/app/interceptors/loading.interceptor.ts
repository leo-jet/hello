import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

/**
 * Loading interceptor that tracks HTTP requests to show/hide loading indicators
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // You can inject a loading service here if you have one
  // const loadingService = inject(LoadingService);

  console.log(`Starting request to ${req.url}`);
  const startTime = Date.now();

  // Increment loading counter
  // loadingService.increment();

  return next(req).pipe(
    finalize(() => {
      const duration = Date.now() - startTime;
      console.log(`Request to ${req.url} completed in ${duration}ms`);

      // Decrement loading counter
      // loadingService.decrement();
    })
  );
};
