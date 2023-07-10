import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceElementFormService, ServiceElementFormGroup } from './service-element-form.service';
import { IServiceElement } from '../service-element.model';
import { ServiceElementService } from '../service/service-element.service';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';

@Component({
  standalone: true,
  selector: 'jhi-service-element-update',
  templateUrl: './service-element-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ServiceElementUpdateComponent implements OnInit {
  isSaving = false;
  serviceElement: IServiceElement | null = null;
  paymentTypeValues = Object.keys(PaymentType);
  statusOfServiceElementValues = Object.keys(StatusOfServiceElement);

  businessServicesSharedCollection: IBusinessService[] = [];
  internalServicesSharedCollection: IInternalService[] = [];

  editForm: ServiceElementFormGroup = this.serviceElementFormService.createServiceElementFormGroup();

  constructor(
    protected serviceElementService: ServiceElementService,
    protected serviceElementFormService: ServiceElementFormService,
    protected businessServiceService: BusinessServiceService,
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBusinessService = (o1: IBusinessService | null, o2: IBusinessService | null): boolean =>
    this.businessServiceService.compareBusinessService(o1, o2);

  compareInternalService = (o1: IInternalService | null, o2: IInternalService | null): boolean =>
    this.internalServiceService.compareInternalService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceElement }) => {
      this.serviceElement = serviceElement;
      if (serviceElement) {
        this.updateForm(serviceElement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceElement = this.serviceElementFormService.getServiceElement(this.editForm);
    if (serviceElement.id !== null) {
      this.subscribeToSaveResponse(this.serviceElementService.update(serviceElement));
    } else {
      this.subscribeToSaveResponse(this.serviceElementService.create(serviceElement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceElement>>): void {
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

  protected updateForm(serviceElement: IServiceElement): void {
    this.serviceElement = serviceElement;
    this.serviceElementFormService.resetForm(this.editForm, serviceElement);

    this.businessServicesSharedCollection = this.businessServiceService.addBusinessServiceToCollectionIfMissing<IBusinessService>(
      this.businessServicesSharedCollection,
      serviceElement.businessService
    );
    this.internalServicesSharedCollection = this.internalServiceService.addInternalServiceToCollectionIfMissing<IInternalService>(
      this.internalServicesSharedCollection,
      serviceElement.internalService
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
            this.serviceElement?.businessService
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
            this.serviceElement?.internalService
          )
        )
      )
      .subscribe((internalServices: IInternalService[]) => (this.internalServicesSharedCollection = internalServices));
  }
}
