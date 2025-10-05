# Environment Configuration

This folder contains environment-specific configurations for different deployment stages.

## Directory Structure

```
src/environments/
├── environment.interface.ts    # Environment interface definition
├── environment.ts             # Development environment (default)
├── environment.prod.ts        # Production environment
├── environment.staging.ts     # Staging environment
├── environment.test.ts        # Test environment
├── environment.service.ts     # Service for accessing environment config
├── index.ts                  # Barrel exports
└── README.md                 # This documentation
```

## Environment Files

### Development (`environment.ts`)
- **Default environment** used during `ng serve`
- Enables logging and experimental features
- Uses local API endpoints
- Longer session timeouts for development convenience

### Production (`environment.prod.ts`)
- **Production environment** used for live deployments
- Disables logging and experimental features
- Uses production API endpoints
- Shorter session timeouts for security

### Staging (`environment.staging.ts`)
- **Pre-production environment** for testing
- Mix of production and development settings
- Uses staging API endpoints
- Enables most features for testing

### Test (`environment.test.ts`)
- **Testing environment** for automated tests
- Minimal features enabled
- Uses test/mock API endpoints
- Fast cache expiration for test isolation

## Environment Interface

All environments implement the `Environment` interface:

```typescript
interface Environment {
  production: boolean;
  name: string;
  apiUrl: string;
  apiVersion: string;
  features: {
    enableLogging: boolean;
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableExperimentalFeatures: boolean;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    sessionTimeout: number;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    pageSize: number;
  };
  external: {
    googleAnalyticsId?: string;
    sentryDsn?: string;
    stripePublicKey?: string;
  };
  cache: {
    ttl: number;
    maxSize: number;
  };
}
```

## Usage Examples

### Direct Import
```typescript
import { environment } from '../environments/environment';

console.log('API URL:', environment.apiUrl);
console.log('Is Production:', environment.production);
```

### Using Environment Service (Recommended)
```typescript
import { EnvironmentService } from '../environments/environment.service';

@Component({...})
export class MyComponent {
  constructor(private envService: EnvironmentService) {}

  ngOnInit() {
    // Check environment
    if (this.envService.isProduction) {
      // Production-specific logic
    }

    // Get API URL
    const apiUrl = this.envService.fullApiUrl;

    // Check feature flags
    if (this.envService.isFeatureEnabled('enableAnalytics')) {
      // Initialize analytics
    }

    // Get configuration
    const pageSize = this.envService.uiConfig.pageSize;
    const sessionTimeout = this.envService.authConfig.sessionTimeout;
  }
}
```

### Feature Flags
```typescript
import { EnvironmentService } from '../environments/environment.service';

@Injectable()
export class FeatureService {
  constructor(private envService: EnvironmentService) {}

  canShowExperimentalFeatures(): boolean {
    return this.envService.isFeatureEnabled('enableExperimentalFeatures');
  }

  shouldLogToConsole(): boolean {
    return this.envService.isFeatureEnabled('enableLogging');
  }
}
```

### HTTP Interceptor
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { EnvironmentService } from '../environments/environment.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private envService: EnvironmentService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Add base URL for relative requests
    if (!req.url.startsWith('http')) {
      const apiReq = req.clone({
        url: `${this.envService.fullApiUrl}/${req.url}`
      });
      return next.handle(apiReq);
    }
    return next.handle(req);
  }
}
```

## Build Configuration

To use different environments during build, configure `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            },
            "staging": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.staging.ts"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## Build Commands

```bash
# Development (default)
ng build

# Production
ng build --configuration production

# Staging
ng build --configuration staging

# Serve with specific environment
ng serve --configuration staging
```

## Security Considerations

1. **Never commit sensitive data** like API keys or secrets
2. **Use environment variables** for sensitive production values
3. **Different keys per environment** to prevent accidental cross-environment usage
4. **Validate environment** values at application startup

## Best Practices

1. **Use the EnvironmentService** instead of direct imports for better testability
2. **Define clear feature flags** to control functionality per environment
3. **Keep environment files in sync** - ensure all have the same structure
4. **Document environment-specific behavior** in code comments
5. **Test with different environments** during development

## Adding New Configuration

1. Update the `Environment` interface in `environment.interface.ts`
2. Add the new property to all environment files
3. Update the `EnvironmentService` if needed
4. Add documentation to this README