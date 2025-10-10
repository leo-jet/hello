import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-item-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item-section.component.html',
  styleUrls: ['./list-item-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemSectionComponent {
  /** Makes the section display as an avatar (circular, fixed size) */
  avatar = input<boolean>(false);

  /** Makes the section display as a thumbnail (square, fixed size) */
  thumbnail = input<boolean>(false);

  /** Makes the section display on the side (icon, smaller) */
  side = input<boolean>(false);

  /** Aligns content to top instead of center (useful for multiline) */
  top = input<boolean>(false);

  /** Custom classes */
  hostClass = input<string>('');

  sectionClasses = computed(() => {
    // Type-specific styles
    let typeClasses = '';
    let baseClasses = '';

    if (this.avatar()) {
      baseClasses = 'flex items-center';
      typeClasses = 'flex-shrink-0 mr-3';
    } else if (this.thumbnail()) {
      baseClasses = 'flex items-center';
      typeClasses = 'flex-shrink-0 mr-3';
    } else if (this.side()) {
      baseClasses = 'flex items-center';
      typeClasses = 'flex-shrink-0 ml-3';
    } else {
      // Main section (takes all available space, stacks labels vertically)
      const alignment = this.top() ? 'justify-start' : 'justify-center';
      baseClasses = `flex flex-col ${alignment}`;
      typeClasses = 'flex-1 min-w-0';
    }

    return `${baseClasses} ${typeClasses} ${this.hostClass()}`.trim();
  });
}
