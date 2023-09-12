import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import utc from 'dayjs/esm/plugin/utc';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceElementFormService, ServiceElementFormGroup } from './service-element-form.service';
import { IServiceElement, NewServiceElement } from '../service-element.model';
import { ServiceElementService } from '../service/service-element.service';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import { IInternalService } from 'app/entities/internal-service/internal-service.model';
import { InternalServiceService } from 'app/entities/internal-service/service/internal-service.service';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { StatusOfServiceElement } from 'app/entities/enumerations/status-of-service-element.model';
import { prototype } from 'events';
import dayjs from 'dayjs/esm';
import { TypeOfPeriodOfProvisionOfService } from 'app/entities/enumerations/type-of-period-of-provision-of-service.model';
import { TypeOfPeriodMapping } from 'app/entities/enumerations/type-of-period-of-provision-of-service.model';
import exp from 'constants';
import { Orange3dButtonDirective } from 'app/directives/orange3d-button/orange3d-button.directive';
import { PluginFunc } from 'dayjs';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentAddComponent } from 'app/entities/department/add/department-add.component';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IDepartment } from 'app/entities/department/department.model';
import { IServiceElementVerificationInfo } from 'app/entities/service-element-verification-info/service-element-verification-info.model';

@Component({
  standalone: true,
  selector: 'jhi-service-element-update',
  templateUrl: './service-element-update.component.html',
  styleUrls: ['./service-element-update.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, Orange3dButtonDirective],
})
export class ServiceElementUpdateComponent implements OnInit, OnDestroy {
  serviceElement: IServiceElement | null = {} as IServiceElement;

  isDescriptionEntered: boolean = false;
  isBMCRegistrationEntered: boolean = false;
  isValuationNumberEntered: boolean = false;
  isPriceFromCalculationEntered: boolean = false;
  isPriceAfterNegotiationEntered: boolean = false;
  isStartDateEntered: boolean = false;
  isEndDateEntered: boolean = false;
  isExpirationDateEntered: boolean = false;
  isPeriodOfProvisionOfServiceInMonthsEntered: boolean = false;
  isTypeOfPeriodOfProvisionOfServiceEntered: boolean = false;
  isDataValidated: boolean = false;
  isSaveBtnClicked: boolean = false;

  action: string;
  serviceType: string;

  serviceElementSub: Subscription;
  departmentSub: Subscription;

  startDate: string;
  endDate: string;
  expirationDate: string;

  public TypeOfPeriodMapping: typeof TypeOfPeriodMapping = TypeOfPeriodMapping;
  public typeOfPeriodEnumValues: any = [];

  typeOfPeriodOfProvisionOfService: typeof TypeOfPeriodOfProvisionOfService = TypeOfPeriodOfProvisionOfService;

  o1: Observable<IDepartment>;
  o2: Observable<IDepartment[]>;

  verificationInfo: IServiceElementVerificationInfo[] = [];

  constructor(
    protected serviceElementService: ServiceElementService,
    protected serviceElementFormService: ServiceElementFormService,
    protected businessServiceService: BusinessServiceService,
    protected internalServiceService: InternalServiceService,
    protected departmentService: DepartmentService,
    protected activatedRoute: ActivatedRoute,
    protected dialog: MatDialog,
    private location: Location
  ) {
    this.typeOfPeriodEnumValues = Object.values(TypeOfPeriodOfProvisionOfService);
    dayjs.extend(utc);
  }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.queryParams['action'];
    this.serviceType = this.activatedRoute.snapshot.queryParams['serviceType'];
    if (this.serviceElement) {
      this.serviceElement.paymentType = this.activatedRoute.snapshot.queryParams['paymentType'];
      this.serviceElement.status = StatusOfServiceElement.NOT_ACTIVE;

      if (this.action === 'EDIT') {
        if (this.serviceType === 'business') {
          this.serviceElementSub = this.businessServiceService.toReceive.subscribe(resp => {
            let serviceElement = resp.serviceElement;
            this.serviceElement!.bmcRegistration = serviceElement.bmcRegistration;
            this.serviceElement!.description = serviceElement.description;
            this.serviceElement!.price = serviceElement.price;
            this.serviceElement!.priceFromCalculation = serviceElement.priceFromCalculation;
            this.serviceElement!.periodOfProvisionOfServiceInMonths = serviceElement.periodOfProvisionOfServiceInMonths;
            this.serviceElement!.typeOfPeriodOfProvisionOfService = serviceElement.typeOfPeriodOfProvisionOfService;
            this.serviceElement!.valuationNumber = serviceElement.valuationNumber;
            this.serviceElement!.startDate = serviceElement.startDate;
            this.startDate! = dayjs(this.serviceElement!.startDate).utc().add(1, 'd').format('YYYY-MM-DDTHH:mm');
            this.serviceElement!.endDate = serviceElement.endDate;
            this.endDate! = dayjs(this.serviceElement!.endDate).utc().format('YYYY-MM-DDTHH:mm');
            this.serviceElement!.expirationDate = serviceElement.expirationDate;
            this.expirationDate! = dayjs(this.serviceElement!.expirationDate).utc().format('YYYY-MM-DDTHH:mm');
            this.serviceElement!.status = serviceElement.status;
            this.verificationInfo = resp.verificationInfo;

            let departments: IDepartment[] = [];
            let leadingDepartment: IDepartment = {} as IDepartment;
            this.verificationInfo.forEach(element => {
              departments.push(element.department!);

              if (element.isDepartmentLeading) leadingDepartment = element.department!;
            });
          });
        } else if (this.serviceType === 'internal') {
          this.serviceElementSub = this.internalServiceService.toReceive.subscribe(serviceElement => {
            this.serviceElement!.bmcRegistration = serviceElement.bmcRegistration;
            this.serviceElement!.description = serviceElement.description;
            this.serviceElement!.price = serviceElement.price;
            this.serviceElement!.priceFromCalculation = serviceElement.priceFromCalculation;
            this.serviceElement!.periodOfProvisionOfServiceInMonths = serviceElement.periodOfProvisionOfServiceInMonths;
            this.serviceElement!.typeOfPeriodOfProvisionOfService = serviceElement.typeOfPeriodOfProvisionOfService;
            this.serviceElement!.valuationNumber = serviceElement.valuationNumber;
            this.serviceElement!.startDate = serviceElement.startDate;
            this.startDate! = dayjs(this.serviceElement!.startDate).utc().add(1, 'd').format('YYYY-MM-DDTHH:mm');
            this.serviceElement!.endDate = serviceElement.endDate;
            this.endDate! = dayjs(this.serviceElement!.endDate).utc().format('YYYY-MM-DDTHH:mm');
            this.serviceElement!.expirationDate = serviceElement.expirationDate;
            this.expirationDate! = dayjs(this.serviceElement!.expirationDate).utc().format('YYYY-MM-DDTHH:mm');
            this.serviceElement!.status = serviceElement.status;
          });
        }
      }
      //for testing only
      else {
        this.serviceElement.bmcRegistration = 'test';
        this.serviceElement.description = 'test';
        this.serviceElement.price = 567;
        this.serviceElement.priceFromCalculation = 678;
        this.serviceElement.periodOfProvisionOfServiceInMonths = 4;
        this.serviceElement.typeOfPeriodOfProvisionOfService = TypeOfPeriodOfProvisionOfService.MINIMAL;
        this.serviceElement.valuationNumber = 'test';
      }
    }
  }

  ngOnDestroy(): void {
    if (this.serviceElementSub) this.serviceElementSub.unsubscribe();
    if (this.departmentSub) this.departmentSub.unsubscribe();
  }

  setEndDate() {
    this.endDate = dayjs(this.startDate).add(this.serviceElement!.periodOfProvisionOfServiceInMonths!, 'month').format('YYYY-MM-DDTHH:mm');
    this.serviceElement!.endDate = dayjs(this.endDate);

    if (this.serviceElement?.typeOfPeriodOfProvisionOfService === TypeOfPeriodOfProvisionOfService.FIXED) {
      this.expirationDate = this.endDate;
    }
  }

  onCancel() {
    this.location.back();
  }

  onSaveServiceElement() {
    //validation
    this.serviceElement!.expirationDate = dayjs(this.expirationDate).utc();
    this.serviceElement!.startDate = dayjs(this.startDate);

    this.isBMCRegistrationEntered =
      this.serviceElement?.bmcRegistration !== undefined && this.serviceElement.bmcRegistration!.length > 0 ? true : false;
    this.isDescriptionEntered =
      this.serviceElement?.description !== undefined && this.serviceElement.description!.length > 0 ? true : false;
    this.isEndDateEntered = this.serviceElement?.endDate ? true : false;
    this.isExpirationDateEntered = this.expirationDate ? true : false;
    this.isPeriodOfProvisionOfServiceInMonthsEntered =
      this.serviceElement?.periodOfProvisionOfServiceInMonths !== undefined && this.serviceElement.periodOfProvisionOfServiceInMonths! > 0
        ? true
        : false;
    this.isPriceAfterNegotiationEntered = this.serviceElement?.price !== undefined && this.serviceElement.price! > 0 ? true : false;
    this.isPriceFromCalculationEntered =
      this.serviceElement?.priceFromCalculation !== undefined && this.serviceElement.priceFromCalculation! > 0 ? true : false;
    this.isStartDateEntered = this.serviceElement?.startDate ? true : false;
    this.isTypeOfPeriodOfProvisionOfServiceEntered =
      this.serviceElement?.typeOfPeriodOfProvisionOfService !== undefined &&
      this.serviceElement.typeOfPeriodOfProvisionOfService!.length > 0
        ? true
        : false;
    this.isValuationNumberEntered =
      this.serviceElement?.valuationNumber !== undefined && this.serviceElement.valuationNumber!.length > 0 ? true : false;

    this.isDataValidated =
      this.isBMCRegistrationEntered &&
      this.isDescriptionEntered &&
      this.isEndDateEntered &&
      this.isExpirationDateEntered &&
      this.isPeriodOfProvisionOfServiceInMonthsEntered &&
      this.isPriceAfterNegotiationEntered &&
      this.isPriceFromCalculationEntered &&
      this.isStartDateEntered &&
      this.isTypeOfPeriodOfProvisionOfServiceEntered &&
      this.isValuationNumberEntered;

    if (this.isDataValidated) {
      let elementsWithID: IServiceElementVerificationInfo[] = [];
      this.verificationInfo.forEach(element => {
        console.log(this.verificationInfo);
        if (element.id === undefined) {
          element.serviceElement = this.serviceElement;
          console.log(element);
        } else {
          console.log(this.verificationInfo.indexOf(element));
          elementsWithID.push(element);
        }
      });
      elementsWithID.forEach(element => {
        if (this.verificationInfo.find(el => el === element)) {
          this.verificationInfo.splice(this.verificationInfo.indexOf(element), 1);
        }
      });
      console.log(this.verificationInfo);
      this.serviceElementService.sendCreatedServiceElement(this.serviceElement!, this.verificationInfo!);
      this.location.back();
    } else {
      this.isSaveBtnClicked = true;
    }
  }

  onAddDepartments() {
    this.verificationInfo.forEach(el => {
      if (el.isDepartmentLeading) {
        this.serviceElementService.sendData(this.verificationInfo, el.department!);
      }
    });

    const dialogRef = this.dialog.open(DepartmentAddComponent, {
      data: {
        verificationInfo: this.verificationInfo,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      let departments = result.selectedDepartments;
      let leadingDepartment = result.leadingDepartment;
      let verificationInfoElementsToEdit = result.verificationInfoElementsToEdit;
      //this.verificationInfo = []; //-> zamiast tego zrobic zeby wyjebalo wszystko bez id lub elementy z id z listy do usuniecia

      this.verificationInfo.forEach(element => {
        if (element.id === undefined) {
          this.verificationInfo.splice(this.verificationInfo.indexOf(element), 1);
        }
      });

      departments.forEach(element => {
        let infoElement: IServiceElementVerificationInfo = {} as IServiceElementVerificationInfo;

        const foundEl = verificationInfoElementsToEdit.find(el => el.department.id === element.id);
        if (foundEl) {
          this.verificationInfo.push(foundEl);
        } else {
          infoElement.department = element;
          if (leadingDepartment.id === element.id) infoElement.isDepartmentLeading = true;
          else infoElement.isDepartmentLeading = false;
          infoElement.verifiedBy = '';
          infoElement.verifyDate = null;

          if (!this.verificationInfo.find(el => el.department!.id === infoElement.department!.id)) {
            console.log('xd');
            this.verificationInfo.push(infoElement);
          }
        }
      });
      console.log(this.verificationInfo);
    });
  }

  onToggleStatus() {
    if (this.serviceElement?.status === StatusOfServiceElement.NOT_ACTIVE) this.serviceElement.status = StatusOfServiceElement.ACTIVE;
    else this.serviceElement!.status = StatusOfServiceElement.NOT_ACTIVE;
  }
}
