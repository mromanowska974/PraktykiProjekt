import { Component, Inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ParameterFormService, ParameterFormGroup } from './parameter-form.service';
import { IParameter } from '../parameter.model';
import { ParameterService } from '../service/parameter.service';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { ParameterType } from 'app/entities/enumerations/parameter-type.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'jhi-parameter-update',
  templateUrl: './parameter-update.component.html',
  styleUrls: ['./parameter-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ParameterUpdateComponent implements OnInit {
  parameter: IParameter | null = {} as IParameter;

  isNameEntered: boolean = false;
  isValueEntered: boolean = false;
  isSaveBtnClicked: boolean = false;

  constructor(
    protected parameterService: ParameterService,
    protected parameterFormService: ParameterFormService,
    protected businessServiceService: BusinessServiceService,
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ParameterUpdateComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.action === 'ADD') this.parameter!.type = this.data.parameterType;

    if (this.data.action === 'EDIT') this.parameter = this.data.parameter;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.isNameEntered = this.parameter!.name !== undefined && this.parameter!.name!.length > 0 ? true : false;
    this.isValueEntered = this.parameter!.value !== undefined && this.parameter!.value!.length > 0 ? true : false;

    if (this.isNameEntered && this.isValueEntered) {
      this.parameterService.sendCreatedParameter(this.parameter!);
      this.dialogRef.close();
    } else {
      this.isSaveBtnClicked = true;
    }
  }
}
