import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DepartmentFormService, DepartmentFormGroup } from './department-form.service';
import { IDepartment } from '../department.model';
import { DepartmentService } from '../service/department.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'jhi-department-update',
  templateUrl: './department-update.component.html',
  styleUrls: ['./department-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DepartmentUpdateComponent implements OnInit {
  department: IDepartment | null = {} as IDepartment;

  isNameEntered: boolean = false;
  isSaveBtnClicked: boolean = false;

  constructor(
    protected departmentService: DepartmentService,
    protected activatedRoute: ActivatedRoute,
    protected dialogRef: MatDialogRef<DepartmentUpdateComponent>
  ) {}

  ngOnInit(): void {}

  onSave() {
    this.isNameEntered = this.department!.name !== undefined && this.department!.name!.length > 0 ? true : false;

    if (this.isNameEntered) {
      this.departmentService.create(this.department!).subscribe(() => {
        this.dialogRef.close();
        window.location.reload();
      });
    } else {
      this.isSaveBtnClicked = true;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
