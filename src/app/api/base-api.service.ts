import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiRequestConfig, ApiResponse, PaginatedResponse } from '@app/models';

/**
 * Base API Service that provides common HTTP operations
 * All other API services should extend this class
 */
@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl: string = environment.apiUrl || 'http://localhost:3000/api';

  // Default configuration
  protected readonly defaultTimeout = 30000; // 30 seconds
  protected readonly defaultRetries = 3;

  /**
   * GET request
   */
  protected get<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, null, config);
  }

  /**
   * POST request
   */
  protected post<T>(
    endpoint: string,
    body: any,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, body, config);
  }

  /**
   * PUT request
   */
  protected put<T>(
    endpoint: string,
    body: any,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, body, config);
  }

  /**
   * PATCH request
   */
  protected patch<T>(
    endpoint: string,
    body: any,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, body, config);
  }

  /**
   * DELETE request
   */
  protected delete<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, null, config);
  }

  /**
   * Generic request method
   */
  private request<T>(
    method: string,
    endpoint: string,
    body: any = null,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options = this.buildRequestOptions(config);

    let request$: Observable<ApiResponse<T>>;

    switch (method.toUpperCase()) {
      case 'GET':
        request$ = this.http.get<ApiResponse<T>>(url, options);
        break;
      case 'POST':
        request$ = this.http.post<ApiResponse<T>>(url, body, options);
        break;
      case 'PUT':
        request$ = this.http.put<ApiResponse<T>>(url, body, options);
        break;
      case 'PATCH':
        request$ = this.http.patch<ApiResponse<T>>(url, body, options);
        break;
      case 'DELETE':
        request$ = this.http.delete<ApiResponse<T>>(url, options);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return request$.pipe(
      timeout(config?.timeout || this.defaultTimeout),
      retry(config?.retries || this.defaultRetries),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Build complete URL
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  /**
   * Build request options
   */
  private buildRequestOptions(config?: ApiRequestConfig): {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | string[] };
    observe: 'body';
    responseType: 'json';
    reportProgress?: boolean;
  } {
    const options = {
      observe: 'body' as const,
      responseType: 'json' as const,
      headers: config?.headers,
      params: config?.params,
      reportProgress: config?.reportProgress
    };

    return options;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request - Please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized - Please log in';
          break;
        case 403:
          errorMessage = 'Forbidden - You do not have permission';
          break;
        case 404:
          errorMessage = 'Not Found - Resource does not exist';
          break;
        case 409:
          errorMessage = 'Conflict - Resource already exists';
          break;
        case 422:
          errorMessage = 'Validation Error - Please check your input';
          break;
        case 429:
          errorMessage = 'Too Many Requests - Please try again later';
          break;
        case 500:
          errorMessage = 'Internal Server Error - Please try again later';
          break;
        case 502:
          errorMessage = 'Bad Gateway - Service temporarily unavailable';
          break;
        case 503:
          errorMessage = 'Service Unavailable - Please try again later';
          break;
        default:
          errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
    }

    console.error('API Error:', {
      status: error.status,
      message: errorMessage,
      url: error.url,
      error: error.error
    });

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Build query parameters from object
   */
  protected buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => httpParams = httpParams.append(key, v));
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return httpParams;
  }

  /**
   * Upload file
   */
  protected uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    config?: ApiRequestConfig
  ): Observable<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.post<T>(endpoint, formData, config);
  }

  /**
   * Download file
   */
  protected downloadFile(
    endpoint: string,
    filename?: string,
    config?: ApiRequestConfig
  ): Observable<Blob> {
    const url = this.buildUrl(endpoint);
    const headers = config?.headers || {};
    const params = config?.params || {};

    return this.http.get(url, {
      headers,
      params,
      responseType: 'blob'
    }).pipe(
      timeout(config?.timeout || this.defaultTimeout),
      catchError(this.handleError.bind(this))
    );
  }
}
