import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to filter arrays based on a search term
 * Usage: {{ items | filter:'name':'search term' }}
 */
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false // Use pure: false for arrays that might be modified
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchProperty: keyof T, searchTerm: string): T[] {
    if (!items || !searchTerm || !searchProperty) {
      return items || [];
    }

    const term = searchTerm.toLowerCase();

    return items.filter(item => {
      const value = item[searchProperty];
      if (value === null || value === undefined) {
        return false;
      }
      return String(value).toLowerCase().includes(term);
    });
  }
}
