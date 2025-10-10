import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../../../components/list/list.component';
import { ListItemComponent } from '../../../components/list-item/list-item.component';
import { ListItemSectionComponent } from '../../../components/list-item-section/list-item-section.component';
import { ListItemLabelComponent } from '../../../components/list-item-label/list-item-label.component';
import { ExpansionItemComponent } from '../../../components/expansion-item/expansion-item.component';

export interface ChatMode {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-main-sidebar-navigation',
  imports: [
    CommonModule,
    ListComponent,
    ListItemComponent,
    ListItemSectionComponent,
    ListItemLabelComponent,
    ExpansionItemComponent,
  ],
  templateUrl: './main-sidebar-navigation.component.html',
  styleUrl: './main-sidebar-navigation.component.css'
})
export class MainSidebarNavigationComponent {
  currentChatMode = input<string | null>(null);
  currentRoute = input<string>('');
  chatModes = input<ChatMode[]>([]);
  chatModesExpanded = input<boolean>(true);

  // Computed pour déterminer quel menu est actif
  isHomeActive = computed(() => this.currentRoute() === '/' || this.currentRoute() === '');
  isDocsActive = computed(() => this.currentRoute().startsWith('/docs'));
  isNewChatActive = computed(() => this.currentRoute() === '/chat/new');

  homeClick = output<void>();
  docsClick = output<void>();
  newChatClick = output<void>();
  chatModeClick = output<ChatMode>();
  toggleChatModes = output<void>();

  onHomeClick() {
    this.homeClick.emit();
  }

  onDocsClick() {
    this.docsClick.emit();
  }

  onNewChatClick() {
    this.newChatClick.emit();
  }

  onChatModeClick(mode: ChatMode) {
    this.chatModeClick.emit(mode);
  }

  onToggleChatModes() {
    this.toggleChatModes.emit();
  }
}
