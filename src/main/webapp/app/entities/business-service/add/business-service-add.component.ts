import { Component, ElementRef, OnInit, ViewChild, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BusinessServiceFormService, BusinessServiceFormGroup } from './business-service-form.service';
import { BusinessService, IBusinessService, NewBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
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

@Component({
  standalone: true,
  selector: 'jhi-business-service-add',
  templateUrl: './business-service-add.component.html',
  styleUrls: ['./business-service-add.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, MatDialogModule],
})
export class BusinessServiceAddComponent implements OnInit, DoCheck {
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

  department: IDepartment | null;
  client: IClient | null;

  businessService: BusinessService = new BusinessService();

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

    this.businessService.client = this.client;
    this.isClientLoaded = true;
    this.getClients();
    this.getDepartments();

    //new internal service is added
    // if (this.internalServiceService.isNewInternalServiceCreated) {
    //   this.internalServiceService.internalServiceCreated.subscribe(internalService => {
    //     this.addInternalService(internalService);
    //     console.log(this.internalServices);
    //   });
    // }

    //loading saved business service
    if (this.businessServiceService.isBusinessServiceSaved) {
      this.businessService = this.businessServiceService.businessService;
      this.businessServiceService.isBusinessServiceSaved = false;

      this.internalServices = this.businessService.internalServices!;
      this.department = this.businessService.department!;
      this.isDepartmentLoaded = true;
      this.ownerName = this.businessService.employee!.name + ' ' + this.businessService.employee!.surname;
      this.isOwnerLoaded = true;
    }
  }

  ngDoCheck(): void {
    //employee selected from the list
    if (this.employeeService.isEmployeeSelected) {
      this.employeeService.employeeSelected.subscribe(employee => {
        this.isOwnerLoaded = true;
        this.businessService.employee = employee;
        this.ownerName = employee.name + ' ' + employee.surname;
        this.employeeService.isEmployeeSelected = false;
      });
    }

    //internal service selected from the list
    if (this.internalServiceService.isInternalServiceSelected) {
      var internalServiceSelected: IInternalService;
      this.internalServiceService.internalServiceSelected.subscribe(internalService => {
        internalServiceSelected = internalService;

        const found = this.internalServices!.find(obj => {
          return obj.id === internalServiceSelected.id;
        });

        if (!found) {
          this.addInternalService(internalServiceSelected);
        }
      });
    }
  }

  addInternalService(internalService: IInternalService) {
    this.internalServices!.push(internalService);
    this.internalServiceService.isInternalServiceSelected = false;
    this.internalServiceService.isNewInternalServiceCreated = false;
  }

  openEmployeesList() {
    this.dialogRef.open(EmployeeComponent);
  }

  openInternalServicesList() {
    this.dialogRef.open(InternalServiceAddExistingComponent);
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
    this.businessService.client = obj;
    this.isClientLoaded = true;
    console.log(obj);
  }

  getDepartment(obj: IDepartment | null) {
    this.businessService.department = obj;
    this.isDepartmentLoaded = true;
    console.log(obj);
  }

  createBusinessService(status: StatusOfServiceElement) {
    if (this.businessService != undefined) {
      this.businessService.internalServices = this.internalServices;
      this.businessService.status = status;
    }
  }

  onCancel() {
    this.router.navigate(['/']);
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
    this.isSymbolEntered = this.businessService.symbol?.length !== 0 && this.businessService.symbol !== undefined ? true : false;
    this.isNameEntered = this.businessService.name?.length !== 0 && this.businessService.name !== undefined ? true : false;

    this.isDataValidated =
      this.isSymbolEntered && this.isNameEntered && this.isOwnerLoaded && this.isDepartmentLoaded && this.isClientLoaded;

    if (this.isDataValidated) {
      this.createBusinessService(StatusOfServiceElement.ACTIVE);
      console.log(this.businessService);

      // this.businessServiceService.create(this.businessService).subscribe(() => {
      //   this.router.navigate(['/']);
      // });
    } else {
      this.isSaveButtonClicked = true;
      console.log(this.isSymbolEntered);
      console.log(this.isNameEntered);
      console.log(this.isOwnerLoaded);
      console.log(this.isDepartmentLoaded);
      console.log(this.isClientLoaded);
      console.log(this.businessService.symbol?.length);
      console.log(this.businessService.name?.length);
    }
  }

  onLoadAddNewInternalService() {
    this.onSave();
    this.router.navigate(['/internal-service', 'add']);
  }
}
