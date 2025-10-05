# Utils

This folder contains utility libraries with common helper functions for various operations.

## Available Utils

### Date Utils (`date-utils.ts`)
Utility functions for date manipulation and formatting:
- `formatDate()` - Format dates with custom patterns
- `getRelativeTime()` - Get human-readable relative time
- `isToday()` - Check if date is today
- `addDays()` - Add/subtract days from date
- `startOfDay()` / `endOfDay()` - Get start/end of day

### String Utils (`string-utils.ts`)
Utility functions for string manipulation:
- `capitalize()` - Capitalize first letter
- `toKebabCase()` / `toCamelCase()` / `toPascalCase()` - Case conversions
- `truncate()` - Truncate with ellipsis
- `randomString()` - Generate random strings
- `stripHtml()` - Remove HTML tags
- `escapeHtml()` - Escape HTML entities

### Array Utils (`array-utils.ts`)
Utility functions for array operations:
- `unique()` / `uniqueBy()` - Remove duplicates
- `groupBy()` - Group by property
- `sortBy()` - Sort by property
- `chunk()` - Split into chunks
- `shuffle()` - Randomize order
- `intersection()` / `difference()` - Set operations

### Object Utils (`object-utils.ts`)
Utility functions for object manipulation:
- `deepClone()` - Deep copy objects
- `deepMerge()` - Merge objects recursively
- `get()` / `set()` / `has()` - Nested property access
- `pick()` / `omit()` - Select/exclude properties
- `isEmpty()` - Check if empty

### Validation Utils (`validation-utils.ts`)
Utility functions for data validation:
- `isEmail()` / `isPhoneNumber()` / `isUrl()` - Format validation
- `isStrongPassword()` - Password strength validation
- `isCreditCard()` - Credit card validation (Luhn algorithm)
- `isIPv4()` / `isHexColor()` / `isJSON()` - Type validation
- `minLength()` / `maxLength()` / `inRange()` - Range validation

### Storage Utils (`storage-utils.ts`)
Utility functions for browser storage:
- `setLocal()` / `getLocal()` - localStorage with JSON serialization
- `setSession()` / `getSession()` - sessionStorage with JSON serialization
- `clearLocal()` / `clearSession()` - Clear storage
- `isLocalStorageAvailable()` - Feature detection
- `getLocalStorageSize()` - Usage monitoring

### HTTP Utils (`http-utils.ts`)
Utility functions for HTTP operations:
- `buildQueryString()` / `parseQueryString()` - URL parameter handling
- `createFormData()` - FormData creation from objects
- `downloadFile()` - File download helper
- `blobToBase64()` / `base64ToBlob()` - Data conversion
- `isAbsoluteUrl()` / `joinPaths()` - URL manipulation

## Usage Examples

```typescript
import { 
  DateUtils, 
  StringUtils, 
  ArrayUtils, 
  ValidationUtils 
} from './utils';

// Date operations
const formatted = DateUtils.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
const relative = DateUtils.getRelativeTime(new Date(Date.now() - 3600000));

// String operations
const kebab = StringUtils.toKebabCase('MyComponentName');
const truncated = StringUtils.truncate('Long text here', 10);

// Array operations
const unique = ArrayUtils.unique([1, 2, 2, 3, 3, 4]);
const grouped = ArrayUtils.groupBy(users, 'role');

// Validation
const isValid = ValidationUtils.isEmail('user@example.com');
const passwordCheck = ValidationUtils.isStrongPassword('MyPassword123!');
```

## Design Principles

- **Pure Functions**: All utilities are pure functions without side effects
- **Type Safety**: Full TypeScript support with proper type definitions
- **Performance**: Optimized implementations for common operations
- **Consistency**: Consistent API patterns across all utilities
- **Error Handling**: Graceful error handling with fallbacks

## Testing

Each utility library should be thoroughly tested:
- Unit tests for individual functions
- Edge case testing
- Performance testing for large datasets
- Browser compatibility testing

## Extension

To add new utilities:
1. Create new utility class in separate file
2. Follow existing naming patterns
3. Add comprehensive JSDoc comments
4. Export from `index.ts`
5. Update this README
