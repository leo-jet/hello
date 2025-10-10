/**
 * User Model
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
 * Login Credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration Data
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Change Password Data
 */
export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

/**
 * Reset Password Data
 */
export interface ResetPasswordData {
  email: string;
}

/**
 * Token Refresh Response
 */
export interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}
