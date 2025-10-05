import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { ThemeService } from '../../services/theme.service';
import * as UiActions from './ui.actions';

/**
 * UI Effects
 * Handles side effects for UI actions
 */
@Injectable()
export class UiEffects {
  private actions$ = inject(Actions);
  private themeService = inject(ThemeService);

  /**
   * Theme Effects
   */
  setTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UiActions.setTheme),
        tap(action => {
          this.themeService.setTheme(action.theme);
        })
      ),
    { dispatch: false }
  );

  toggleTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UiActions.toggleTheme),
        tap(() => {
          this.themeService.toggle();
        })
      ),
    { dispatch: false }
  );

  /**
   * Auto-remove notifications after delay
   */
  autoRemoveNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UiActions.addNotification),
        tap(action => {
          // Auto-remove notification after 5 seconds for non-error types
          if (action.notification.type !== 'error') {
            setTimeout(() => {
              // This would need to dispatch removeNotification action
              // For now, we'll handle this in the component
            }, 5000);
          }
        })
      ),
    { dispatch: false }
  );
}