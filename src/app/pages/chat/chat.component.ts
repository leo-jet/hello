import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  // Messages de la conversation
  messages = signal<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'Bonjour ! Peux-tu m\'aider à créer une application Angular ?',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Bonjour ! Bien sûr, je serais ravi de vous aider à créer une application Angular. Pour commencer, assurez-vous d\'avoir Node.js et npm installés. Ensuite, vous pouvez installer Angular CLI avec la commande `npm install -g @angular/cli`. Voulez-vous que je vous guide à travers les étapes ?',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: '3',
      role: 'user',
      content: 'Oui, comment créer un nouveau projet ?',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: '4',
      role: 'assistant',
      content: 'Pour créer un nouveau projet Angular, utilisez la commande :\n\n```bash\nng new mon-projet\n```\n\nCette commande va :\n1. Créer un nouveau dossier avec le nom de votre projet\n2. Installer toutes les dépendances nécessaires\n3. Configurer votre projet avec les fichiers de base\n\nEnsuite, naviguez dans le dossier du projet avec `cd mon-projet` et lancez le serveur de développement avec `ng serve`.',
      timestamp: new Date(Date.now() - 120000)
    }
  ]);

  /**
   * Formater l'horodatage du message
   */
  formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
}
