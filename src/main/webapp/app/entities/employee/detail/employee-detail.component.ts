import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeUpdateComponent } from '../update/employee-update.component';

@Component({
  standalone: true,
  selector: 'jhi-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EmployeeDetailComponent implements OnInit {
  employees: IEmployee[] | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected employeeService: EmployeeService, protected dialog: MatDialog) {}

  ngOnInit(): void {
    this.employeeService.query().subscribe(resp => {
      this.employees = resp.body;
    });
  }

  onEdit() {
    this.dialog.open(EmployeeUpdateComponent, {
      data: {
        action: 'EDIT',
      },
    });
  }

  onDelete(employee: IEmployee) {
    if (confirm('Czy na pewno chcesz usunąć wybranego pracownika?')) {
      this.employeeService.delete(employee.id).subscribe(() => {
        window.location.reload();
      });
    }
  }
}
