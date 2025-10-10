import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ChangePasswordData,
  ResetPasswordData,
  TokenRefreshResponse,
  ApiResponse
} from '@app/models';

/**
 * Authentication Service
 * Handles HTTP calls for user authentication, registration, and profile management
 * Business logic is handled in the store (auth.reducer.ts)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  /**
   * Login user
   */
  login(credentials: LoginCredentials): Observable<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('auth/login', credentials);
  }

  /**
   * Register new user
   */
  register(userData: RegisterData): Observable<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('auth/register', userData);
  }

  /**
   * Logout user
   */
  logout(): Observable<ApiResponse<void>> {
    return this.post<void>('auth/logout', {});
  }

  /**
   * Refresh authentication token
   */
  refreshToken(refreshToken: string): Observable<ApiResponse<TokenRefreshResponse>> {
    return this.post<TokenRefreshResponse>('auth/refresh', { refreshToken });
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.get<User>('auth/me');
  }

  /**
   * Update user profile
   */
  updateProfile(userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.put<User>('auth/profile', userData);
  }

  /**
   * Change password
   */
  changePassword(data: ChangePasswordData): Observable<ApiResponse<void>> {
    return this.post<void>('auth/change-password', data);
  }

  /**
   * Request password reset
   */
  requestPasswordReset(data: ResetPasswordData): Observable<ApiResponse<void>> {
    return this.post<void>('auth/forgot-password', data);
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.post<void>('auth/reset-password', {
      token,
      newPassword
    });
  }
}
