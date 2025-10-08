import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title?: string;
  @Input() showToggleButton = true;
  @Input() showNotificationButton = false;
  @Input() notificationCount = 0;
  @Output() toggleEvent = new EventEmitter<void>();

  onToggle() {
    this.toggleEvent.emit();
  }
}
