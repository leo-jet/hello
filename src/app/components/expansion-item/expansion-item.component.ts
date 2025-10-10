import { Component, input, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expansion-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class ExpansionItemComponent {
  /** Label text for the expansion header */
  label = input<string>('');

  /** Icon class for the expansion header */
  icon = input<string>('');

  /** Caption text below the label */
  caption = input<string>('');

  /** If true, the expansion is opened by default */
  defaultOpened = input<boolean>(false);

  /** Manually control the expanded state */
  modelValue = input<boolean | undefined>(undefined);

  /** Dense mode (smaller padding) */
  dense = input<boolean>(false);

  /** Header inset (adds left padding) */
  headerInset = input<boolean>(false);

  /** Expand icon position */
  expandIconPosition = input<'left' | 'right'>('right');

  /** Custom expand icon */
  expandIcon = input<string>('fas fa-chevron-down');

  /** Additional CSS classes for header */
  headerClass = input<string>('');

  /** Additional CSS classes for container */
  hostClass = input<string>('');

  /** Emits when expansion state changes */
  update = output<boolean>();

  // Internal expanded state
  private internalExpanded = signal(false);

  expanded = computed(() => {
    const modelVal = this.modelValue();
    if (modelVal !== undefined) {
      return modelVal;
    }
    return this.internalExpanded();
  });

  constructor() {
    // Set default opened state
    this.internalExpanded.set(this.defaultOpened());
  }

  toggleExpansion() {
    const newState = !this.expanded();
    this.internalExpanded.set(newState);
    this.update.emit(newState);
  }

  headerClasses = computed(() => {
    const base = 'w-full flex items-center transition-colors cursor-pointer';
    const padding = this.dense() ? 'px-2 py-1' : 'px-3 py-2';
    const inset = this.headerInset() ? 'pl-9' : '';
    const hover = 'hover:bg-gray-100 rounded';

    return `${base} ${padding} ${inset} ${hover} ${this.headerClass()}`.trim();
  });

  expandIconClasses = computed(() => {
    const base = 'fas fa-chevron-down text-xs transition-transform';
    const rotated = this.expanded() ? 'rotate-180' : '';

    return `${base} ${rotated}`.trim();
  });
}
