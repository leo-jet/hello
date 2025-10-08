import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatModeService, ChatMode } from '../../services/chat-mode.service';

@Component({
  selector: 'app-chat-advanced',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-advanced.component.html',
  styleUrls: ['./chat-advanced.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatAdvancedComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private chatModeService: ChatModeService
  ) {}

  ngOnInit() {
    // Définir le mode advanced au chargement du composant
    this.chatModeService.setMode('advanced');
  }
}
