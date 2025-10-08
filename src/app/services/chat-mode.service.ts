import { Injectable, signal } from '@angular/core';

export type ChatMode = 'basic' | 'advanced' | 'rag' | null;

export interface ChatModeInfo {
  mode: ChatMode;
  label: string;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatModeService {
  private _currentMode = signal<ChatMode>(null);

  // Signal en lecture seule pour le mode actuel
  currentMode = this._currentMode.asReadonly();

  // Informations sur les modes disponibles
  private modeInfoMap: Record<NonNullable<ChatMode>, ChatModeInfo> = {
    basic: {
      mode: 'basic',
      label: 'Mode Chat',
      icon: 'fa-comments',
      color: 'text-blue-500'
    },
    advanced: {
      mode: 'advanced',
      label: 'Mode Advanced Chat',
      icon: 'fa-brain',
      color: 'text-green-500'
    },
    rag: {
      mode: 'rag',
      label: 'Mode RAG',
      icon: 'fa-database',
      color: 'text-purple-500'
    }
  };

  /**
   * Définit le mode de chat actuel
   */
  setMode(mode: ChatMode): void {
    this._currentMode.set(mode);
  }

  /**
   * Obtient les informations du mode actuel
   */
  getCurrentModeInfo(): ChatModeInfo | null {
    const mode = this._currentMode();
    return mode ? this.modeInfoMap[mode] : null;
  }

  /**
   * Obtient les informations d'un mode spécifique
   */
  getModeInfo(mode: NonNullable<ChatMode>): ChatModeInfo {
    return this.modeInfoMap[mode];
  }

  /**
   * Efface le mode actuel
   */
  clearMode(): void {
    this._currentMode.set(null);
  }
}