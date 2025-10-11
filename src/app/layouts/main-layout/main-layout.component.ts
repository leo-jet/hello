import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  ContentChild,
  TemplateRef,
  AfterContentInit,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  Router,
  NavigationEnd,
} from '@angular/router';
import { ChatModeService } from '../../services/chat-mode.service';
import { filter } from 'rxjs/operators';

// Import des composants réutilisables
import { SidebarComponent } from '../../components/sidebar/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { OverlayComponent } from '../../components/overlay/overlay.component';
import { ListComponent } from '../../components/list/list.component';
import { ListItemComponent } from '../../components/list-item/list-item.component';
import { ListItemSectionComponent } from '../../components/list-item-section/list-item-section.component';
import { ListItemLabelComponent } from '../../components/list-item-label/list-item-label.component';

// Import des sous-composants du main-layout
import { MainSidebarNavigationComponent } from './main-sidebar-navigation/main-sidebar-navigation.component';
import { MainConversationItemComponent } from './main-conversation-item/main-conversation-item.component';

// Import du Dialog
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ChatStore } from '../../stores/chat.store';

// Interface pour les modèles AI
interface AIModel {
  id: string;
  display_name: string;
  description: string;
  has_reasoning: boolean;
  reasoning_level: ('low' | 'medium' | 'high')[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    OverlayComponent,
    ListComponent,
    ListItemComponent,
    ListItemSectionComponent,
    ListItemLabelComponent,
    MainSidebarNavigationComponent,
    MainConversationItemComponent,
    DialogComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements AfterContentInit, OnInit {
  title = 'Template Widget';

  // Injection du ChatStore (SignalStore)
  readonly chatStore = inject(ChatStore);

  // État de la sidebar
  sidebarOpen = signal(false);

  // États des dialogs
  settingsDialogVisible = signal(false);
  profileDialogVisible = signal(false);
  helpDialogVisible = signal(false);

  // Route actuelle
  currentRoute = signal<string>('');

  // Valeur du textarea pour contrôler l'état du bouton d'envoi
  messageValue = signal<string>('');

  // Service de gestion du mode de chat
  constructor(
    private chatModeService: ChatModeService,
    private router: Router
  ) {
    // Écouter les changements de route
    this.currentRoute.set(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute.set(event.url);
      });
  }

  ngOnInit() {
    // Charger les modèles LLM depuis le store
    this.chatStore.loadModels();
  }

  // État du menu expandable des modes de chat
  chatModesExpanded = signal(true);

  // Mode de chat actuel
  currentChatMode = computed(() => this.chatModeService.currentMode());
  currentChatModeInfo = computed(() =>
    this.chatModeService.getCurrentModeInfo()
  );

  // Modes de chat disponibles
  chatModes = [
    {
      id: 'basic',
      label: 'Mode Chat',
      icon: 'fa-comments',
      color: 'text-blue-500',
      route: '/chat/basic',
      description: 'Chat simple et direct',
    },
    {
      id: 'advanced',
      label: 'Mode Advanced',
      icon: 'fa-brain',
      color: 'text-green-500',
      route: '/chat/advanced',
      description: 'Chat avec raisonnement',
    },
    {
      id: 'rag',
      label: 'Mode RAG',
      icon: 'fa-database',
      color: 'text-purple-500',
      route: '/chat/rag',
      description: 'Chat avec documents',
    },
  ];

  // Modèles disponibles
  availableModels: AIModel[] = [
    {
      id: 'gpt-4',
      display_name: 'Chat GPT 4',
      description: 'Modèle puissant pour tâches complexes',
      has_reasoning: true,
      reasoning_level: ['medium', 'high'],
    },
    {
      id: 'gpt-5',
      display_name: 'Chat GPT 5',
      description: 'Nouvelles idées interessantes',
      has_reasoning: true,
      reasoning_level: ['low', 'medium'],
    },
    {
      id: 'claude-3',
      display_name: 'Claude 3',
      description: "Excellent pour l'analyse et la créativité",
      has_reasoning: true,
      reasoning_level: ['medium', 'high'],
    },
    {
      id: 'gemini-pro',
      display_name: 'Gemini Pro',
      description: 'Modèle multimodal avancé',
      has_reasoning: false,
      reasoning_level: [],
    },
  ];

  // Modèle actuellement sélectionné
  selectedModel = signal<AIModel>(this.availableModels[1]); // Par défaut GPT-5

  // Niveau de raisonnement sélectionné pour les modèles avec reasoning
  selectedReasoningLevel = signal<'low' | 'medium' | 'high'>('medium');

  // État du sélecteur de modèle
  showModelSelector = signal<boolean>(false);

  // État du sélecteur de niveau de raisonnement
  showReasoningLevelSelector = signal<boolean>(false);

  // Options formatées pour le composant select (modèles)
  get modelSelectOptions() {
    return this.availableModels.map((model) => ({
      value: model.id,
      label: model.display_name,
      icon: '🤖',
    }));
  }

  // Options formatées pour le composant select (niveaux de raisonnement)
  get reasoningLevelSelectOptions() {
    if (!this.selectedModel().has_reasoning) return [];

    return this.selectedModel().reasoning_level.map((level) => ({
      value: level,
      label:
        level === 'low'
          ? 'Rapide'
          : level === 'medium'
          ? 'Équilibré'
          : 'Approfondi',
      icon: level === 'low' ? '⚡' : level === 'medium' ? '⚖️' : '🧠',
    }));
  }

  // Alternative simple pour tester - utilisation directe de primitives
  get simpleReasoningLevels() {
    if (!this.selectedModel().has_reasoning) return [];
    return this.selectedModel().reasoning_level; // Retourne ['low', 'medium', 'high']
  } // Année actuelle
  currentYear = new Date().getFullYear();

  // Vérifier si du contenu footer personnalisé est fourni
  hasFooterContent = signal(false);

  // Données de conversations pour l'interface de chat
  conversations = [
    {
      id: '1',
      title: 'Discussion sur Angular 19',
      lastMessage: 'Comment implémenter les signals ?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      unreadCount: 2,
    },
    {
      id: '2',
      title: 'Projet Template Widget',
      lastMessage: 'La sidebar est presque terminée',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      unreadCount: 0,
    },
    {
      id: '3',
      title: 'Aide sur TypeScript',
      lastMessage: "Merci pour l'explication !",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5h ago
      unreadCount: 1,
    },
    {
      id: '4',
      title: 'Optimisation Performance',
      lastMessage: 'OnPush change detection...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unreadCount: 0,
    },
    {
      id: '5',
      title: 'Questions CSS',
      lastMessage: 'Tailwind vs CSS modules ?',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      unreadCount: 3,
    },
    {
      id: '6',
      title: 'Déploiement Azure',
      lastMessage: 'Configuration des pipelines',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      unreadCount: 0,
    },
    {
      id: '7',
      title: 'Révision de code',
      lastMessage: 'PR approuvée ✅',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      unreadCount: 0,
    },
    {
      id: '8',
      title: 'Brainstorming Features',
      lastMessage: 'Nouvelles idées interessantes',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      unreadCount: 1,
    },
  ];

  opts = [
    { id: 1, name: 'Option A', meta: 'A' },
    { id: 2, name: 'Option B', meta: 'B' },
  ];

  selectedObject = signal<any | null>(null);

  @ContentChild('[footer]') footerContent?: TemplateRef<any>;

  ngAfterContentInit() {
    this.hasFooterContent.set(!!this.footerContent);
  }

  onSelectObject(ev: unknown) {
    this.selectedObject.set(ev as any);
  }

  /**
   * Basculer l'état de la sidebar
   */
  toggleSidebar() {
    this.sidebarOpen.update((current) => !current);
  }

  /**
   * Fermer la sidebar
   */
  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  /**
   * Ouvrir la sidebar
   */
  openSidebar() {
    this.sidebarOpen.set(true);
  }

  /**
   * Obtenir le badge d'un projet selon son statut
   */
  getProjectBadge(status: string): {
    text: string;
    type?: 'success' | 'warning' | 'error' | 'info' | 'default';
  } {
    const statusMap: {
      [key: string]: {
        text: string;
        type: 'success' | 'warning' | 'error' | 'info' | 'default';
      };
    } = {
      Nouveau: { text: 'NEW', type: 'info' },
      'En cours': { text: 'WIP', type: 'warning' },
      'En développement': { text: 'DEV', type: 'warning' },
      'En test': { text: 'TEST', type: 'info' },
      'En révision': { text: 'REV', type: 'info' },
      Déployé: { text: 'LIVE', type: 'success' },
      Maintenance: { text: 'MAINT', type: 'warning' },
      Suspendu: { text: 'PAUSE', type: 'default' },
      Archivé: { text: 'ARCH', type: 'default' },
      Fermé: { text: 'DONE', type: 'success' },
    };

    return statusMap[status] || { text: 'UNK', type: 'default' };
  }

  /**
   * Naviguer vers un chat spécifique
   */
  navigateToChat(chatId: string) {
    // TODO: Implémenter la navigation vers la page du chat
    console.log('Navigation vers le chat:', chatId);
    // Exemple: this.router.navigate(['/chat', chatId]);
  }

  /**
   * Créer un nouveau chat
   */
  createNewChat() {
    // Naviguer vers la page nouveau chat
    this.router.navigate(['/chat/new']);
    console.log('Navigation vers nouveau chat');
  }

  /**
   * Supprimer une conversation
   */
  deleteConversation(chatId: string, event: Event) {
    event.stopPropagation(); // Empêcher la navigation vers le chat
    this.conversations = this.conversations.filter(
      (conv) => conv.id !== chatId
    );
    console.log('Conversation supprimée:', chatId);
  }

  /**
   * Gérer la suppression d'une conversation depuis le composant enfant
   */
  handleDeleteConversation(conversation: any) {
    this.conversations = this.conversations.filter(
      (conv) => conv.id !== conversation.id
    );
    console.log('Conversation supprimée:', conversation.id);
  }

  /**
   * Formater l'horodatage pour l'affichage
   */
  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else if (days < 7) {
      return `${days}j`;
    } else {
      return timestamp.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      });
    }
  }

  // Méthode pour gérer les changements de l'input du footer
  onFooterInputChange(value: string | FileList | File | null): void {
    console.log('Footer input value changed:', value);

    // Mettre à jour la valeur du message pour contrôler l'état du bouton
    if (typeof value === 'string') {
      this.messageValue.set(value.trim());
    } else {
      this.messageValue.set('');
    }

    // Ici vous pouvez ajouter la logique pour traiter la valeur de l'input
    // Par exemple : envoyer un message, traiter le texte, etc.
  }

  // Méthode pour gérer le clic sur le microphone
  onMicrophoneClick(): void {
    console.log('Microphone clicked');
    // Ici vous pouvez ajouter la logique pour l'enregistrement vocal
    // Par exemple : démarrer/arrêter l'enregistrement, reconnaissance vocale, etc.
  }

  // Méthode pour gérer l'envoi de message
  onSendMessage(): void {
    console.log('Send message clicked');

    // Ne pas envoyer si le message est vide
    if (this.messageValue().length === 0) {
      return;
    }

    // Ici vous pouvez ajouter la logique pour envoyer le message
    // Par exemple : traiter le contenu du textarea, envoyer à l'API, etc.

    // Vider l'input après envoi
    this.messageValue.set('');
  }

  // Computed pour vérifier si le bouton d'envoi doit être désactivé
  get isSendButtonDisabled(): boolean {
    return this.messageValue().length === 0;
  }

  // Méthode pour changer de modèle via le composant select
  onModelSelect(modelId: unknown): void {
    // Appeler la méthode du store pour sélectionner le modèle
    this.chatStore.selectModel(modelId as string);

    const model = this.availableModels.find((m) => m.id === modelId);
    if (model) {
      this.selectedModel.set(model);

      // Si le modèle a du reasoning, vérifier que le niveau sélectionné est valide
      if (
        model.has_reasoning &&
        !model.reasoning_level.includes(this.selectedReasoningLevel())
      ) {
        // Prendre le premier niveau disponible par défaut
        this.selectedReasoningLevel.set(model.reasoning_level[0]);
      }

      console.log('Modèle sélectionné:', model.display_name);
      if (model.has_reasoning) {
        console.log('Niveau de raisonnement:', this.selectedReasoningLevel());
      }
    }
  }

  // Méthode pour changer le niveau de raisonnement via le composant select
  onReasoningLevelSelect(level: unknown): void {
    this.selectedReasoningLevel.set(level as 'low' | 'medium' | 'high');
    console.log('Niveau de raisonnement sélectionné:', level);
  }

  // Méthode pour changer de modèle (ancienne version - gardée pour compatibilité)
  selectModel(model: AIModel): void {
    // Appeler la méthode du store pour sélectionner le modèle
    this.chatStore.selectModel(model.id);

    this.selectedModel.set(model);
    this.showModelSelector.set(false); // Fermer le sélecteur après sélection

    // Si le modèle a du reasoning, vérifier que le niveau sélectionné est valide
    if (
      model.has_reasoning &&
      !model.reasoning_level.includes(this.selectedReasoningLevel())
    ) {
      // Prendre le premier niveau disponible par défaut
      this.selectedReasoningLevel.set(model.reasoning_level[0]);
    }

    console.log('Modèle sélectionné:', model.display_name);
    if (model.has_reasoning) {
      console.log('Niveau de raisonnement:', this.selectedReasoningLevel());
    }
  }

  // Méthode pour basculer l'affichage du sélecteur de modèle
  toggleModelSelector(): void {
    this.showModelSelector.update((current) => !current);
    this.showReasoningLevelSelector.set(false); // Fermer le sélecteur de niveau si ouvert
  }

  // Méthode pour changer le niveau de raisonnement
  selectReasoningLevel(level: 'low' | 'medium' | 'high'): void {
    this.selectedReasoningLevel.set(level);
    this.showReasoningLevelSelector.set(false);
    console.log('Niveau de raisonnement sélectionné:', level);
  }

  // Méthode pour basculer l'affichage du sélecteur de niveau de raisonnement
  toggleReasoningLevelSelector(): void {
    this.showReasoningLevelSelector.update((current) => !current);
  }

  // Computed pour obtenir les niveaux de raisonnement disponibles
  get availableReasoningLevels(): ('low' | 'medium' | 'high')[] {
    return this.selectedModel().has_reasoning
      ? this.selectedModel().reasoning_level
      : [];
  }

  // Méthodes pour le menu expandable des modes de chat
  toggleChatModesMenu(): void {
    this.chatModesExpanded.update((current) => !current);
  }

  navigateToChatMode(mode: any): void {
    // Définir le mode dans le service (seulement pour les modes de chat, pas pour home)
    this.chatModeService.setMode(mode.id);
    // Naviguer vers la route
    this.router.navigate([mode.route]);
    // Fermer le menu
    this.chatModesExpanded.set(false);
  }

  navigateToHome(): void {
    // Effacer le mode de chat pour la page d'accueil
    this.chatModeService.clearMode();
    // Naviguer vers la route
    this.router.navigate(['/']);
  }

  /**
   * Naviguer vers la documentation
   */
  navigateToDocs(): void {
    // Fermer la sidebar pour laisser place à la page de docs
    this.sidebarOpen.set(false);
    // Naviguer vers /docs
    this.router.navigate(['/docs']);
  }

  /**
   * Ouvrir le dialog des paramètres
   */
  openSettingsDialog(): void {
    this.settingsDialogVisible.set(true);
  }

  /**
   * Ouvrir le dialog du profil
   */
  openProfileDialog(): void {
    this.profileDialogVisible.set(true);
  }

  /**
   * Ouvrir le dialog d'aide
   */
  openHelpDialog(): void {
    this.helpDialogVisible.set(true);
  }
}
