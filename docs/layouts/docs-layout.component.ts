import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DocsSidebarComponent } from './docs-sidebar.component';

@Component({
  selector: 'docs-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, DocsSidebarComponent, RouterOutlet],
  templateUrl: './docs-layout.component.html'
})
export class DocsLayoutComponent {}

