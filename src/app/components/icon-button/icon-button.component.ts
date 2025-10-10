import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  /** FontAwesome or other icon class */
  @Input() iconClass = 'fa-solid fa-circle';
  @Input() ariaLabel = 'Icon button';

  @Input() disabled = false;
  @Input() hostClass = '';
  @Input() buttonClass = '';

  @Output() pressed = new EventEmitter<void>();

  onClick(event: MouseEvent) {
    if (this.disabled) return;
    event.stopPropagation(); // Prevent parent click events
    this.pressed.emit();
  }

  get buttonClasses(): string {
    const base = 'w-10 h-10 bg-gray-100 rounded-full inline-flex items-center justify-center ';
    return `${base} ${this.buttonClass || ''}`.trim();
  }
}
