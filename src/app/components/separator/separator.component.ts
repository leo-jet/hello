import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-separator',
  standalone: true,
  templateUrl: './separator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeparatorComponent {
  /** If true, separator is vertical, otherwise horizontal */
  vertical = input<boolean>(false);

  /** If true, separator is inset (with margin) */
  inset = input<boolean>(false);

  /** Additional CSS classes */
  hostClass = input<string>('');

  separatorClasses = computed(() => {
    const base = 'border-0 bg-current opacity-12';
    const orientation = this.vertical()
      ? 'w-px h-full inline-block align-middle'
      : 'w-full h-px block';
    const insetClass = this.inset()
      ? (this.vertical() ? 'my-2' : 'mx-4')
      : '';

    return `${base} ${orientation} ${insetClass} ${this.hostClass()}`.trim();
  });
}
