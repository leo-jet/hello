import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BaseApiService, ApiResponse } from './base-api.service';

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public readonly currentUser$ = this.currentUserSubject.asObservable();
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor() {
    super();
    this.checkAuthState();
  }

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
  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    return this.post<AuthResponse>('auth/refresh', { refreshToken });
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
  changePassword(oldPassword: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.post<void>('auth/change-password', {
      oldPassword,
      newPassword
    });
  }

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Observable<ApiResponse<void>> {
    return this.post<void>('auth/forgot-password', { email });
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

  /**
   * Set authentication data
   */
  setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('authToken', authResponse.token);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Clear authentication data
   */
  clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Get stored auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check authentication state on service initialization
   */
  private checkAuthState(): void {
    const token = this.getAuthToken();
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuthData();
      }
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUserValue();
    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUserValue();
    return user ? roles.includes(user.role) : false;
  }
}