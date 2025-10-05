import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interface for components that can have unsaved changes
 * Implement this interface in components that need unsaved changes protection
 */
export interface CanComponentDeactivate {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}

/**
 * Unsaved Changes Guard
 * Prevents navigation away from a component with unsaved changes
 * Shows confirmation dialog to user
 */
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  // Check if component implements the interface
  if (!component.canDeactivate) {
    return true;
  }
  
  // Call the component's canDeactivate method
  const canDeactivate = component.canDeactivate();
  
  // Handle different return types
  if (typeof canDeactivate === 'boolean') {
    return canDeactivate ? true : confirmNavigation();
  }
  
  // Handle Promise or Observable
  return Promise.resolve(canDeactivate).then(result => {
    return result ? true : confirmNavigation();
  });
};

/**
 * Shows confirmation dialog for navigation
 */
function confirmNavigation(): boolean {
  const message = 'You have unsaved changes. Are you sure you want to leave this page?';
  return window.confirm(message);
}

/**
 * Generic form guard for Angular Reactive Forms
 * Use this for forms that extend FormGroup
 */
export const formGuard: CanDeactivateFn<any> = (component) => {
  // Check if component has a form property and it's dirty
  if (component.form && component.form.dirty) {
    return confirmNavigation();
  }
  return true;
};

/**
 * Custom unsaved changes guard with custom message
 * Higher-order function to create guards with custom messages
 */
export function createUnsavedChangesGuard(
  message: string = 'You have unsaved changes. Are you sure you want to leave?'
): CanDeactivateFn<CanComponentDeactivate> {
  return (component, currentRoute, currentState, nextState) => {
    if (!component.canDeactivate) {
      return true;
    }
    
    const canDeactivate = component.canDeactivate();
    
    if (typeof canDeactivate === 'boolean') {
      return canDeactivate ? true : window.confirm(message);
    }
    
    return Promise.resolve(canDeactivate).then(result => {
      return result ? true : window.confirm(message);
    });
  };
}

/**
 * Advanced unsaved changes guard with custom dialog
 * Use this version if you want to show a custom dialog instead of browser confirm
 */
export function createAdvancedUnsavedChangesGuard(
  showDialog: () => Promise<boolean>
): CanDeactivateFn<CanComponentDeactivate> {
  return async (component, currentRoute, currentState, nextState) => {
    if (!component.canDeactivate) {
      return true;
    }
    
    const canDeactivate = await Promise.resolve(component.canDeactivate());
    
    if (canDeactivate) {
      return true;
    }
    
    // Show custom dialog
    return await showDialog();
  };
}