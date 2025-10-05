import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<Event>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = this.el.nativeElement.contains(target);
    
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: Event) {
    this.onClick(event);
  }
}