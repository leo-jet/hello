import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-link',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-link.component.html',
  styleUrls: ['./sidebar-link.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLinkComponent {
  @Input() routerLink?: string | string[];
  @Input() routerLinkActiveOptions = { exact: false };
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() badge?: { text: string; type?: 'success' | 'info' | 'warning' | 'error' | 'default' };
}