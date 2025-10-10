import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListItemComponent } from '../../../components/list-item/list-item.component';
import { ListItemSectionComponent } from '../../../components/list-item-section/list-item-section.component';
import { ListItemLabelComponent } from '../../../components/list-item-label/list-item-label.component';
import { IconButtonComponent } from '../../../components/icon-button/icon-button.component';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

@Component({
  selector: 'app-main-conversation-item',
  imports: [
    CommonModule,
    ListItemComponent,
    ListItemSectionComponent,
    ListItemLabelComponent,
    IconButtonComponent,
  ],
  templateUrl: './main-conversation-item.component.html',
  styleUrl: './main-conversation-item.component.css'
})
export class MainConversationItemComponent {
  conversation = input.required<Conversation>();

  conversationClick = output<Conversation>();
  deleteClick = output<Conversation>();

  constructor(private router: Router) {}

  onConversationClick() {
    this.conversationClick.emit(this.conversation());
    // Rediriger vers la page de conversation
    this.router.navigate(['/chat', this.conversation().id]);
  }

  onDeleteClick() {
    // Icon button component handles click event
    this.deleteClick.emit(this.conversation());
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return new Date(timestamp).toLocaleDateString('fr-FR');
  }
}
