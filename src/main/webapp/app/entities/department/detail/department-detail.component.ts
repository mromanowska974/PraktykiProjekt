import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';
import { DepartmentUpdateComponent } from '../update/department-update.component';
import { MatDialog } from '@angular/material/dialog';
import { BusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';

@Component({
  standalone: true,
  selector: 'jhi-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class DepartmentDetailComponent implements OnInit {
  departments: IDepartment[] | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected departmentService: DepartmentService,
    protected dialog: MatDialog,
    protected businessServiceService: BusinessServiceService
  ) {}

  ngOnInit(): void {
    this.departmentService.query().subscribe(resp => {
      this.departments = resp.body;
    });
  }

  onEdit(department: IDepartment) {
    this.dialog.open(DepartmentUpdateComponent, {
      data: {
        action: 'EDIT',
        department: department,
      },
    });
  }

  onDelete(department: IDepartment) {
    if (confirm('Czy na pewno chcesz usunąć wybranego pracownika?')) {
      this.businessServiceService.findByDepartment(department.id).subscribe(resp => {
        if (resp.body?.length === 0) {
          console.log('mozna usunac');
          this.departmentService.delete(department.id).subscribe(() => {
            window.location.reload();
          });
        } else {
          confirm('Nie można usunąć wybranej spółki, ponieważ jest powiązana z co najmniej jedną Usługą Biznesową.');
        }
      });
    }
  }
}
