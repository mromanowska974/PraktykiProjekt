import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InternalServiceFormService, InternalServiceFormGroup } from './internal-service-form.service';
import { IInternalService } from '../internal-service.model';
import { InternalServiceService } from '../service/internal-service.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { StatusOfServiceCard } from 'app/entities/enumerations/status-of-service-card.model';

@Component({
  standalone: true,
  selector: 'jhi-internal-service-update',
  templateUrl: './internal-service-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InternalServiceUpdateComponent implements OnInit {
  isSaving = false;
  internalService: IInternalService | null = null;
  statusOfServiceCardValues = Object.keys(StatusOfServiceCard);

  employeesSharedCollection: IEmployee[] = [];

  editForm: InternalServiceFormGroup = this.internalServiceFormService.createInternalServiceFormGroup();

  constructor(
    protected internalServiceService: InternalServiceService,
    protected internalServiceFormService: InternalServiceFormService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ internalService }) => {
      this.internalService = internalService;
      if (internalService) {
        this.updateForm(internalService);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const internalService = this.internalServiceFormService.getInternalService(this.editForm);
    if (internalService.id !== null) {
      this.subscribeToSaveResponse(this.internalServiceService.update(internalService));
    } else {
      this.subscribeToSaveResponse(this.internalServiceService.create(internalService));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInternalService>>): void {
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

  protected updateForm(internalService: IInternalService): void {
    this.internalService = internalService;
    this.internalServiceFormService.resetForm(this.editForm, internalService);

    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      internalService.employee
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.internalService?.employee)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));
  }
}
