import { Component, ElementRef, ViewChild } from '@angular/core';
import { Orange3dButtonDirective } from 'app/directives/orange3d-button/orange3d-button.directive';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'jhi-cumulative-edit-page',
  templateUrl: './cumulative-edit-page.component.html',
  styleUrls: ['./cumulative-edit-page.component.scss'],
  imports: [Orange3dButtonDirective, RouterModule, CommonModule],
})
export class CumulativeEditPageComponent {
  sectionSelected: string = 'clients';

  @ViewChild('client') clientElement: ElementRef;

  onSelectSection(selectedSection: string) {
    this.sectionSelected = selectedSection;
  }
}
