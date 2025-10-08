import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
  signal,
  ViewChild,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnDestroy {
  @Input() options: any[] = [];
  @Input() valueField = 'value';
  @Input() labelField = 'label';
  @Input() iconField = 'icon';
  @Input() imageField = 'img_path';
  @Input() buttonClass = '';
  @Input() menuClass = '';
  @Input() itemClass = '';
  @Input() returnObject = false;
  @Input() placeholder = 'Select';
  @Input() openUpward = false;

  @Input() set value(val: unknown) {
    this.selectedValue.set(val);
  }

  @Output() selection = new EventEmitter<unknown>();

  open = signal(false);
  selectedValue = signal<unknown | null>(null);

  @ViewChild('button', { static: true }) button!: ElementRef<HTMLButtonElement>;
  @ViewChild('menu') menu!: ElementRef<HTMLUListElement>;

  private host = inject(ElementRef);
  private documentClickHandler = this.handleDocumentClick.bind(this);
  menuStyles: { [k: string]: any } = {};

  selectedLabel = computed(() => {
    const val = this.selectedValue();
    const found = this.normalizedOptions?.find((o) => this.getValue(o) === val);
    return found ? this.getLabel(found) : null;
  });

  selectedIcon = computed(() => {
    const val = this.selectedValue();
    const found = this.normalizedOptions?.find((o) => this.getValue(o) === val);
    return found ? this.getIcon(found) : null;
  });

  get normalizedOptions(): any[] {
    return this.options.map(option => {
      if (typeof option === 'object' && option !== null) {
        return option;
      }
      return {
        [this.valueField]: option,
        [this.labelField]: option.toString()
      };
    });
  }

  constructor() {
    this.setupDocumentClickListener();
  }

  getValue(item: any): unknown {
    return this.getNestedValue(item, this.valueField);
  }

  getLabel(item: any): string {
    return this.getNestedValue(item, this.labelField) || '';
  }

  getIcon(item: any): string | undefined {
    return this.getNestedValue(item, this.iconField);
  }

  getImage(item: any): string | undefined {
    return this.getNestedValue(item, this.imageField);
  }

  private getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return undefined;

    if (typeof obj !== 'object') {
      if (path === this.valueField || path === this.labelField) {
        return obj;
      }
      return undefined;
    }

    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private setupDocumentClickListener() {
    // Utiliser setTimeout pour éviter que l'event listener soit ajouté immédiatement
    setTimeout(() => {
      document.addEventListener('click', this.documentClickHandler);
    }, 0);
  }

  private handleDocumentClick(event: Event) {
    if (!this.open()) return;

    const target = event.target as Element;
    const hostElement = this.host.nativeElement;
    const menuElement = this.menu?.nativeElement;

    // Vérifier si le clic est dans l'élément host ou dans le menu
    const isInsideHost = hostElement && hostElement.contains(target);
    const isInsideMenu = menuElement && menuElement.contains(target);

    // Fermer seulement si le clic est en dehors du composant ET du menu
    if (!isInsideHost && !isInsideMenu) {
      this.close();
    }
  }

  selectOption(opt: any) {
    const value = this.getValue(opt);
    this.selectedValue.set(value);
    this.selection.emit(this.returnObject ? opt : value);
    this.close();
  }

  toggle() {
    this.open.update((v) => !v);
    if (this.open()) {
      setTimeout(() => this.updateMenuPosition(), 0);
    } else {
      this.close();
    }
  }

  close() {
    this.open.set(false);
    this.menuStyles = {};
  }

  private updateMenuPosition() {
    const btn = this.button?.nativeElement;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const menuEl = this.menu?.nativeElement;

    let top = this.openUpward ? rect.top - (menuEl?.offsetHeight || 200) - 8 : rect.bottom + 8;
    let left = rect.left;

    // Ajustements pour éviter les débordements
    if (this.openUpward && top < 8) {
      top = rect.bottom + 8;
    }

    if (menuEl) {
      const estimatedWidth = Math.max(rect.width, menuEl.scrollWidth);
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
    };
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.documentClickHandler);
  }
}
