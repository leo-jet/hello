import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-suggestion-card',
  standalone: true,
  templateUrl: './suggestion-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class SuggestionCardComponent {
  /** Title of the suggestion */
  title = input.required<string>();

  /** Description/subtitle of the suggestion */
  description = input.required<string>();

  /** Icon class (FontAwesome or other) */
  icon = input.required<string>();

  /** Color class for the icon */
  iconColor = input<string>('text-blue-500');

  /** Additional CSS classes for the button */
  hostClass = input<string>('');

  /** Emits when the card is clicked */
  cardClick = output<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}
