# SelectComponent

Composant simple `SelectComponent` (standalone) — API minimale, similaire à `DropdownComponent`.

Inputs
- `options`: Array<{value,label,icon?,img_path?}>
- `hostClass`, `buttonClass`, `menuClass`, `itemClass`
- `returnObject`: boolean — si true renvoie l'objet complet à l'événement `selection`.

Outputs
- `selection`: EventEmitter<unknown>

Usage

```html
<app-select [options]="dropdownOptions" (selection)="onSelect($event)"></app-select>
```
