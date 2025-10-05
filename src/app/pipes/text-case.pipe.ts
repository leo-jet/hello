import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to convert text to different cases
 * Usage: {{ text | textCase:'kebab' }} or {{ text | textCase:'camel' }}
 */
@Pipe({
  name: 'textCase',
  standalone: true
})
export class TextCasePipe implements PipeTransform {
  transform(value: string, caseType: 'camel' | 'pascal' | 'kebab' | 'snake' | 'title' | 'sentence'): string {
    if (!value) return '';
    
    switch (caseType) {
      case 'camel':
        return this.toCamelCase(value);
      case 'pascal':
        return this.toPascalCase(value);
      case 'kebab':
        return this.toKebabCase(value);
      case 'snake':
        return this.toSnakeCase(value);
      case 'title':
        return this.toTitleCase(value);
      case 'sentence':
        return this.toSentenceCase(value);
      default:
        return value;
    }
  }
  
  private toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }
  
  private toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
  }
  
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
  
  private toSnakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  }
  
  private toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  
  private toSentenceCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}