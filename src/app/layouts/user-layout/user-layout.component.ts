import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLayoutComponent {
  title = 'User Dashboard';
}