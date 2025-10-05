import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { isDevMode } from '@angular/core';

import { AppState } from './app.state';
import { authReducer } from './auth/auth.reducer';
import { uiReducer } from './ui/ui.reducer';

/**
 * Root reducer map
 */
export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  ui: uiReducer
};

/**
 * Meta-reducers (middleware)
 */
export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];

/**
 * Root state selectors
 */
export const selectAuthState = (state: AppState) => state.auth;
export const selectUiState = (state: AppState) => state.ui;
