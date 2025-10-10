import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-browser';
import { BaseApiService } from './base-api.service';
import { ApiRequestConfig, ApiResponse } from '@app/models';
import { environment } from '../../environments/environment';

/**
 * MSAL Configuration Interface
 */
export interface MsalApiConfig {
  scopes?: string[];
  forceRefresh?: boolean;
}

/**
 * Base MSAL API Service
 * Extends BaseApiService to add MSAL authentication token handling
 * Automatically acquires and attaches Azure AD tokens to HTTP requests
 */
@Injectable({
  providedIn: 'root'
})
export class BaseMsalApiService extends BaseApiService {
  private readonly msalService = inject(MsalService);

  // Default MSAL scopes (can be overridden)
  protected readonly defaultScopes: string[] = environment.msalScopes || [
    'user.read',
    'openid',
    'profile'
  ];

  /**
   * GET request with MSAL authentication
   */
  protected getMsal<T>(
    endpoint: string,
    msalConfig?: MsalApiConfig,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.acquireTokenAndRequest<T>('GET', endpoint, null, msalConfig, config);
  }

  /**
   * POST request with MSAL authentication
   */
  protected postMsal<T>(
    endpoint: string,
    body: any,
    msalConfig?: MsalApiConfig,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.acquireTokenAndRequest<T>('POST', endpoint, body, msalConfig, config);
  }

  /**
   * PUT request with MSAL authentication
   */
  protected putMsal<T>(
    endpoint: string,
    body: any,
    msalConfig?: MsalApiConfig,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.acquireTokenAndRequest<T>('PUT', endpoint, body, msalConfig, config);
  }

  /**
   * PATCH request with MSAL authentication
   */
  protected patchMsal<T>(
    endpoint: string,
    body: any,
    msalConfig?: MsalApiConfig,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.acquireTokenAndRequest<T>('PATCH', endpoint, body, msalConfig, config);
  }

  /**
   * DELETE request with MSAL authentication
   */
  protected deleteMsal<T>(
    endpoint: string,
    msalConfig?: MsalApiConfig,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.acquireTokenAndRequest<T>('DELETE', endpoint, null, msalConfig, config);
  }

  /**
   * Acquire token silently and make HTTP request
   * Falls back to interactive authentication if silent acquisition fails
   */
  private acquireTokenAndRequest<T>(
    method: string,
    endpoint: string,
    body: any,
    msalConfig?: MsalApiConfig,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    const scopes = msalConfig?.scopes || this.defaultScopes;

    // Acquire token silently
    return from(
      this.msalService.instance.acquireTokenSilent({
        scopes: scopes,
        account: this.msalService.instance.getActiveAccount() || undefined,
        forceRefresh: msalConfig?.forceRefresh || false
      })
    ).pipe(
      switchMap((tokenResponse: AuthenticationResult) => {
        // Add token to headers
        const authConfig = this.addAuthorizationHeader(config, tokenResponse.accessToken);

        // Make the HTTP request
        switch (method.toUpperCase()) {
          case 'GET':
            return this.get<T>(endpoint, authConfig);
          case 'POST':
            return this.post<T>(endpoint, body, authConfig);
          case 'PUT':
            return this.put<T>(endpoint, body, authConfig);
          case 'PATCH':
            return this.patch<T>(endpoint, body, authConfig);
          case 'DELETE':
            return this.delete<T>(endpoint, authConfig);
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
      }),
      catchError((error) => {
        // Handle token acquisition errors
        if (error instanceof InteractionRequiredAuthError) {
          // If silent acquisition fails, try interactive acquisition
          return this.acquireTokenInteractive<T>(method, endpoint, body, scopes, config);
        }

        return throwError(() => error);
      })
    );
  }

  /**
   * Acquire token interactively (popup or redirect)
   */
  private acquireTokenInteractive<T>(
    method: string,
    endpoint: string,
    body: any,
    scopes: string[],
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return from(
      this.msalService.instance.acquireTokenPopup({
        scopes: scopes
      })
    ).pipe(
      switchMap((tokenResponse: AuthenticationResult) => {
        // Add token to headers
        const authConfig = this.addAuthorizationHeader(config, tokenResponse.accessToken);

        // Make the HTTP request
        switch (method.toUpperCase()) {
          case 'GET':
            return this.get<T>(endpoint, authConfig);
          case 'POST':
            return this.post<T>(endpoint, body, authConfig);
          case 'PUT':
            return this.put<T>(endpoint, body, authConfig);
          case 'PATCH':
            return this.patch<T>(endpoint, body, authConfig);
          case 'DELETE':
            return this.delete<T>(endpoint, authConfig);
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
      }),
      catchError((error) => {
        console.error('Interactive token acquisition failed:', error);
        return throwError(() => new Error('Authentication failed. Please try again.'));
      })
    );
  }

  /**
   * Add Authorization header with Bearer token
   */
  private addAuthorizationHeader(
    config?: ApiRequestConfig,
    accessToken?: string
  ): ApiRequestConfig {
    if (!accessToken) {
      return config || {};
    }

    // Create headers object with Authorization token
    const existingHeaders = config?.headers || {};
    const headers = {
      ...(typeof existingHeaders === 'object' && !(existingHeaders instanceof HttpHeaders)
        ? existingHeaders
        : {}),
      Authorization: `Bearer ${accessToken}`
    };

    return {
      ...config,
      headers
    };
  }

  /**
   * Get current MSAL account
   */
  protected getCurrentAccount() {
    return this.msalService.instance.getActiveAccount();
  }

  /**
   * Check if user is authenticated with MSAL
   */
  protected isMsalAuthenticated(): boolean {
    return this.msalService.instance.getActiveAccount() !== null;
  }

  /**
   * Get all MSAL accounts
   */
  protected getAllAccounts() {
    return this.msalService.instance.getAllAccounts();
  }

  /**
   * Set active MSAL account
   */
  protected setActiveAccount(account: any): void {
    this.msalService.instance.setActiveAccount(account);
  }

  /**
   * Login with MSAL (popup)
   */
  protected loginMsalPopup(scopes?: string[]): Observable<AuthenticationResult> {
    return from(
      this.msalService.instance.loginPopup({
        scopes: scopes || this.defaultScopes
      })
    );
  }

  /**
   * Login with MSAL (redirect)
   */
  protected loginMsalRedirect(scopes?: string[]): Observable<void> {
    return from(
      this.msalService.instance.loginRedirect({
        scopes: scopes || this.defaultScopes
      })
    );
  }

  /**
   * Logout from MSAL
   */
  protected logoutMsal(): Observable<void> {
    return from(this.msalService.instance.logoutPopup());
  }

  /**
   * Logout from MSAL (redirect)
   */
  protected logoutMsalRedirect(): Observable<void> {
    return from(this.msalService.instance.logoutRedirect());
  }

  /**
   * Acquire token silently (for manual use)
   */
  protected acquireTokenSilent(scopes?: string[]): Observable<AuthenticationResult> {
    return from(
      this.msalService.instance.acquireTokenSilent({
        scopes: scopes || this.defaultScopes,
        account: this.msalService.instance.getActiveAccount() || undefined
      })
    );
  }

  /**
   * Get access token synchronously (from cache)
   * Returns null if token is not available or expired
   */
  protected getAccessTokenSync(): string | null {
    const account = this.getCurrentAccount();
    if (!account) {
      return null;
    }

    try {
      const tokenCache = this.msalService.instance.getTokenCache();
      // Note: This is a simplified version. In production, you should properly check token expiration
      // and use acquireTokenSilent for guaranteed fresh tokens
      return null; // Return null to force proper async token acquisition
    } catch (error) {
      console.error('Error getting token from cache:', error);
      return null;
    }
  }

  /**
   * Create SSE (Server-Sent Events) connection with MSAL authentication
   * @param endpoint - The SSE endpoint URL
   * @param msalConfig - Optional MSAL configuration
   * @returns Observable that emits SSE messages
   */
  protected connectSSE<T = any>(
    endpoint: string,
    msalConfig?: MsalApiConfig
  ): Observable<T> {
    return new Observable(observer => {
      const scopes = msalConfig?.scopes || this.defaultScopes;
      let eventSource: EventSource | null = null;
      let isConnected = false;

      // Acquire token and establish SSE connection
      this.msalService.instance.acquireTokenSilent({
        scopes: scopes,
        account: this.msalService.instance.getActiveAccount() || undefined,
        forceRefresh: msalConfig?.forceRefresh || false
      }).then((tokenResponse: AuthenticationResult) => {
        const url = this.buildUrlWithToken(endpoint, tokenResponse.accessToken);

        try {
          eventSource = new EventSource(url);
          isConnected = true;

          // Handle incoming messages
          eventSource.onmessage = (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data);
              observer.next(data as T);
            } catch (error) {
              // If not JSON, emit raw data
              observer.next(event.data as T);
            }
          };

          // Handle connection open
          eventSource.onopen = () => {
            console.log('SSE connection established');
          };

          // Handle errors
          eventSource.onerror = (error: Event) => {
            console.error('SSE connection error:', error);

            if (eventSource?.readyState === EventSource.CLOSED) {
              observer.error(new Error('SSE connection closed'));
            } else {
              observer.error(new Error('SSE connection error'));
            }

            if (eventSource) {
              eventSource.close();
            }
          };

        } catch (error) {
          observer.error(error);
        }
      }).catch((error) => {
        // Handle token acquisition error
        if (error instanceof InteractionRequiredAuthError) {
          // Try interactive authentication
          this.msalService.instance.acquireTokenPopup({
            scopes: scopes
          }).then((tokenResponse: AuthenticationResult) => {
            const url = this.buildUrlWithToken(endpoint, tokenResponse.accessToken);
            this.establishSSEConnection(url, observer, eventSource);
          }).catch((authError) => {
            observer.error(new Error('Failed to acquire token for SSE: ' + authError.message));
          });
        } else {
          observer.error(error);
        }
      });

      // Cleanup function
      return () => {
        if (eventSource && isConnected) {
          console.log('Closing SSE connection');
          eventSource.close();
        }
      };
    });
  }

  /**
   * Create SSE connection with custom event types
   * @param endpoint - The SSE endpoint URL
   * @param eventTypes - Array of event types to listen for
   * @param msalConfig - Optional MSAL configuration
   * @returns Observable that emits SSE messages with event type
   */
  protected connectSSEWithEvents<T = any>(
    endpoint: string,
    eventTypes: string[],
    msalConfig?: MsalApiConfig
  ): Observable<{ type: string; data: T }> {
    return new Observable(observer => {
      const scopes = msalConfig?.scopes || this.defaultScopes;
      let eventSource: EventSource | null = null;

      this.msalService.instance.acquireTokenSilent({
        scopes: scopes,
        account: this.msalService.instance.getActiveAccount() || undefined,
        forceRefresh: msalConfig?.forceRefresh || false
      }).then((tokenResponse: AuthenticationResult) => {
        const url = this.buildUrlWithToken(endpoint, tokenResponse.accessToken);

        try {
          eventSource = new EventSource(url);

          // Listen to specific event types
          eventTypes.forEach(eventType => {
            eventSource!.addEventListener(eventType, (event: MessageEvent) => {
              try {
                const data = JSON.parse(event.data);
                observer.next({ type: eventType, data: data as T });
              } catch (error) {
                observer.next({ type: eventType, data: event.data as T });
              }
            });
          });

          // Handle generic messages
          eventSource.onmessage = (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data);
              observer.next({ type: 'message', data: data as T });
            } catch (error) {
              observer.next({ type: 'message', data: event.data as T });
            }
          };

          // Handle errors
          eventSource.onerror = (error: Event) => {
            console.error('SSE connection error:', error);
            observer.error(new Error('SSE connection error'));
            if (eventSource) {
              eventSource.close();
            }
          };

        } catch (error) {
          observer.error(error);
        }
      }).catch((error) => {
        observer.error(error);
      });

      return () => {
        if (eventSource) {
          eventSource.close();
        }
      };
    });
  }

  /**
   * Build URL with token as query parameter (for SSE)
   * Some SSE implementations require token in URL since EventSource doesn't support custom headers
   */
  private buildUrlWithToken(endpoint: string, token: string): string {
    // Build complete URL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const fullUrl = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}/${cleanEndpoint}`;

    const separator = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${separator}access_token=${encodeURIComponent(token)}`;
  }

  /**
   * Establish SSE connection (helper method)
   */
  private establishSSEConnection<T>(
    url: string,
    observer: any,
    eventSource: EventSource | null
  ): void {
    try {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource(url);

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data as T);
        } catch (error) {
          observer.next(event.data as T);
        }
      };

      eventSource.onerror = (error: Event) => {
        console.error('SSE connection error:', error);
        observer.error(new Error('SSE connection error'));
        if (eventSource) {
          eventSource.close();
        }
      };
    } catch (error) {
      observer.error(error);
    }
  }
}
