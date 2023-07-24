import { Component, ElementRef, OnInit, ViewChild, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BusinessServiceFormService, BusinessServiceFormGroup } from './business-service-form.service';
import { IBusinessService, NewBusinessService } from '../business-service.model';
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

  isOwnerLoaded: boolean = false;
  isDepartmentLoaded: boolean = false;
  isClientLoaded: boolean = false;

  @ViewChild('symbol') symbol: ElementRef;
  @ViewChild('name') name: ElementRef;
  ownerName: string;
  ownerId: number;
  clientQuery: string;
  internalServices: IInternalService[] | null = [];

  department: IDepartment | null;
  client: IClient | null;

  businessService: NewBusinessService = {} as NewBusinessService;

  //@Input() isInternalServiceSelected: boolean = this.internalServiceService.isInternalServiceSelected;

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
    console.log(this.client);
    this.getClients();
    this.getDepartments();
  }

  ngDoCheck(): void {
    if (this.employeeService.isEmployeeSelected) {
      this.employeeService.employeeSelected.subscribe(employee => {
        this.businessService.employee = employee;
        this.ownerName = employee.name + ' ' + employee.surname;
        this.employeeService.isEmployeeSelected = false;
      });
    }

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

  // ngOnChanges(changes: SimpleChanges): void {
  //     console.log(changes['isInternalServiceSelected'])
  // }

  addInternalService(internalService: IInternalService) {
    this.internalServices?.push(internalService);
    this.internalServiceService.isInternalServiceSelected = false;
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
    console.log(obj);
  }

  getDepartment(obj: IDepartment | null) {
    this.businessService.department = obj;
    console.log(obj);
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onSave() {
    //not save to db
    //this.router.navigate(['/']);
  }

  onSaveAndActivate() {
    //save to db
    if (this.businessService != undefined) {
      this.businessService.symbol = this.symbol.nativeElement.value;
      this.businessService.name = this.name.nativeElement.value;
      this.businessService.internalServices = this.internalServices;
      this.businessService.status = StatusOfServiceElement.ACTIVE;
    }
    console.log(this.businessService);

    // this.businessServiceService.create(this.businessService).subscribe(() => {
    //   this.router.navigate(['/']);
    // });
  }
}
