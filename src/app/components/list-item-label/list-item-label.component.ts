import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-item-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item-label.component.html',
  styleUrls: ['./list-item-label.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemLabelComponent {
  /** Makes it a small header/overline text */
  overline = input<boolean>(false);

  /** Makes it a header (larger, bold) */
  header = input<boolean>(false);

  /** Makes it a caption (smaller, lighter) */
  caption = input<boolean>(false);

  /** Number of lines before truncation (uses line-clamp) */
  lines = input<number | undefined>(undefined);

  /** Custom classes */
  hostClass = input<string>('');

  labelClasses = computed(() => {
    let base = '';

    if (this.overline()) {
      base = 'text-xs uppercase tracking-wide text-gray-500 font-medium';
    } else if (this.header()) {
      base = 'text-sm font-semibold text-gray-900';
    } else if (this.caption()) {
      base = 'text-xs text-gray-500';
    } else {
      // Default label
      base = 'text-sm text-gray-700';
    }

    // Line clamping
    const lineClamp = this.lines()
      ? `line-clamp-${this.lines()}`
      : '';

    return `${base} ${lineClamp} ${this.hostClass()}`.trim();
  });
}
