import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-business-service-edit',
  templateUrl: './business-service-edit.component.html',
  styleUrls: ['./business-service-edit.component.scss'],
})
export class BusinessServiceEditComponent {
  sectionSelected: string = 'A';

  constructor(private router: Router) {}

  onSelectSection(section: string) {
    this.sectionSelected = section;
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
