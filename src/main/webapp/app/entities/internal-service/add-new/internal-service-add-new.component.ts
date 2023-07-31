import { Component, DoCheck, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InternalServiceService } from '../service/internal-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'app/entities/client/service/client.service';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { EmployeeComponent } from 'app/entities/employee/list/employee.component';
import { IInternalService, InternalService, NewInternalService } from '../internal-service.model';
import { CommonModule, Location } from '@angular/common';
import { BusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'jhi-internal-service-add-new',
  templateUrl: './internal-service-add-new.component.html',
  styleUrls: ['./internal-service-add-new.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class InternalServiceAddNewComponent implements OnInit, OnDestroy {
  ownerName: string;

  @ViewChild('symbol') symbol: ElementRef;
  @ViewChild('name') name: ElementRef;

  internalService: InternalService = new InternalService();

  isSymbolEntered: boolean = false;
  isNameEntered: boolean = false;
  isOwnerLoaded: boolean = false;
  isDataValidated: boolean = false;

  isSaveButtonClicked: boolean = false;

  businessService: BusinessService | null;
  businessServiceId: number;

  businessServiceSub: Subscription;
  employeeSub: Subscription;

  constructor(
    protected internalServiceService: InternalServiceService,
    protected clientService: ClientService,
    protected employeeService: EmployeeService,
    protected departmentService: DepartmentService,
    protected businessServiceService: BusinessServiceService,
    protected activatedRoute: ActivatedRoute,
    private dialogRef: MatDialog,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.businessServiceId = +this.activatedRoute.snapshot.params['id'];

    //if business service exists (In home page)
    if (this.businessServiceId !== -1) {
      this.businessServiceSub = this.businessServiceService.find(this.businessServiceId).subscribe(businessService => {
        this.businessService = businessService.body;
      });
    }

    //employee selected from the list
    this.employeeSub = this.employeeService.employeeSelected.subscribe(employee => {
      this.internalService!.employee = employee;
      this.ownerName = employee.name + ' ' + employee.surname;
      this.isOwnerLoaded = true;
      this.employeeService.isEmployeeSelected = false;
      this.dialogRef.closeAll();
    });
  }

  ngOnDestroy(): void {
    if (this.businessServiceSub) {
      this.businessServiceSub.unsubscribe();
    }

    if (this.employeeSub) {
      this.employeeSub.unsubscribe();
    }
  }

  openEmployeesList() {
    this.dialogRef.open(EmployeeComponent);
  }

  onCancel() {
    this.location.back();
  }

  onSave() {
    this.internalService.symbol = this.symbol.nativeElement.value;
    this.internalService.name = this.name.nativeElement.value;

    this.isSymbolEntered = this.internalService.symbol?.length !== 0 && this.internalService.symbol !== undefined ? true : false;
    this.isNameEntered = this.internalService.name?.length !== 0 && this.internalService.name !== undefined ? true : false;

    this.isDataValidated = this.isSymbolEntered && this.isNameEntered && this.isOwnerLoaded;

    if (this.isDataValidated) {
      //if business service exists (In home page)
      if (this.businessServiceId !== -1) {
        this.businessService?.internalServices?.push(this.internalService);
        this.businessServiceSub = this.businessServiceService.update(this.businessService!).subscribe(() => {
          this.location.back();
        });
      }
      //if business service doesn't exist (In Add new BS page)
      else {
        this.internalServiceService.sendCreatedInternalService(this.internalService);
        this.internalServiceService.isNewInternalServiceCreated = true;
        this.location.back();
      }
    } else {
      this.isSaveButtonClicked = true;
    }
  }
}
