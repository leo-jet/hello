import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatModeService, ChatMode } from '../../services/chat-mode.service';

@Component({
  selector: 'app-chat-basic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-basic.component.html',
  styleUrls: ['./chat-basic.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatBasicComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private chatModeService: ChatModeService
  ) {}

  ngOnInit() {
    // Définir le mode basic au chargement du composant
    this.chatModeService.setMode('basic');
  }
}
