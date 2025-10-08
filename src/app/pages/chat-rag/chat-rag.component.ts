import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatModeService, ChatMode } from '../../services/chat-mode.service';

@Component({
  selector: 'app-chat-rag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-rag.component.html',
  styleUrls: ['./chat-rag.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatRagComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private chatModeService: ChatModeService
  ) {}

  ngOnInit() {
    // Définir le mode rag au chargement du composant
    this.chatModeService.setMode('rag');
  }
}
