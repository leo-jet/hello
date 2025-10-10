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
  HostListener,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit, OnDestroy {
  // Identifiant unique pour chaque instance
  private static instanceCounter = 0;
  readonly instanceId = `select-${++SelectComponent.instanceCounter}`;

  // Registre statique de toutes les instances actives
  private static activeInstances = new Set<SelectComponent>();

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
  @Input() defaultValue: unknown = null;

  @Input() set value(val: unknown) {
    this.selectedValue.set(val);
  }

  @Output() selection = new EventEmitter<unknown>();

  open = signal(false);
  selectedValue = signal<unknown | null>(null);

  @ViewChild('button', { static: true }) button!: ElementRef<HTMLButtonElement>;
  @ViewChild('menu', { static: false }) menu?: ElementRef<HTMLUListElement>;

  private host = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
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

  selectedImage = computed(() => {
    const val = this.selectedValue();
    const found = this.normalizedOptions?.find((o) => this.getValue(o) === val);
    return found ? this.getImage(found) : null;
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
    console.log(`[Select:${this.instanceId}] constructor called`);
    // Enregistrer cette instance
    SelectComponent.activeInstances.add(this);
  }

  ngOnInit() {
    // Appliquer la valeur par défaut si elle existe et qu'aucune valeur n'est déjà définie
    if (this.defaultValue !== null && this.selectedValue() === null) {
      this.selectedValue.set(this.defaultValue);
    }
  }

  ngOnDestroy() {
    // Retirer cette instance du registre
    SelectComponent.activeInstances.delete(this);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.open()) return;

    const target = event.target as Element;
    const hostElement = this.host.nativeElement;
    const menuElement = this.menu?.nativeElement;

    const isInsideHost = hostElement && hostElement.contains(target);
    const isInsideMenu = menuElement && menuElement.contains(target);

    if (!isInsideHost && !isInsideMenu) {
      this.close();
    }
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

  selectOption(opt: any) {
    const value = this.getValue(opt);
    this.selectedValue.set(value);
    this.selection.emit(this.returnObject ? opt : value);
    this.close();
  }

  toggle() {
    const wasOpen = this.open();

    // Si on ouvre ce menu, fermer tous les autres
    if (!wasOpen) {
      this.closeOtherInstances();
    }

    this.open.set(!wasOpen);

    this.cdr.markForCheck();

    if (this.open()) {
      setTimeout(() => {
        this.updateMenuPosition();
        this.cdr.markForCheck();
      }, 0);
    } else {
      this.menuStyles = {};
    }
  }

  close() {
    this.open.set(false);
    this.menuStyles = {};
    this.cdr.markForCheck();
  }

  private closeOtherInstances() {
    // Fermer tous les autres menus Select ouverts
    SelectComponent.activeInstances.forEach(instance => {
      if (instance !== this && instance.open()) {
        instance.close();
      }
    });
  }

  private updateMenuPosition() {
    const btn = this.button?.nativeElement;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const menuEl = this.menu?.nativeElement;

    // Hauteur estimée du menu (ou hauteur réelle si disponible)
    const menuHeight = menuEl?.offsetHeight || 200;

    // Espace disponible en bas et en haut
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Décider si on ouvre vers le haut ou vers le bas
    let shouldOpenUpward = this.openUpward;

    // Si pas assez d'espace en bas ET qu'il y a plus d'espace en haut, ouvrir vers le haut
    if (!this.openUpward && spaceBelow < menuHeight + 16 && spaceAbove > spaceBelow) {
      shouldOpenUpward = true;
    }

    // Si forcé vers le haut mais pas assez d'espace, ouvrir vers le bas
    if (this.openUpward && spaceAbove < menuHeight + 16 && spaceBelow > spaceAbove) {
      shouldOpenUpward = false;
    }

    // Calculer la position top
    let top = shouldOpenUpward ? rect.top - menuHeight - 8 : rect.bottom + 8;
    let left = rect.left;

    // Ajustement final pour éviter les débordements
    if (shouldOpenUpward && top < 8) {
      top = 8;
    }

    if (!shouldOpenUpward && top + menuHeight > window.innerHeight - 8) {
      top = window.innerHeight - menuHeight - 8;
    }

    // Ajustement horizontal
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
}
