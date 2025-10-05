# Pipes

This folder contains custom Angular pipes for transforming data in templates.

## Available Pipes

### Truncate Pipe (`truncate.pipe.ts`)
Truncates text with ellipsis at a specified length:
- **Usage**: `{{ text | truncate:20 }}` or `{{ text | truncate:20:'...' }}`
- **Parameters**: `limit` (number), `suffix` (string, default: '...')

### Time Ago Pipe (`time-ago.pipe.ts`)
Displays relative time (e.g., "2 hours ago"):
- **Usage**: `{{ date | timeAgo }}`
- **Input**: Date, string, or number
- **Output**: Human-readable relative time

### Filter Pipe (`filter.pipe.ts`)
Filters arrays based on a search term:
- **Usage**: `{{ items | filter:'name':'search term' }}`
- **Parameters**: `searchProperty` (keyof T), `searchTerm` (string)
- **Note**: Uses `pure: false` for dynamic arrays

### Highlight Pipe (`highlight.pipe.ts`)
Highlights search terms in text with HTML spans:
- **Usage**: `{{ text | highlight:'search term' }}` or `{{ text | highlight:'term':'custom-class' }}`
- **Parameters**: `searchTerm` (string), `cssClass` (string, default: 'highlight')
- **Output**: HTML with highlighted terms

### File Size Pipe (`file-size.pipe.ts`)
Formats file sizes in human-readable format:
- **Usage**: `{{ size | fileSize }}` or `{{ size | fileSize:'MB' }}`
- **Parameters**: `unit` (optional: 'B', 'KB', 'MB', 'GB', 'TB')
- **Output**: Formatted size string

### Text Case Pipe (`text-case.pipe.ts`)
Converts text to different cases:
- **Usage**: `{{ text | textCase:'kebab' }}`
- **Options**: 'camel', 'pascal', 'kebab', 'snake', 'title', 'sentence'
- **Examples**:
  - `'hello world' | textCase:'camel'` → `'helloWorld'`
  - `'hello world' | textCase:'pascal'` → `'HelloWorld'`
  - `'helloWorld' | textCase:'kebab'` → `'hello-world'`

### Phone Number Pipe (`phone-number.pipe.ts`)
Formats phone numbers with standard patterns:
- **Usage**: `{{ phone | phoneNumber }}` or `{{ phone | phoneNumber:'(###) ###-####' }}`
- **Auto-formatting**: 7, 10, and 11-digit numbers
- **Custom format**: Use '#' as digit placeholder

### Safe HTML Pipe (`safe-html.pipe.ts`)
Sanitizes and safely displays HTML content:
- **Usage**: `{{ htmlContent | safeHtml }}`
- **Features**: Strips dangerous elements and attributes
- **Allowed tags**: p, br, strong, b, em, i, u, span, div, headings, lists
- **Note**: For production, consider using DOMPurify library

### Sort Pipe (`sort.pipe.ts`)
Sorts arrays by a specified property:
- **Usage**: `{{ items | sort:'name' }}` or `{{ items | sort:'date':'desc' }}`
- **Parameters**: `property` (keyof T), `order` ('asc' | 'desc', default: 'asc')
- **Features**: Handles strings, dates, numbers, and null values
- **Note**: Uses `pure: false` for dynamic arrays

## Usage in Components

To use these pipes in your components, import them:

```typescript
import { Component } from '@angular/core';
import { TruncatePipe, TimeAgoPipe, FilterPipe } from './pipes';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TruncatePipe, TimeAgoPipe, FilterPipe],
  template: `
    <p>{{ longText | truncate:50 }}</p>
    <span>{{ createdDate | timeAgo }}</span>
    <div *ngFor="let item of items | filter:'name':searchTerm">
      {{ item.name }}
    </div>
  `
})
export class ExampleComponent {
  longText = 'This is a very long text that needs to be truncated...';
  createdDate = new Date(Date.now() - 3600000); // 1 hour ago
  searchTerm = 'example';
  items = [
    { name: 'Example Item 1' },
    { name: 'Test Item 2' },
    { name: 'Example Item 3' }
  ];
}
```

## Template Examples

```html
<!-- Text transformation -->
<h1>{{ title | textCase:'title' }}</h1>
<p>{{ description | truncate:100 }}</p>

<!-- Data formatting -->
<span>{{ fileSize | fileSize }}</span>
<span>{{ phoneNumber | phoneNumber }}</span>
<time>{{ createdAt | timeAgo }}</time>

<!-- Array operations -->
<div *ngFor="let user of users | sort:'name' | filter:'name':searchQuery">
  <span [innerHTML]="user.name | highlight:searchQuery"></span>
</div>

<!-- Safe HTML display -->
<div [innerHTML]="content | safeHtml"></div>
```

## Performance Considerations

- **Pure vs Impure**: Pipes like `filter` and `sort` use `pure: false` because they work with arrays that may change
- **Heavy Operations**: Consider using `OnPush` change detection with pipes that perform expensive operations
- **Caching**: For complex transformations, consider caching results in the component

## Custom Pipe Creation

To create new pipes:

1. Generate using Angular CLI: `ng generate pipe pipes/my-pipe`
2. Implement `PipeTransform` interface
3. Add `standalone: true` for standalone components
4. Export from `index.ts`
5. Add documentation to this README

## Testing

Each pipe should have comprehensive unit tests:
- Test with valid inputs
- Test with edge cases (null, undefined, empty)
- Test with invalid inputs
- Performance testing for large datasets