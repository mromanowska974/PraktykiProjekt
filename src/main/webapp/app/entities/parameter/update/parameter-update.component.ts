import { Component, OnInit } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'jhi-parameter-update',
  templateUrl: './parameter-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ParameterUpdateComponent implements OnInit {
  isSaving = false;
  parameter: IParameter | null = null;

  businessServicesSharedCollection: IBusinessService[] = [];
  internalServicesSharedCollection: IInternalService[] = [];

  editForm: ParameterFormGroup = this.parameterFormService.createParameterFormGroup();

  constructor(
    protected parameterService: ParameterService,
    protected parameterFormService: ParameterFormService,
    protected businessServiceService: BusinessServiceService,
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBusinessService = (o1: IBusinessService | null, o2: IBusinessService | null): boolean =>
    this.businessServiceService.compareBusinessService(o1, o2);

  compareInternalService = (o1: IInternalService | null, o2: IInternalService | null): boolean =>
    this.internalServiceService.compareInternalService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parameter }) => {
      this.parameter = parameter;
      if (parameter) {
        this.updateForm(parameter);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parameter = this.parameterFormService.getParameter(this.editForm);
    if (parameter.id !== null) {
      this.subscribeToSaveResponse(this.parameterService.update(parameter));
    } else {
      this.subscribeToSaveResponse(this.parameterService.create(parameter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParameter>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(parameter: IParameter): void {
    this.parameter = parameter;
    this.parameterFormService.resetForm(this.editForm, parameter);

    this.businessServicesSharedCollection = this.businessServiceService.addBusinessServiceToCollectionIfMissing<IBusinessService>(
      this.businessServicesSharedCollection,
      parameter.businessService
    );
    this.internalServicesSharedCollection = this.internalServiceService.addInternalServiceToCollectionIfMissing<IInternalService>(
      this.internalServicesSharedCollection,
      parameter.internalService
    );
  }

  protected loadRelationshipsOptions(): void {
    this.businessServiceService
      .query()
      .pipe(map((res: HttpResponse<IBusinessService[]>) => res.body ?? []))
      .pipe(
        map((businessServices: IBusinessService[]) =>
          this.businessServiceService.addBusinessServiceToCollectionIfMissing<IBusinessService>(
            businessServices,
            this.parameter?.businessService
          )
        )
      )
      .subscribe((businessServices: IBusinessService[]) => (this.businessServicesSharedCollection = businessServices));

    this.internalServiceService
      .query()
      .pipe(map((res: HttpResponse<IInternalService[]>) => res.body ?? []))
      .pipe(
        map((internalServices: IInternalService[]) =>
          this.internalServiceService.addInternalServiceToCollectionIfMissing<IInternalService>(
            internalServices,
            this.parameter?.internalService
          )
        )
      )
      .subscribe((internalServices: IInternalService[]) => (this.internalServicesSharedCollection = internalServices));
  }
}
