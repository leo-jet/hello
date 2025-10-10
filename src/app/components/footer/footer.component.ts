import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  // Suppression de OnPush pour permettre la détection de changement normale
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() companyName?: string;
  @Input() showDefaultContent = true;
  @Input() hasContent = false;

  currentYear = new Date().getFullYear();
}
