import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DOCS_CONFIG } from '../docs.config';

@Component({
  selector: 'docs-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './docs-sidebar.component.html'
})
export class DocsSidebarComponent {
  DOCS_CONFIG = DOCS_CONFIG;
}

