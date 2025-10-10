import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ListItemVariant = 'default' | 'navigation' | 'navigation-mode';
export type ListItemSize = 'default' | 'sm';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  // === Quasar-like Props ===

  /** Makes the item clickable with hover effects */
  clickable = input<boolean>(true);

  /** Marks the item as active/selected */
  active = input<boolean>(false);

  /** Dense mode (smaller padding) */
  dense = input<boolean>(false);

  /** Manual control of item tag (default: 'li') */
  tag = input<'li' | 'div'>('li');

  /** Custom classes */
  hostClass = input<string>('');

  /** Visual variant (navigation, navigation-mode, default) */
  variant = input<ListItemVariant>('default');

  /** Size variant (sm, default) */
  size = input<ListItemSize>('default');

  // === Output ===
  activate = output<void>();

  // Computed classes based on Quasar structure
  itemClasses = computed(() => {
    const base = 'w-full flex items-center transition-colors';

    // Padding based on dense mode
    const padding = this.dense() ? 'px-2 py-1' : 'px-3 py-2';

    // Size
    const sizeClass = this.size() === 'sm' ? 'text-sm' : '';

    // Clickable cursor
    const cursorClass = this.clickable() ? 'cursor-pointer' : '';

    // Active/hover states based on variant
    let variantClasses = '';
    const isActive = this.active();

    switch (this.variant()) {
      case 'navigation':
        variantClasses = isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100';
        break;
      case 'navigation-mode':
        variantClasses = isActive
          ? 'bg-blue-100 text-blue-900'
          : 'text-gray-600 hover:bg-gray-50';
        break;
      case 'default':
      default:
        variantClasses = isActive
          ? 'bg-gray-100'
          : this.clickable()
            ? 'hover:bg-gray-50'
            : '';
        break;
    }

    return `${base} ${padding} ${sizeClass} ${variantClasses} ${cursorClass} ${this.hostClass()}`.trim();
  });

  onActivate() {
    if (!this.clickable()) return;
    this.activate.emit();
  }
}
