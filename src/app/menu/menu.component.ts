import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  exportAs: 'appMenu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
})
export class MenuComponent {
  /** FontAwesome class (or any icon class) */
  @Input() iconClass = 'fa-solid fa-plus';
  @Input() ariaLabel = 'Menu';
  @Input() hostClass = '';
  @Input() buttonClass = '';
  /** placement of the panel relative to the button: 'bottom' (default) or 'top' */
  @Input() placement: 'bottom' | 'top' = 'top';

  /** Emits when open state changes */
  @Output() openChange = new EventEmitter<boolean>();

  open = signal(false);

  @ViewChild('button', { static: true }) button!: ElementRef<HTMLButtonElement>;
  @ViewChild('panel', { static: false }) panel!: ElementRef<HTMLElement>;
  private _ignored = new Set<HTMLElement>();

  /**
   * Register an element whose clicks should NOT close the menu (useful for overlays appended to body).
   * The child component should call this with the root element of its overlay.
   */
  registerIgnoreElement(el: HTMLElement) {
    if (el) this._ignored.add(el);
  }

  unregisterIgnoreElement(el: HTMLElement) {
    if (el) this._ignored.delete(el);
  }

  toggle() {
    this.open.update(v => {
      const nv = !v;
      this.openChange.emit(nv);
      return nv;
    });
  }

  openMenu() {
    this.open.set(true);
    this.openChange.emit(true);
  }

  closeMenu() {
    this.open.set(false);
    this.openChange.emit(false);
  }

  onDocumentClick(event: Event) {
    const target = event.target as Node | null;
    if (!target) return;

    // if click inside the trigger button, ignore
    if (this.button && this.button.nativeElement.contains(target)) return;

    // if panel is present and contains the click target, ignore
    if (this.panel && this.panel.nativeElement && this.panel.nativeElement.contains(target)) return;

    // if click is inside any registered ignored overlay (for appended overlays), ignore
    for (const el of this._ignored) {
      if (el && el.contains && el.contains(target)) return;
    }

    // otherwise close
    this.closeMenu();
  }
}
