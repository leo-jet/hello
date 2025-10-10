import { createAction, props } from '@ngrx/store';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@app/models';


/**
 * Login Actions
 */
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ authResponse: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

/**
 * Register Actions
 */
export const register = createAction(
  '[Auth] Register',
  props<{ userData: RegisterData }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ authResponse: AuthResponse }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

/**
 * Logout Actions
 */
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

/**
 * Load Current User Actions
 */
export const loadCurrentUser = createAction('[Auth] Load Current User');

export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: User }>()
);

export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string }>()
);

/**
 * Update Profile Actions
 */
export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ userData: Partial<User> }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);

/**
 * Change Password Actions
 */
export const changePassword = createAction(
  '[Auth] Change Password',
  props<{ oldPassword: string; newPassword: string }>()
);

export const changePasswordSuccess = createAction('[Auth] Change Password Success');

export const changePasswordFailure = createAction(
  '[Auth] Change Password Failure',
  props<{ error: string }>()
);

/**
 * Clear Auth Error Action
 */
export const clearAuthError = createAction('[Auth] Clear Error');

/**
 * Initialize Auth Action (check stored token)
 */
export const initializeAuth = createAction('[Auth] Initialize');