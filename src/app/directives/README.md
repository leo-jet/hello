# Angular Directives

This folder contains reusable Angular directives organized by functionality.

## Directory Structure

```
src/app/directives/
├── highlight.directive.ts        # Text/element highlighting directive
├── tooltip.directive.ts          # Tooltip display directive
├── click-outside.directive.ts    # Click outside detection directive
├── index.ts                      # Barrel exports for easy importing
└── README.md                     # This documentation
```

## Available Directives

### 1. HighlightDirective (`[appHighlight]`)
**Location:** `./highlight.directive.ts`

Adds mouse hover highlight effects to elements.

**Usage:**
```html
<div appHighlight="#ffeb3b">Hover me!</div>
<div [appHighlight]="'#e3f2fd'" [defaultColor]="'#fff'">Custom colors</div>
```

**Inputs:**
- `appHighlight`: Highlight color (default: '#ffeb3b')
- `defaultColor`: Default background color (default: 'transparent')

### 2. TooltipDirective (`[appTooltip]`)
**Location:** `./tooltip.directive.ts`

Displays tooltips on mouse hover with customizable positioning.

**Usage:**
```html
<button appTooltip="This is a tooltip">Hover for tooltip</button>
<span [appTooltip]="'Custom message'" [tooltipPosition]="'bottom'">Bottom tooltip</span>
```

**Inputs:**
- `appTooltip`: Tooltip text content
- `tooltipPosition`: Position ('top' | 'bottom' | 'left' | 'right')

### 3. ClickOutsideDirective (`[appClickOutside]`)
**Location:** `./click-outside.directive.ts`

Detects clicks outside of an element and emits an event.

**Usage:**
```html
<div appClickOutside (clickOutside)="closeModal()">
  <p>Click outside this div to trigger event</p>
</div>
```

**Outputs:**
- `clickOutside`: Event emitted when clicking outside the element

## Importing Directives

### Individual Import
```typescript
import { HighlightDirective } from './directives/highlight.directive';

@Component({
  imports: [HighlightDirective],
  // ...
})
```

### Bulk Import (using barrel exports)
```typescript
import { ALL_DIRECTIVES } from './directives';

@Component({
  imports: [...ALL_DIRECTIVES],
  // ...
})
```

### Selective Import
```typescript
import { HighlightDirective, TooltipDirective } from './directives';

@Component({
  imports: [HighlightDirective, TooltipDirective],
  // ...
})
```

## Creating New Directives

1. Create a new folder under `src/app/directives/`
2. Add your directive file: `your-directive.directive.ts`
3. Export it in `index.ts`
4. Update this README with usage documentation

## Best Practices

- Use standalone directives for Angular 14+
- Keep directive logic focused and single-purpose
- Provide clear input/output documentation
- Use TypeScript for better type safety
- Follow Angular naming conventions (`app` prefix)
