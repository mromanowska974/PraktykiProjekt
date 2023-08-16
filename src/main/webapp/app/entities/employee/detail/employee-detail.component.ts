import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeUpdateComponent } from '../update/employee-update.component';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';

@Component({
  standalone: true,
  selector: 'jhi-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EmployeeDetailComponent implements OnInit {
  employees: IEmployee[] | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected employeeService: EmployeeService,
    protected dialog: MatDialog,
    protected businessServiceService: BusinessServiceService,
    protected internalServiceService: InternalServiceService
  ) {}

  ngOnInit(): void {
    this.employeeService.query().subscribe(resp => {
      this.employees = resp.body;
    });
  }

  onEdit(employee: IEmployee) {
    this.dialog.open(EmployeeUpdateComponent, {
      data: {
        action: 'EDIT',
        employee: employee,
      },
    });
  }

  onDelete(employee: IEmployee) {
    if (confirm('Czy na pewno chcesz usunąć wybranego pracownika?')) {
      this.businessServiceService.findByEmployee(employee.id).subscribe(resp => {
        if (resp.body?.length === 0) {
          this.internalServiceService.findByEmployee(employee.id).subscribe(resp2 => {
            if (resp2.body?.length === 0) {
              this.employeeService.delete(employee.id).subscribe(() => {
                window.location.reload();
              });
            } else {
              confirm(
                'Nie można usunąć wybranego pracownika, ponieważ jest powiązany z co najmniej jedną Usługą Biznesową i/lub Wewnętrzną.'
              );
            }
          });
        } else {
          confirm('Nie można usunąć wybranego pracownika, ponieważ jest powiązany z co najmniej jedną Usługą Biznesową i/lub Wewnętrzną.');
        }
      });
    }
  }
}
