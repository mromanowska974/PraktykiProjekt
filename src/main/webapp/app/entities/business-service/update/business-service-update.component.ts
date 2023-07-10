import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BusinessServiceFormService, BusinessServiceFormGroup } from './business-service-form.service';
import { IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';

@Component({
  standalone: true,
  selector: 'jhi-business-service-update',
  templateUrl: './business-service-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BusinessServiceUpdateComponent implements OnInit {
  isSaving = false;
  businessService: IBusinessService | null = null;

  internalServicesSharedCollection: IInternalService[] = [];
  clientsSharedCollection: IClient[] = [];
  employeesSharedCollection: IEmployee[] = [];
  departmentsSharedCollection: IDepartment[] = [];

  editForm: BusinessServiceFormGroup = this.businessServiceFormService.createBusinessServiceFormGroup();

  constructor(
    protected businessServiceService: BusinessServiceService,
    protected businessServiceFormService: BusinessServiceFormService,
    protected internalServiceService: InternalServiceService,
    protected clientService: ClientService,
    protected employeeService: EmployeeService,
    protected departmentService: DepartmentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareInternalService = (o1: IInternalService | null, o2: IInternalService | null): boolean =>
    this.internalServiceService.compareInternalService(o1, o2);

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  compareEmployee = (o1: IEmployee | null, o2: IEmployee | null): boolean => this.employeeService.compareEmployee(o1, o2);

  compareDepartment = (o1: IDepartment | null, o2: IDepartment | null): boolean => this.departmentService.compareDepartment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessService }) => {
      this.businessService = businessService;
      if (businessService) {
        this.updateForm(businessService);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const businessService = this.businessServiceFormService.getBusinessService(this.editForm);
    if (businessService.id !== null) {
      this.subscribeToSaveResponse(this.businessServiceService.update(businessService));
    } else {
      this.subscribeToSaveResponse(this.businessServiceService.create(businessService));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusinessService>>): void {
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

  protected updateForm(businessService: IBusinessService): void {
    this.businessService = businessService;
    this.businessServiceFormService.resetForm(this.editForm, businessService);

    this.internalServicesSharedCollection = this.internalServiceService.addInternalServiceToCollectionIfMissing<IInternalService>(
      this.internalServicesSharedCollection,
      ...(businessService.internalServices ?? [])
    );
    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(
      this.clientsSharedCollection,
      businessService.client
    );
    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(
      this.employeesSharedCollection,
      businessService.employee
    );
    this.departmentsSharedCollection = this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(
      this.departmentsSharedCollection,
      businessService.department
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
            ...(this.businessService?.internalServices ?? [])
          )
        )
      )
      .subscribe((internalServices: IInternalService[]) => (this.internalServicesSharedCollection = internalServices));

    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.businessService?.client)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing<IEmployee>(employees, this.businessService?.employee)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));

    this.departmentService
      .query()
      .pipe(map((res: HttpResponse<IDepartment[]>) => res.body ?? []))
      .pipe(
        map((departments: IDepartment[]) =>
          this.departmentService.addDepartmentToCollectionIfMissing<IDepartment>(departments, this.businessService?.department)
        )
      )
      .subscribe((departments: IDepartment[]) => (this.departmentsSharedCollection = departments));
  }
}
