import { Component, OnInit } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'jhi-external-company-update',
  templateUrl: './external-company-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ExternalCompanyUpdateComponent implements OnInit {
  isSaving = false;
  externalCompany: IExternalCompany | null = null;

  internalServicesSharedCollection: IInternalService[] = [];

  editForm: ExternalCompanyFormGroup = this.externalCompanyFormService.createExternalCompanyFormGroup();

  constructor(
    protected externalCompanyService: ExternalCompanyService,
    protected externalCompanyFormService: ExternalCompanyFormService,
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareInternalService = (o1: IInternalService | null, o2: IInternalService | null): boolean =>
    this.internalServiceService.compareInternalService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ externalCompany }) => {
      this.externalCompany = externalCompany;
      if (externalCompany) {
        this.updateForm(externalCompany);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const externalCompany = this.externalCompanyFormService.getExternalCompany(this.editForm);
    if (externalCompany.id !== null) {
      this.subscribeToSaveResponse(this.externalCompanyService.update(externalCompany));
    } else {
      this.subscribeToSaveResponse(this.externalCompanyService.create(externalCompany));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExternalCompany>>): void {
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

  protected updateForm(externalCompany: IExternalCompany): void {
    this.externalCompany = externalCompany;
    this.externalCompanyFormService.resetForm(this.editForm, externalCompany);

    this.internalServicesSharedCollection = this.internalServiceService.addInternalServiceToCollectionIfMissing<IInternalService>(
      this.internalServicesSharedCollection,
      externalCompany.internalService
    );
  }

  protected loadRelationshipsOptions(): void {
    this.internalServiceService
      .query()
      .pipe(map((res: HttpResponse<IInternalService[]>) => res.body ?? []))
      .pipe(
        map((internalServices: IInternalService[]) =>
          this.internalServiceService.addInternalServiceToCollectionIfMissing<IInternalService>(
            internalServices,
            this.externalCompany?.internalService
          )
        )
      )
      .subscribe((internalServices: IInternalService[]) => (this.internalServicesSharedCollection = internalServices));
  }
}
