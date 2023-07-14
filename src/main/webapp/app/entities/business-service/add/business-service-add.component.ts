import { Component, ElementRef, OnInit, ViewChild, DoCheck } from '@angular/core';
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
  @ViewChild('department') departmentName: ElementRef;
  clientName: string;
  internalServices: IInternalService[] | null = [];

  owner: IEmployee | null;
  department: IDepartment | null;
  client: IClient | null;

  businessService: NewBusinessService = {} as NewBusinessService;

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
    this.clientName = this.activatedRoute.snapshot.queryParams['client'];
    this.getClients();
    this.getDepartments();
  }

  ngDoCheck(): void {
    //getting selected owner's name and surname from EmployeeComponent
    if (this.employeeService.isEmployeeSelected) {
      this.employeeService.employeeSelected.subscribe(employee => {
        this.ownerName = employee.name + ' ' + employee.surname;
        this.employeeService.isEmployeeSelected = false;
      });
    }

    //saving new business service into db
    if (this.isOwnerLoaded && this.isDepartmentLoaded && this.isClientLoaded) {
      if (this.businessService != undefined) {
        this.businessService.symbol = this.symbol.nativeElement.value;
        this.businessService.name = this.name.nativeElement.value;
        this.businessService.employee = this.owner;
        this.businessService.department = this.department;
        this.businessService.client = this.client;
        this.businessService.internalServices = this.internalServices;
        this.businessService.status = StatusOfServiceElement.ACTIVE;
      }

      console.log(this.businessService);

      this.saveBusinessServiceToDb();
    }
  }

  openEmployeesList() {
    this.dialogRef.open(EmployeeComponent);
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
      this.isDepartmentListLoaded = true;
    });
  }

  saveBusinessServiceToDb() {
    //var NewBusinessService: NewBusinessService = this.businessService;
    this.businessServiceService.create(this.businessService).subscribe(() => {
      this.isOwnerLoaded = false;
      this.isDepartmentLoaded = false;
      this.isClientLoaded = false;
      this.router.navigate(['/']);
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onSave() {
    //not save to db
    this.router.navigate(['/']);
  }

  onSaveAndActivate() {
    //save to db
    var splittedOwnerName = this.ownerName.split(' ');

    this.employeeService.findByName(splittedOwnerName[0], splittedOwnerName[1]).subscribe(employee => {
      this.owner = employee.body;
      this.isOwnerLoaded = true;
    });

    this.departmentService.findByName(this.departmentName.nativeElement.value).subscribe(department => {
      this.department = department.body;
      this.isDepartmentLoaded = true;
    });

    this.clientService.findByName(this.clientName).subscribe(client => {
      this.client = client.body;
      this.isClientLoaded = true;
    });
  }
}
