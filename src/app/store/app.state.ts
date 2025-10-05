import { AuthState } from './auth/auth.state';
import { UiState } from './ui/ui.state';

/**
 * Application State interface
 * Represents the complete state of the application
 */
export interface AppState {
  auth: AuthState;
  ui: UiState;
}

/**
 * Selector functions to get specific slices of state
 */
export const selectAuthState = (state: AppState) => state.auth;
export const selectUiState = (state: AppState) => state.ui;