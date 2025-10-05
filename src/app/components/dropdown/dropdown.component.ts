/**
 * DropdownComponent
 * -----------------
 * Documentation placeholder:
 * - Full component documentation lives in `src/app/dropdown/README.md`.
 * - Use this JSDoc area to add short API notes, examples or links to the README.
 *
 * TODO:
 * - Add inline examples for each Input/Output when we expand docs here.
 */
import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy, inject, computed, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onOutsideClick($event)',
    '(window:resize)': 'onWindowResize()',
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class DropdownComponent {
  private _menuAppendedToBody = false;
  // signals for local state
  open = signal(false);
  selectedValue = signal<unknown | null>(null);

  /** Optional class overrides to let the host customize styling */
  @Input() hostClass = '';
  @Input() buttonClass = '';
  @Input() menuClass = '';
  @Input() itemClass = '';
  /** if true, the selection event will emit the whole option object instead of the option.value */
  @Input() returnObject = false;

  /** list of options provided to the component: { value, label, icon?, img_path? } */
  @Input() options: Array<{ value: unknown; label: string; icon?: string; img_path?: string }> = [];

  /** emits the selected value when an option is chosen */
  @Output() selection = new EventEmitter<unknown>();

  // ViewChild refs to compute position
  @ViewChild('button', { static: true }) button!: ElementRef<HTMLButtonElement>;
  @ViewChild('menu') menu!: ElementRef<HTMLUListElement>;

  // host element (injected)
  private host = inject(ElementRef);

  // derived label as computed signal
  selectedLabel = computed(() => {
    const val = this.selectedValue();
    const found = this.options?.find(o => o.value === val);
    return found ? found.label : null;
  });

  // Subjects so templates can use the async pipe
  private _selectedLabel$ = new BehaviorSubject<string | null>(this.selectedLabel());
  selectedLabel$ = this._selectedLabel$.asObservable();

  // derived selected option object (if any)
  selectedOption = computed(() => {
    const val = this.selectedValue();
    return this.options?.find(o => o.value === val) ?? null;
  });

  private _selectedOption$ = new BehaviorSubject<{ value: unknown; label: string; icon?: string; img_path?: string } | null>(this.selectedOption());
  selectedOption$ = this._selectedOption$.asObservable();

  // observable for open state
  private _open$ = new BehaviorSubject<boolean>(this.open());
  open$ = this._open$.asObservable();

  constructor() {
    // keep subjects in sync with signals
    effect(() => this._selectedLabel$.next(this.selectedLabel()));
    effect(() => this._selectedOption$.next(this.selectedOption()));
    effect(() => this._open$.next(this.open()));
  }

  // styles applied to the menu when open (fixed positioning)
  menuStyles: { [k: string]: any } = {};

  toggle() {
    this.open.update(v => !v);
    if (this.open()) {
      // wait for menu to render then compute position
      setTimeout(() => this.updateMenuPosition());
    }
  }

  close() {
    this.open.set(false);
    this.menuStyles = {};
    // remove menu from body if appended
    this.removeMenuFromBody();
  }

  onOutsideClick(event: Event) {
    if (!this.host.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  onButtonKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.open.set(true);
      // focus first menu item if present
      setTimeout(() => {
        this.updateMenuPosition();
        this.menu?.nativeElement.querySelector('button')?.focus();
      });
    }
  }

  onWindowResize() {
    if (this.open()) this.updateMenuPosition();
  }

  onWindowScroll() {
    if (this.open()) this.updateMenuPosition();
  }

  selectOption(opt: { value: unknown; label: string; icon?: string; img_path?: string }) {
    // keep internal selectedValue as the option's value for display/lookup consistency
    this.selectedValue.set(opt.value);
    const payload = this.returnObject ? opt : opt.value;
    this.selection.emit(payload);
    this.close();
  }

  private updateMenuPosition() {
    const btn = this.button?.nativeElement;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    // Position the menu fixed to avoid ancestor clipping. Align to button's left by default.
    const menuEl = this.menu?.nativeElement;
    const top = rect.bottom + 8;
    let left = rect.left;

    // For collision detection compute estimated content width, but do not set it as a fixed width.
    let estimatedWidth = Math.ceil(rect.width);
    if (menuEl) {
      menuEl.style.width = 'auto';
      const contentWidth = Math.ceil(menuEl.scrollWidth || menuEl.clientWidth || estimatedWidth);
      const maxAllowed = Math.max(100, window.innerWidth - 16);
      estimatedWidth = Math.min(Math.max(contentWidth, estimatedWidth), maxAllowed);

      // If menu would overflow right edge, shift left so it stays visible
      if (left + estimatedWidth > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - estimatedWidth - 8);
      }
    }

    this.menuStyles = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      minWidth: `${rect.width}px`,
      zIndex: 2147483647,
      pointerEvents: 'auto',
    };

    // Move menu element to document.body so it will overlay everything (avoids stacking context issues)
    try {
      if (menuEl && menuEl.parentElement !== document.body) {
        document.body.appendChild(menuEl);
        this._menuAppendedToBody = true;
      }
    } catch (e) {
      // ignore (e.g., SSR or restricted env)
    }
  }

  ngOnDestroy(): void {
    this.removeMenuFromBody();
  }

  private removeMenuFromBody() {
    try {
      const menuEl = this.menu?.nativeElement;
      if (menuEl && menuEl.parentElement === document.body) {
        document.body.removeChild(menuEl);
        this._menuAppendedToBody = false;
      }
    } catch (e) {
      // noop
    }
  }
}
