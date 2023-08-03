import { Component, ElementRef, OnInit, ViewChild, DoCheck, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BusinessServiceFormService, BusinessServiceFormGroup } from './business-service-form.service';
import { BusinessService, IBusinessService, NewBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { IInternalService, InternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';
import { EmployeeComponent } from 'app/entities/employee/list/employee.component';
import { InternalServiceAddExistingComponent } from 'app/entities/internal-service/add-existing/internal-service-add-existing.component';
import { ClickedButtonFrom } from 'app/entities/enumerations/clicked-button-from.model';

@Component({
  standalone: true,
  selector: 'jhi-business-service-add',
  templateUrl: './business-service-add.component.html',
  styleUrls: ['./business-service-add.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, MatDialogModule],
})
export class BusinessServiceAddComponent implements OnInit, OnDestroy {
  clients: IClient[] | null;
  departments: IDepartment[] | null;

  isClientListLoaded = false;
  isDepartmentListLoaded = false;

  isSymbolEntered: boolean = false;
  isNameEntered: boolean = false;
  isOwnerLoaded: boolean = false;
  isDepartmentLoaded: boolean = false;
  isClientLoaded: boolean = false;
  isDataValidated: boolean = false;

  isSaveButtonClicked: boolean = false;

  ownerName: string;
  ownerId: number;
  clientQuery: string;
  internalServices: IInternalService[] | null = [];

  selectedDepartment: IDepartment | null = {} as IDepartment;
  client: IClient | null;

  businessService: BusinessService | null = new BusinessService();

  internalServiceSub: Subscription;
  employeeSub: Subscription;

  businessServiceRexegp: RegExp = /^UB-\d{2}-\d{2}$/;

  constructor(
    protected businessServiceService: BusinessServiceService,
    protected businessServiceFormService: BusinessServiceFormService,
    protected internalServiceService: InternalServiceService,
    protected clientService: ClientService,
    protected employeeService: EmployeeService,
    protected departmentService: DepartmentService,
    protected activatedRoute: ActivatedRoute,
    private dialogRef: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    //decoding clientQuery into Client
    this.clientQuery = this.activatedRoute.snapshot.queryParams['client'];
    var clientQuerySplit = this.clientQuery.split('&');
    var clientQueryValues: string[][] = [];

    for (let i = 0; i < clientQuerySplit.length; i++) {
      var value = clientQuerySplit[i].split('=');
      clientQueryValues.push(value);
    }

    this.client = {
      id: +clientQueryValues[0][1],
      name: clientQueryValues[1][1],
    };

    this.businessService!.client = this.client;
    this.isClientLoaded = true;
    this.getClients();
    this.getDepartments();

    //loading saved business service
    if (this.businessServiceService.isBusinessServiceSaved) {
      this.businessService = this.businessServiceService.businessService;
      this.businessServiceService.isBusinessServiceSaved = false;

      this.internalServices = this.businessService!.internalServices!;

      if (this.businessService!.department) {
        this.selectedDepartment = this.businessService!.department!;
        this.isDepartmentLoaded = this.selectedDepartment !== undefined ? true : false;
      } else {
        this.selectedDepartment = {} as IDepartment;
        this.selectedDepartment.name = '';
      }

      if (this.businessService!.employee) {
        this.ownerName = this.businessService!.employee!.name + ' ' + this.businessService!.employee!.surname;
        this.isOwnerLoaded = this.ownerName !== undefined ? true : false;
      }
    }

    //new internal service is added to new business service
    if (this.internalServiceService.isNewInternalServiceCreated) {
      this.internalServiceSub = this.internalServiceService.test.subscribe(resp => {
        this.internalServices?.push(resp);
      });
    }

    //employee selected from the list
    this.employeeSub = this.employeeService.employeeSelected.subscribe(employee => {
      this.isOwnerLoaded = true;
      this.businessService!.employee = employee;
      this.ownerName = employee.name + ' ' + employee.surname;
      this.employeeService.isEmployeeSelected = false;
      this.dialogRef.closeAll();
    });

    //internal service selected from the list
    var internalServiceSelected: IInternalService;
    this.internalServiceService.internalServiceSelected.subscribe(resp => {
      internalServiceSelected = resp;

      const found = this.internalServices!.find(obj => {
        return obj.id === internalServiceSelected.id;
      });

      if (!found) {
        this.addInternalServiceToList(internalServiceSelected);
      }

      this.dialogRef.closeAll();
    });
  }

  ngOnDestroy(): void {
    if (this.internalServiceSub) {
      this.internalServiceSub.unsubscribe();
    }

    if (this.employeeSub) {
      this.employeeSub.unsubscribe();
    }
  }

  addInternalServiceToList(internalService: IInternalService) {
    this.internalServices!.push(internalService);
    this.internalServiceService.isInternalServiceSelected = false;
    this.internalServiceService.isNewInternalServiceCreated = false;
  }

  openEmployeesList() {
    this.dialogRef.open(EmployeeComponent);
  }

  openInternalServicesList() {
    this.dialogRef.open(InternalServiceAddExistingComponent, {
      data: {
        clickedButtonFrom: ClickedButtonFrom.ADD_NEW_BS_PAGE,
      },
    });
  }

  getClients() {
    this.clientService.query().subscribe(clients => {
      this.clients = clients.body;
      this.isClientListLoaded = true;
    });
  }

  getDepartments() {
    this.departmentService.query().subscribe(departments => {
      this.departments = departments.body;
    });
  }

  getClient(obj: IClient | null) {
    this.businessService!.client = obj;
    this.isClientLoaded = true;
  }

  getDepartment(selDep: IDepartment) {
    this.businessService!.department = selDep;
    this.isDepartmentLoaded = true;
  }

  createBusinessService(status: StatusOfServiceElement) {
    if (this.businessService != undefined) {
      this.businessService.internalServices = this.internalServices;
      this.businessService.status = status;
    }
  }

  onCancel() {
    //this.router.navigate(['/']);
    console.log(this.businessServiceRexegp.test('UB-02-23'));
  }

  onSave() {
    //not save to db
    //this.router.navigate(['/']);
    this.createBusinessService(StatusOfServiceElement.NOT_ACTIVE);
    this.businessServiceService.businessService = this.businessService;
    this.businessServiceService.isBusinessServiceSaved = true;
  }

  onSaveAndActivate() {
    //save to db
    this.isSymbolEntered =
      this.businessService!.symbol?.length !== 0 &&
      this.businessService!.symbol !== undefined &&
      this.businessServiceRexegp.test(this.businessService!.symbol!)
        ? true
        : false;

    //console.log(this.businessServiceRexegp.test(this.businessService!.symbol!))
    this.isNameEntered = this.businessService!.name?.length !== 0 && this.businessService!.name !== undefined ? true : false;

    this.isDataValidated =
      this.isSymbolEntered && this.isNameEntered && this.isOwnerLoaded && this.isDepartmentLoaded && this.isClientLoaded;

    if (this.isDataValidated) {
      this.createBusinessService(StatusOfServiceElement.ACTIVE);
      console.log(this.businessService);

      this.businessServiceService.create(this.businessService!).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.isSaveButtonClicked = true;
    }
  }

  onDeleteListItem(index: number) {
    this.internalServices?.splice(index, 1);
  }

  onLoadAddNewInternalService() {
    this.onSave();
    this.router.navigate(['/internal-service', 'add', -1]);
  }
}
