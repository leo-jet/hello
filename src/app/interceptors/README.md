# Interceptors

This folder contains HTTP interceptors for handling cross-cutting concerns in HTTP requests and responses.

## Available Interceptors

### Authentication Interceptor (`auth.interceptor.ts`)
- Automatically adds JWT token to outgoing requests
- Retrieves token from localStorage
- Adds Authorization header with Bearer token

### Error Interceptor (`error.interceptor.ts`)
- Handles HTTP errors globally
- Maps error status codes to user-friendly messages
- Redirects to login on 401 unauthorized
- Logs errors for debugging

### Loading Interceptor (`loading.interceptor.ts`)
- Tracks HTTP requests for loading indicators
- Logs request start/completion times
- Can be extended with loading service integration

### Logging Interceptor (`logging.interceptor.ts`)
- Logs all HTTP requests and responses
- Includes request headers, body, and timing
- Groups related logs for better debugging

### Retry Interceptor (`retry.interceptor.ts`)
- Automatically retries failed GET requests
- Uses exponential backoff strategy
- Configurable retry count (default: 3)

### Timeout Interceptor (`timeout.interceptor.ts`)
- Adds timeout to HTTP requests
- Default timeout: 30 seconds
- Supports custom timeout via X-Timeout header

### Headers Interceptor (`headers.interceptor.ts`)
- Adds common headers to all requests
- Sets Content-Type, Accept, and cache control headers
- Configurable for different request types

## Usage

To use these interceptors in your application, add them to your `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { 
  authInterceptor, 
  errorInterceptor, 
  loadingInterceptor,
  loggingInterceptor,
  retryInterceptor,
  timeoutInterceptor,
  headersInterceptor
} from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        headersInterceptor,
        authInterceptor,
        timeoutInterceptor,
        retryInterceptor,
        loadingInterceptor,
        loggingInterceptor,
        errorInterceptor
      ])
    ),
    // ... other providers
  ]
};
```

## Interceptor Order

The order of interceptors matters. The recommended order is:
1. Headers Interceptor - Set common headers
2. Auth Interceptor - Add authentication
3. Timeout Interceptor - Set request timeout
4. Retry Interceptor - Handle retries
5. Loading Interceptor - Track requests
6. Logging Interceptor - Log activity
7. Error Interceptor - Handle errors (should be last)

## Customization

Each interceptor can be customized for your specific needs:
- Modify timeout values
- Change retry strategies
- Add custom headers
- Integrate with your services (loading, notification, etc.)
- Add environment-specific configurations