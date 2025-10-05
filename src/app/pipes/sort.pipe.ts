import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to sort arrays by a property
 * Usage: {{ items | sort:'name' }} or {{ items | sort:'date':'desc' }}
 */
@Pipe({
  name: 'sort',
  standalone: true,
  pure: false // Use pure: false for arrays that might be modified
})
export class SortPipe implements PipeTransform {
  transform<T>(items: T[], property: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    if (!items || !Array.isArray(items)) {
      return items || [];
    }

    if (!property) {
      return items;
    }

    return [...items].sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];

      // Handle null/undefined values
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return order === 'asc' ? -1 : 1;
      if (valueB == null) return order === 'asc' ? 1 : -1;

      // Handle different types
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return order === 'asc' ? comparison : -comparison;
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        const comparison = valueA.getTime() - valueB.getTime();
        return order === 'asc' ? comparison : -comparison;
      }

      // Default comparison
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
