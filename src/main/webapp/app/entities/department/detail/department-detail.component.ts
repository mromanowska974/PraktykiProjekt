import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';
import { DepartmentUpdateComponent } from '../update/department-update.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'jhi-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class DepartmentDetailComponent implements OnInit {
  departments: IDepartment[] | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected departmentService: DepartmentService, protected dialog: MatDialog) {}

  ngOnInit(): void {
    this.departmentService.query().subscribe(resp => {
      this.departments = resp.body;
    });
  }

  onEdit() {
    this.dialog.open(DepartmentUpdateComponent, {
      data: {
        action: 'EDIT',
      },
    });
  }

  onDelete(department: IDepartment) {
    if (confirm('Czy na pewno chcesz usunąć wybranego pracownika?')) {
      this.departmentService.delete(department.id).subscribe(() => {
        window.location.reload();
      });
    }
  }
}
