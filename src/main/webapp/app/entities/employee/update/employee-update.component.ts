import { Component, Inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeeFormService, EmployeeFormGroup } from './employee-form.service';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EmployeeUpdateComponent implements OnInit {
  employee: IEmployee | null = {} as IEmployee;

  isNameEntered: boolean = false;
  isSurnameEntered: boolean = false;
  isSaveBtnClicked: boolean = false;

  constructor(
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute,
    protected dialogRef: MatDialogRef<EmployeeUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    if (this.data.action === 'EDIT') {
      this.employee = this.data.employee;
    }
  }

  onSave() {
    this.isNameEntered = this.employee!.name !== undefined && this.employee!.name!.length > 0 ? true : false;
    this.isSurnameEntered = this.employee!.surname !== undefined && this.employee!.surname!.length > 0 ? true : false;

    if (this.isNameEntered && this.isSurnameEntered) {
      if (this.data.action === 'ADD') {
        this.employeeService.create(this.employee!).subscribe(() => {
          this.dialogRef.close();
          window.location.reload();
        });
      } else if (this.data.action === 'EDIT') {
        this.employeeService.update(this.employee!).subscribe(() => {
          this.dialogRef.close();
          window.location.reload();
        });
      }
    } else {
      this.isSaveBtnClicked = true;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
