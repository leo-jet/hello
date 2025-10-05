import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to safely display HTML content
 * Usage: {{ htmlContent | safeHtml }}
 * Note: This pipe strips potentially dangerous HTML elements and attributes
 */
@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
    'blockquote', 'code', 'pre'
  ];
  
  private readonly allowedAttributes = [
    'class', 'style'
  ];
  
  transform(value: string): string {
    if (!value) return '';
    
    // Basic HTML sanitization
    // Note: For production use, consider using a proper HTML sanitization library like DOMPurify
    return this.sanitizeHtml(value);
  }
  
  private sanitizeHtml(html: string): string {
    // Create a temporary DOM element
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Recursively clean the content
    this.cleanElement(temp);
    
    return temp.innerHTML;
  }
  
  private cleanElement(element: Element): void {
    const children = Array.from(element.children);
    
    for (const child of children) {
      // Check if tag is allowed
      if (!this.allowedTags.includes(child.tagName.toLowerCase())) {
        // Replace with span or remove
        const span = document.createElement('span');
        span.innerHTML = child.innerHTML;
        element.replaceChild(span, child);
        this.cleanElement(span);
      } else {
        // Clean attributes
        this.cleanAttributes(child);
        // Recursively clean children
        this.cleanElement(child);
      }
    }
  }
  
  private cleanAttributes(element: Element): void {
    const attributes = Array.from(element.attributes);
    
    for (const attr of attributes) {
      if (!this.allowedAttributes.includes(attr.name.toLowerCase())) {
        element.removeAttribute(attr.name);
      } else if (attr.name.toLowerCase() === 'style') {
        // Basic style sanitization
        element.setAttribute('style', this.sanitizeStyle(attr.value));
      }
    }
  }
  
  private sanitizeStyle(style: string): string {
    // Remove dangerous CSS properties
    const dangerousProperties = ['javascript:', 'expression(', 'url('];
    let cleanStyle = style;
    
    for (const dangerous of dangerousProperties) {
      cleanStyle = cleanStyle.replace(new RegExp(dangerous, 'gi'), '');
    }
    
    return cleanStyle;
  }
}