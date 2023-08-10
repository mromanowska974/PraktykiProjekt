import { Component, Inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExternalCompanyFormService, ExternalCompanyFormGroup } from './external-company-form.service';
import { IExternalCompany } from '../external-company.model';
import { ExternalCompanyService } from '../service/external-company.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParameterUpdateComponent } from 'app/entities/parameter/update/parameter-update.component';

@Component({
  standalone: true,
  selector: 'jhi-external-company-update',
  templateUrl: './external-company-update.component.html',
  styleUrls: ['./external-company-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExternalCompanyUpdateComponent implements OnInit {
  externalCompany: IExternalCompany | null = {} as IExternalCompany;

  isNameEntered: boolean = false;
  isContractNumberEntered: boolean = false;
  isSLAParameterEntered: boolean = false;
  isSaveBtnClicked: boolean = false;

  constructor(
    protected externalCompanyService: ExternalCompanyService,
    protected activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ParameterUpdateComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.action === 'EDIT') this.externalCompany = this.data.externalCompany;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.isNameEntered = this.externalCompany!.name !== undefined && this.externalCompany!.name!.length > 0 ? true : false;
    this.isContractNumberEntered =
      this.externalCompany!.contractNumber !== undefined && this.externalCompany!.contractNumber!.length > 0 ? true : false;
    this.isSLAParameterEntered =
      this.externalCompany!.sLAParameters !== undefined && this.externalCompany!.sLAParameters!.length > 0 ? true : false;

    if (this.isNameEntered && this.isContractNumberEntered && this.isSLAParameterEntered) {
      this.externalCompanyService.sendCreatedExternalCompany(this.externalCompany!);
      this.dialogRef.close();
    } else {
      this.isSaveBtnClicked = true;
    }
  }
}
