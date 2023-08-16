import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Orange3dButtonDirective } from 'app/directives/orange3d-button/orange3d-button.directive';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ClientUpdateComponent } from '../client/update/client-update.component';
import { DepartmentUpdateComponent } from '../department/update/department-update.component';
import { EmployeeUpdateComponent } from '../employee/update/employee-update.component';

@Component({
  standalone: true,
  selector: 'jhi-cumulative-edit-page',
  templateUrl: './cumulative-edit-page.component.html',
  styleUrls: ['./cumulative-edit-page.component.scss'],
  imports: [Orange3dButtonDirective, RouterModule, CommonModule],
})
export class CumulativeEditPageComponent implements OnInit {
  sectionSelected: string;

  constructor(private router: Router, private dialog: MatDialog, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    let route = this.activatedRoute.snapshot['_routerState'].url;
    switch (route) {
      case '/edit/clients':
        this.sectionSelected = 'clients';
        break;
      case '/edit/departments':
        this.sectionSelected = 'departments';
        break;
      case '/edit/employees':
        this.sectionSelected = 'employees';
        break;
      default:
        this.sectionSelected = 'clients';
        break;
    }
  }

  onSelectSection(selectedSection: string) {
    this.sectionSelected = selectedSection;
  }

  onCancel() {
    this.router.navigate(['']);
  }

  onAddElement() {
    if (this.sectionSelected === 'clients') {
      this.dialog.open(ClientUpdateComponent, {
        data: {
          action: 'ADD',
        },
      });
    } else if (this.sectionSelected === 'departments') {
      this.dialog.open(DepartmentUpdateComponent, {
        data: {
          action: 'ADD',
        },
      });
    } else if (this.sectionSelected === 'employees') {
      this.dialog.open(EmployeeUpdateComponent, {
        data: {
          action: 'ADD',
        },
      });
    }
  }
}
