import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';

@Component({
  standalone: true,
  selector: 'jhi-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class DepartmentDetailComponent implements OnInit {
  departments: IDepartment[] | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.departmentService.query().subscribe(resp => {
      this.departments = resp.body;
    });
  }
}
