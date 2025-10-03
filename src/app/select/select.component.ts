import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, computed, signal, effect, ViewChild, ElementRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onOutsideClick($event)',
    '(window:resize)': 'onWindowResize()',
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class SelectComponent {
  // state
  open = signal(false);
  selectedValue = signal<unknown | null>(null);

  @Input() options: Array<{ value: unknown; label: string; icon?: string; img_path?: string }> = [];
  @Input() hostClass = '';
  @Input() buttonClass = '';
  @Input() menuClass = '';
  @Input() itemClass = '';
  @Input() returnObject = false;

  @Output() selection = new EventEmitter<unknown>();

  @ViewChild('button', { static: true }) button!: ElementRef<HTMLButtonElement>;
  @ViewChild('menu') menu!: ElementRef<HTMLUListElement>;
  @ViewChild('panel') panel!: ElementRef<HTMLDivElement>;

  private _menuAppendedToBody = false;

  // host element reference (available in class scope)
  private host = inject(ElementRef);

  // styles applied to the menu when open (fixed positioning)
  menuStyles: { [k: string]: any } = {};

  selectedLabel = computed(() => {
    const val = this.selectedValue();
    const found = this.options?.find(o => o.value === val);
    return found ? found.label : null;
  });

  private _selectedLabel$ = new BehaviorSubject<string | null>(this.selectedLabel());
  selectedLabel$ = this._selectedLabel$.asObservable();

  private _open$ = new BehaviorSubject<boolean>(this.open());
  open$ = this._open$.asObservable();

  // hovered option used to render the secondary panel
  hoveredOption: { value: unknown; label?: string } | null = null;
  panelStyles: { [k: string]: any } = {};
  private _panelAppendedToBody = false;

  constructor() {
    effect(() => this._selectedLabel$.next(this.selectedLabel()));
    effect(() => this._open$.next(this.open()));
  }

  onOptionMouseOver(opt: { value: unknown; label?: string }, event?: MouseEvent) {
    // open the secondary panel showing option details
    this.hoveredOption = opt as any;
    try {
      const btn = event?.currentTarget as HTMLElement | undefined;
      const rect = btn ? btn.getBoundingClientRect() : undefined;
      if (rect) {
        this.panelStyles = {
          position: 'fixed',
          top: `${rect.top}px`,
          left: `${rect.right + 8}px`,
          zIndex: 2147483647,
        };
        // append panel to body so it overlays
        const panelEl = this.panel?.nativeElement;
        if (panelEl && panelEl.parentElement !== document.body) {
          try { document.body.appendChild(panelEl); this._panelAppendedToBody = true; } catch (e) {}
        }
      }
    } catch (e) {
      // ignore
    }
  }

  onOptionMouseLeave() {
    // hide the secondary panel
  }

  selectOption(opt: { value: unknown; label: string; icon?: string; img_path?: string }) {
    this.selectedValue.set(opt.value);
    this.selection.emit(this.returnObject ? opt : opt.value);
    this.open.set(false);
    this.menuStyles = {};
    // remove from body if appended
    this.removeMenuFromBody();
  }

  toggle() {
    this.open.update(v => !v);
    if (this.open()) {
      setTimeout(() => this.updateMenuPosition());
    } else {
      this.menuStyles = {};
    }
  }

  close() {
    this.open.set(false);
    this.menuStyles = {};
    this.removeMenuFromBody();
  }

  onOutsideClick(event: Event) {
    if (!this.host.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  onWindowResize() {
    if (this.open()) this.updateMenuPosition();
  }

  onWindowScroll() {
    if (this.open()) this.updateMenuPosition();
  }

  private updateMenuPosition() {
    const btn = this.button?.nativeElement;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuEl = this.menu?.nativeElement;
    const top = rect.bottom + 8;
    let left = rect.left;

    let estimatedWidth = Math.ceil(rect.width);
    try {
      if (menuEl) {
        menuEl.style.width = 'auto';
        const contentWidth = Math.ceil(menuEl.scrollWidth || menuEl.clientWidth || estimatedWidth);
        const maxAllowed = Math.max(100, window.innerWidth - 16);
        estimatedWidth = Math.min(Math.max(contentWidth, estimatedWidth), maxAllowed);
        if (left + estimatedWidth > window.innerWidth - 8) {
          left = Math.max(8, window.innerWidth - estimatedWidth - 8);
        }
      }
    } catch (e) {}

    this.menuStyles = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      minWidth: `${rect.width}px`,
      zIndex: 2147483647,
      pointerEvents: 'auto',
    };

    try {
      if (menuEl && menuEl.parentElement !== document.body) {
        document.body.appendChild(menuEl);
        this._menuAppendedToBody = true;
      }
    } catch (e) {}
  }

  ngOnDestroy(): void {
    this.removeMenuFromBody();
    try {
      const panelEl = this.panel?.nativeElement;
      if (panelEl && panelEl.parentElement === document.body) {
        document.body.removeChild(panelEl);
        this._panelAppendedToBody = false;
      }
    } catch (e) {}
  }

  private removeMenuFromBody() {
    try {
      const menuEl = this.menu?.nativeElement;
      if (menuEl && menuEl.parentElement === document.body) {
        document.body.removeChild(menuEl);
        this._menuAppendedToBody = false;
      }
    } catch (e) {}
  }
}
