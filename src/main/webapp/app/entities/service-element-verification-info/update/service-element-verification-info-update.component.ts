import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ServiceElementVerificationInfoFormService,
  ServiceElementVerificationInfoFormGroup,
} from './service-element-verification-info-form.service';
import { IServiceElementVerificationInfo } from '../service-element-verification-info.model';
import { ServiceElementVerificationInfoService } from '../service/service-element-verification-info.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IServiceElement } from 'app/entities/service-element/service-element.model';
import { ServiceElementService } from 'app/entities/service-element/service/service-element.service';

@Component({
  standalone: true,
  selector: 'jhi-service-element-verification-info-update',
  templateUrl: './service-element-verification-info-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ServiceElementVerificationInfoUpdateComponent implements OnInit {
  isSaving = false;
  serviceElementVerificationInfo: IServiceElementVerificationInfo | null = null;

  departmentsCollection: IDepartment[] = [];
  serviceElementsSharedCollection: IServiceElement[] = [];

  editForm: ServiceElementVerificationInfoFormGroup =
    this.serviceElementVerificationInfoFormService.createServiceElementVerificationInfoFormGroup();

  constructor(
    protected serviceElementVerificationInfoService: ServiceElementVerificationInfoService,
    protected serviceElementVerificationInfoFormService: ServiceElementVerificationInfoFormService,
    protected departmentService: DepartmentService,
    protected serviceElementService: ServiceElementService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDepartment = (o1: IDepartment | null, o2: IDepartment | null): boolean => this.departmentService.compareDepartment(o1, o2);

  compareServiceElement = (o1: IServiceElement | null, o2: IServiceElement | null): boolean =>
    this.serviceElementService.compareServiceElement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceElementVerificationInfo }) => {
      this.serviceElementVerificationInfo = serviceElementVerificationInfo;
      if (serviceElementVerificationInfo) {
        this.updateForm(serviceElementVerificationInfo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const serviceElementVerificationInfo = this.serviceElementVerificationInfoFormService.getServiceElementVerificationInfo(this.editForm);
    if (serviceElementVerificationInfo.id !== null) {
      this.subscribeToSaveResponse(this.serviceElementVerificationInfoService.update(serviceElementVerificationInfo));
    } else {
      this.subscribeToSaveResponse(this.serviceElementVerificationInfoService.create(serviceElementVerificationInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServiceElementVerificationInfo>>): void {
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

  protected updateForm(serviceElementVerificationInfo: IServiceElementVerificationInfo): void {
    this.serviceElementVerificationInfo = serviceElementVerificationInfo;
    this.serviceElementVerificationInfoFormService.resetForm(this.editForm, serviceElementVerificationInfo);

    this.departmentsCollection = this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(
      this.departmentsCollection,
      serviceElementVerificationInfo.department
    );
    this.serviceElementsSharedCollection = this.serviceElementService.addServiceElementToCollectionIfMissing<IServiceElement>(
      this.serviceElementsSharedCollection,
      serviceElementVerificationInfo.serviceElement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.departmentService
      .query({ filter: 'serviceelementverificationinfo-is-null' })
      .pipe(map((res: HttpResponse<IDepartment[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartment[]) =>
          this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(
            departments,
            this.serviceElementVerificationInfo?.department
          )
        )
      )
      .subscribe((departments: IDepartment[]) => (this.departmentsCollection = departments));

    this.serviceElementService
      .query()
      .pipe(map((res: HttpResponse<IServiceElement[]>) => res.body ?? []))
      .pipe(
        map((serviceElements: IServiceElement[]) =>
          this.serviceElementService.addServiceElementToCollectionIfMissing<IServiceElement>(
            serviceElements,
            this.serviceElementVerificationInfo?.serviceElement
          )
        )
      )
      .subscribe((serviceElements: IServiceElement[]) => (this.serviceElementsSharedCollection = serviceElements));
  }
}
