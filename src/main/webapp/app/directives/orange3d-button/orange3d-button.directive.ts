import { Directive, ElementRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[jhiOrange3dButton]',
})
export class Orange3dButtonDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = 'rgb(251, 156, 73)';
    this.el.nativeElement.style.color = 'white';
    this.el.nativeElement.style.fontWeight = 600;
    this.el.nativeElement.style.fontSize = '15px';
    this.el.nativeElement.style.border = 'transparent';
    this.el.nativeElement.style.boxShadow = '3px 3px 5px inset rgb(255, 214, 179), -3px -3px 5px inset rgb(215, 133, 61)';
  }
}
