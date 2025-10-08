import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatModeService, ChatMode } from '../../services/chat-mode.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  title = 'Home';

  constructor(
    private router: Router,
    private chatModeService: ChatModeService
  ) {}

  selectChatMode(mode: ChatMode) {
    if (!mode) return;

    // Définir le mode dans le service
    this.chatModeService.setMode(mode);

    switch (mode) {
      case 'basic':
        // Rediriger vers le mode chat simple
        this.router.navigate(['/chat/basic']);
        break;
      case 'advanced':
        // Rediriger vers le mode chat avancé
        this.router.navigate(['/chat/advanced']);
        break;
      case 'rag':
        // Rediriger vers le mode RAG
        this.router.navigate(['/chat/rag']);
        break;
      default:
        console.warn('Mode de chat inconnu:', mode);
    }
  }
}
