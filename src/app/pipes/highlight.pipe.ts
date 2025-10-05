import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to highlight search terms in text
 * Usage: {{ text | highlight:'search term' }}
 */
@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, searchTerm: string, cssClass: string = 'highlight'): string {
    if (!value || !searchTerm) {
      return value || '';
    }
    
    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
    return value.replace(regex, `<span class="${cssClass}">$1</span>`);
  }
  
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}