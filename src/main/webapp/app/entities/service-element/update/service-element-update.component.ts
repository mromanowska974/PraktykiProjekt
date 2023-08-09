import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Location } from '@angular/common';

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

  serviceElementSub: Subscription;

  startDate: string;
  endDate: string;
  expirationDate: string;

  public TypeOfPeriodMapping: typeof TypeOfPeriodMapping = TypeOfPeriodMapping;
  public typeOfPeriodEnumValues: any = [];

  typeOfPeriodOfProvisionOfService: typeof TypeOfPeriodOfProvisionOfService = TypeOfPeriodOfProvisionOfService;

  constructor(
    protected serviceElementService: ServiceElementService,
    protected serviceElementFormService: ServiceElementFormService,
    protected businessServiceService: BusinessServiceService,
    protected internalServiceService: InternalServiceService,
    protected activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.typeOfPeriodEnumValues = Object.values(TypeOfPeriodOfProvisionOfService);
  }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.queryParams['action'];
    if (this.serviceElement) {
      this.serviceElement.paymentType = this.activatedRoute.snapshot.queryParams['paymentType'];
      console.log(this.serviceElement.paymentType);
      this.serviceElement.status = StatusOfServiceElement.NOT_ACTIVE;

      if (this.action === 'EDIT') {
        this.serviceElementSub = this.businessServiceService.toReceive.subscribe(serviceElement => {
          this.serviceElement!.bmcRegistration = serviceElement.bmcRegistration;
          this.serviceElement!.description = serviceElement.description;
          this.serviceElement!.price = serviceElement.price;
          this.serviceElement!.priceFromCalculation = serviceElement.priceFromCalculation;
          this.serviceElement!.periodOfProvisionOfServiceInMonths = serviceElement.periodOfProvisionOfServiceInMonths;
          this.serviceElement!.typeOfPeriodOfProvisionOfService = serviceElement.typeOfPeriodOfProvisionOfService;
          this.serviceElement!.valuationNumber = serviceElement.valuationNumber;
          this.serviceElement!.startDate = serviceElement.startDate;
          this.startDate! = dayjs(this.serviceElement!.startDate).format('YYYY-MM-DDTHH:mm');
          this.serviceElement!.endDate = serviceElement.endDate;
          this.endDate! = dayjs(this.serviceElement!.endDate).format('YYYY-MM-DDTHH:mm');
          this.serviceElement!.expirationDate = serviceElement.expirationDate;
          this.expirationDate! = dayjs(this.serviceElement!.expirationDate).format('YYYY-MM-DDTHH:mm');
          this.serviceElement!.status = serviceElement.status;
        });

        this.serviceElementSub = this.internalServiceService.toReceive.subscribe(serviceElement => {
          this.serviceElement!.bmcRegistration = serviceElement.bmcRegistration;
          this.serviceElement!.description = serviceElement.description;
          this.serviceElement!.price = serviceElement.price;
          this.serviceElement!.priceFromCalculation = serviceElement.priceFromCalculation;
          this.serviceElement!.periodOfProvisionOfServiceInMonths = serviceElement.periodOfProvisionOfServiceInMonths;
          this.serviceElement!.typeOfPeriodOfProvisionOfService = serviceElement.typeOfPeriodOfProvisionOfService;
          this.serviceElement!.valuationNumber = serviceElement.valuationNumber;
          this.serviceElement!.startDate = serviceElement.startDate;
          this.startDate! = dayjs(this.serviceElement!.startDate).format('YYYY-MM-DDTHH:mm');
          this.serviceElement!.endDate = serviceElement.endDate;
          this.endDate! = dayjs(this.serviceElement!.endDate).format('YYYY-MM-DDTHH:mm');
          this.serviceElement!.expirationDate = serviceElement.expirationDate;
          this.expirationDate! = dayjs(this.serviceElement!.expirationDate).format('YYYY-MM-DDTHH:mm');
          this.serviceElement!.status = serviceElement.status;
        });
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
  }

  setEndDate() {
    this.endDate = dayjs(this.serviceElement?.startDate)
      .add(this.serviceElement!.periodOfProvisionOfServiceInMonths!, 'month')
      .format('YYYY-MM-DDTHH:mm');
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
    this.serviceElement!.expirationDate = dayjs(this.expirationDate);
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

    console.log(this.expirationDate);
    if (this.isDataValidated) {
      this.serviceElementService.sendCreatedServiceElement(this.serviceElement!);
      this.location.back();
    } else {
      this.isSaveBtnClicked = true;
    }
  }

  onToggleStatus() {
    if (this.serviceElement?.status === StatusOfServiceElement.NOT_ACTIVE) this.serviceElement.status = StatusOfServiceElement.ACTIVE;
    else this.serviceElement!.status = StatusOfServiceElement.NOT_ACTIVE;
  }
}
