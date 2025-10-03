import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  ElementRef,
  AfterContentInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent implements AfterContentInit, OnDestroy {
  @Input() clickable = false;
  @Input() hostClass = '';
  @Output() activate = new EventEmitter<void>();
  @ContentChildren('[start]', { read: ElementRef }) _startSlots!: QueryList<ElementRef>;
  @ContentChildren('[end]', { read: ElementRef }) _endSlots!: QueryList<ElementRef>;
  hasStartSlot = false;
  hasEndSlot = false;

  private _startSub: any;
  private _endSub: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.hasStartSlot = !!(this._startSlots && this._startSlots.length > 0);
    this.hasEndSlot = !!(this._endSlots && this._endSlots.length > 0);

    // Subscribe to changes so dynamically projected nodes update the flags
    this._startSub = this._startSlots.changes.subscribe(() => {
      this.hasStartSlot = this._startSlots.length > 0;
      this.cdr.markForCheck();
    });

    this._endSub = this._endSlots.changes.subscribe(() => {
      this.hasEndSlot = this._endSlots.length > 0;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this._startSub) this._startSub.unsubscribe?.();
    if (this._endSub) this._endSub.unsubscribe?.();
  }

  onActivate() {
    if (!this.clickable) return;
    this.activate.emit();
  }
}
