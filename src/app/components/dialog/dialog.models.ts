/**
 * Position du dialog
 */
export type DialogPosition = 'standard' | 'top' | 'right' | 'bottom' | 'left';

/**
 * Transition d'animation
 */
export type DialogTransition = 'scale' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';

/**
 * Configuration d'un bouton d'action
 */
export interface DialogAction {
  label: string;
  color?: string;
  textColor?: string;
  flat?: boolean;
  outline?: boolean;
  rounded?: boolean;
  noCaps?: boolean;
  dense?: boolean;
  loading?: boolean;
  disable?: boolean;
  icon?: string;
  iconRight?: string;
  class?: string;
  handler?: () => void | boolean | Promise<boolean>;
}

/**
 * Configuration du dialog
 */
export interface DialogConfig {
  // Contenu
  title?: string;
  message?: string;
  html?: boolean;
  prompt?: DialogPromptConfig;
  options?: DialogOptionsConfig;

  // Actions
  ok?: boolean | string | DialogAction;
  cancel?: boolean | string | DialogAction;
  actions?: DialogAction[];

  // Comportement
  persistent?: boolean;
  noEscDismiss?: boolean;
  noBackdropDismiss?: boolean;
  noRouteDismiss?: boolean;
  seamless?: boolean;
  maximized?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;

  // Apparence
  position?: DialogPosition;
  color?: string;
  cardClass?: string;
  cardStyle?: Record<string, string>;

  // Contenu personnalisé
  customContent?: boolean; // Si true, utilise uniquement ng-content (pas de message/prompt/options par défaut)

  // Animation
  transitionShow?: DialogTransition;
  transitionHide?: DialogTransition;
  transitionDuration?: number;

  // Callbacks
  onShow?: () => void;
  onHide?: () => void;
  onOk?: (data?: any) => void;
  onCancel?: () => void;
  onDismiss?: () => void;

  // Classes et styles
  class?: string;
  style?: Record<string, string>;
  backdropClass?: string;
  backdropStyle?: Record<string, string>;

  // Accessibilité
  focus?: 'none' | 'ok' | 'cancel' | 'first';
  autoClose?: boolean;
}

/**
 * Configuration pour un dialog de type prompt
 */
export interface DialogPromptConfig {
  model: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'textarea';
  label?: string;
  placeholder?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  counter?: boolean;
  maxlength?: number;
  minlength?: number;
  outlined?: boolean;
  filled?: boolean;
  dense?: boolean;
  autofocus?: boolean;
  isValid?: (value: string) => boolean;
}

/**
 * Configuration pour un dialog avec options (radio/checkbox)
 */
export interface DialogOptionsConfig {
  type: 'radio' | 'checkbox' | 'toggle';
  model: string | string[];
  items: DialogOptionItem[];
  isValid?: (value: any) => boolean;
}

/**
 * Item d'option pour radio/checkbox/toggle
 */
export interface DialogOptionItem {
  label: string;
  value: any;
  color?: string;
  disable?: boolean;
  icon?: string;
}

/**
 * Résultat retourné par le dialog
 */
export interface DialogResult<T = any> {
  ok: boolean;
  data?: T;
}

/**
 * Référence au dialog créé
 */
export interface DialogRef {
  hide: () => void;
  update: (config: Partial<DialogConfig>) => void;
  onOk: (callback: (data?: any) => void) => void;
  onCancel: (callback: () => void) => void;
  onDismiss: (callback: () => void) => void;
}

/**
 * Types de dialogs prédéfinis
 */
export type DialogType = 'alert' | 'confirm' | 'prompt';
