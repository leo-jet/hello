import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
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
  @Input() hostClass = '';

  /** If true, use a denser style (smaller paddings) */
  @Input() dense = false;

  get listClasses(): string {
    const base = 'w-full bg-white rounded-md';
    const density = this.dense ? 'text-sm' : '';
    return `${base} ${density} ${this.hostClass || ''}`.trim();
  }
}
