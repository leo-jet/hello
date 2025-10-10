/**
 * Generic API Response
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/**
 * API Request Configuration
 */
export interface ApiRequestConfig {
  headers?: { [header: string]: string | string[] };
  params?: { [param: string]: string | string[] };
  timeout?: number;
  retries?: number;
  reportProgress?: boolean;
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}
