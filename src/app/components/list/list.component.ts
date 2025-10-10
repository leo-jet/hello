import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  /** Additional classes applied to the list container */
  hostClass = input<string>('');

  /** If true, use a denser style (smaller paddings) */
  dense = input<boolean>(false);

  /** Adds border around the list (Quasar-like) */
  bordered = input<boolean>(false);

  /** Adds separators between items (Quasar-like) */
  separator = input<boolean>(false);

  /** Adds padding inside the list container (Quasar-like) */
  padding = input<boolean>(false);

  listClasses = computed(() => {
    const base = 'w-full';
    const density = this.dense() ? 'text-sm' : '';
    const border = this.bordered() ? 'border border-gray-200 rounded-md' : '';
    const pad = this.padding() ? 'p-2' : '';

    // Separator will add space between items
    const separatorClass = this.separator() ? 'space-y-2' : '';

    return `${base} ${density} ${border} ${pad} ${separatorClass} ${this.hostClass()}`.trim();
  });
}
