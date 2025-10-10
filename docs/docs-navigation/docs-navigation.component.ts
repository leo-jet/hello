import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DOCS_CONFIG, type DocItem } from '../docs.config';

@Component({
  selector: 'app-docs-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docs-navigation.component.html'
})
export class DocsNavigationComponent {
  docsConfig = DOCS_CONFIG;

  // Signaux pour compter les éléments
  componentsCount = signal(this.docsConfig.components.length);
  servicesCount = signal(this.docsConfig.services.length);
  guidesCount = signal(this.docsConfig.guides.length);

  constructor(private router: Router) {}

  getStatusClass(status: string): string {
    const classes = {
      stable: 'bg-green-100 text-green-800',
      beta: 'bg-blue-100 text-blue-800',
      planned: 'bg-gray-100 text-gray-800',
      deprecated: 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || classes.planned;
  }

  getStatusLabel(status: string): string {
    const labels = {
      stable: 'Stable',
      beta: 'Bêta',
      planned: 'Planifié',
      deprecated: 'Déprécié'
    };
    return labels[status as keyof typeof labels] || 'Inconnu';
  }

  navigateToDocumentation(componentPath: string) {
    this.router.navigate(['/docs', componentPath]);
  }

  openDocumentation(path: string) {
    // Ouvre la documentation dans un nouvel onglet ou dans un viewer intégré
    window.open(`/docs/components/${path}.md`, '_blank');
  }

  openGuide(path: string) {
    // Ouvre le guide dans un nouvel onglet ou dans un viewer intégré
    window.open(`/docs/guides/${path}.md`, '_blank');
  }
}
