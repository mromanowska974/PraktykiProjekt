import { Component, DoCheck, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'jhi-internal-service-add-new',
  templateUrl: './internal-service-add-new.component.html',
  styleUrls: ['./internal-service-add-new.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class InternalServiceAddNewComponent implements DoCheck {
  ownerName: string;

  @ViewChild('symbol') symbol: ElementRef;
  @ViewChild('name') name: ElementRef;

  internalService: InternalService = new InternalService();

  isSymbolEntered: boolean = false;
  isNameEntered: boolean = false;
  isOwnerLoaded: boolean = false;
  isDataValidated: boolean = false;

  isSaveButtonClicked: boolean = false;

  constructor(
    protected internalServiceService: InternalServiceService,
    protected clientService: ClientService,
    protected employeeService: EmployeeService,
    protected departmentService: DepartmentService,
    protected activatedRoute: ActivatedRoute,
    private dialogRef: MatDialog,
    private router: Router,
    private location: Location
  ) {}

  ngDoCheck(): void {
    if (this.employeeService.isEmployeeSelected) {
      this.employeeService.employeeSelected.subscribe(employee => {
        this.internalService!.employee = employee;
        this.ownerName = employee.name + ' ' + employee.surname;
        this.isOwnerLoaded = true;
        this.employeeService.isEmployeeSelected = false;
      });
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

    // this.internalServiceService.isNewInternalServiceCreated = true;
    // this.internalServiceService.internalServiceCreated.emit(this.internalService);

    if (this.isDataValidated) {
      console.log(this.internalService);

      // this.internalServiceService.create(this.internalService).subscribe(() => {
      //   this.location.back();
      // });
    } else {
      this.isSaveButtonClicked = true;
      console.log(this.isSymbolEntered);
      console.log(this.isNameEntered);
      console.log(this.isOwnerLoaded);
      console.log(this.internalService.symbol?.length);
      console.log(this.internalService.name?.length);
    }
  }
}
