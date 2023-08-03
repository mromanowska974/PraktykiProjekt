import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService, IBusinessService } from '../business-service.model';
import { BusinessServiceService } from '../service/business-service.service';
import { IServiceElement } from 'app/entities/service-element/service-element.model';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { ServiceElementService } from 'app/entities/service-element/service/service-element.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ParameterComponent } from 'app/entities/parameter/list/parameter.component';
import { ParameterUpdateComponent } from 'app/entities/parameter/update/parameter-update.component';
import { ParameterType } from 'app/entities/enumerations/parameter-type.model';
import { IParameter } from 'app/entities/parameter/parameter.model';
import { ParameterService } from 'app/entities/parameter/service/parameter.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-business-service-edit',
  templateUrl: './business-service-edit.component.html',
  styleUrls: ['./business-service-edit.component.scss'],
})
export class BusinessServiceEditComponent implements OnInit, OnDestroy {
  sectionSelected: string = 'C';

  businessServiceId: number;
  businessService: BusinessService | null = new BusinessService();
  isDataLoaded: boolean = false;

  functionalDescription: string;
  exclusions: string;
  dutiesAndResponsibilities: string;
  personResponsibleForService: string;
  hoursOfService: string;
  serviceActivatingCost: string;
  priceListOfService: string;
  notes: string;

  serviceElementsOfMonthlyPaymentType: IServiceElement[] | null = [];
  serviceElementsOfOneTimePaymentType: IServiceElement[] | null = [];

  parametersOfQualityType: IParameter[] | null = [];
  parametersOfQuantityType: IParameter[] | null = [];

  paymentType: typeof PaymentType = PaymentType;
  parameterType: typeof ParameterType = ParameterType;

  serviceElementSub: Subscription;
  parameterSub: Subscription;

  parametersToDelete: IParameter[] | null = [];

  formattedStartDatesMonthly: string[] = [];
  formattedEndDatesMonthly: string[] = [];
  formattedStartDatesOneTime: string[] = [];
  formattedEndDatesOneTime: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private businessServiceService: BusinessServiceService,
    private serviceElementService: ServiceElementService,
    private parameterService: ParameterService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.businessServiceId = +this.route.snapshot.params['id'];

    // setting business service
    //if business service was saved when clicked Add New Service Element
    if (this.businessServiceService.isBusinessServiceSaved) {
      this.businessService = this.businessServiceService.businessService;
      this.serviceElementsOfMonthlyPaymentType = this.businessServiceService.serviceElementsOfMonthlyPaymentType;
      this.serviceElementsOfOneTimePaymentType = this.businessServiceService.serviceElementsOfOneTimePaymentType;
      this.parametersOfQualityType = this.businessServiceService.parametersOfQualityType;
      this.parametersOfQuantityType = this.businessServiceService.parametersOfQuantityType;
      this.formattedStartDatesMonthly = this.businessServiceService.formattedStartDatesMonthly;
      this.formattedEndDatesMonthly = this.businessServiceService.formattedEndDatesMonthly;
      this.formattedStartDatesOneTime = this.businessServiceService.formattedStartDatesOneTime;
      this.formattedEndDatesOneTime = this.businessServiceService.formattedEndDatesOneTime;

      this.businessServiceService.isBusinessServiceSaved = false;
      this.isDataLoaded = true;
    }
    //if clicked Edit Business Service from Home page
    else {
      this.getBusinessService();
      this.serviceElementService.findByBusinessServiceAndPaymentType(this.businessServiceId, PaymentType.MONTHLY).subscribe(resp => {
        this.serviceElementsOfMonthlyPaymentType = resp.body;

        this.serviceElementsOfMonthlyPaymentType?.forEach(serviceElement => {
          this.formattedStartDatesMonthly.push(serviceElement.startDate!.format('DD.MM.YYYY').toString());
          this.formattedEndDatesMonthly.push(serviceElement.endDate!.format('DD.MM.YYYY').toString());
        });
      });

      this.serviceElementService.findByBusinessServiceAndPaymentType(this.businessServiceId, PaymentType.DISPOSABLE).subscribe(resp => {
        this.serviceElementsOfOneTimePaymentType = resp.body;

        this.serviceElementsOfOneTimePaymentType?.forEach(serviceElement => {
          this.formattedStartDatesOneTime.push(serviceElement.startDate!.format('DD.MM.YYYY').toString());
          this.formattedEndDatesOneTime.push(serviceElement.endDate!.format('DD.MM.YYYY').toString());
        });
      });

      this.parameterService.findByBusinessServiceIdAndParameterType(this.businessServiceId, ParameterType.QUALITY).subscribe(resp => {
        this.parametersOfQualityType = resp.body;
      });

      this.parameterService.findByBusinessServiceIdAndParameterType(this.businessServiceId, ParameterType.QUANTITY).subscribe(resp => {
        this.parametersOfQuantityType = resp.body;
      });
    }

    //receiving new service element
    this.serviceElementSub = this.serviceElementService.toReceive.subscribe(resp => {
      resp.businessService = this.businessService;

      if (resp.paymentType === PaymentType.MONTHLY) {
        this.serviceElementsOfMonthlyPaymentType!.push(resp);
        this.formattedStartDatesMonthly.push(dayjs(resp.startDate).format('DD.MM.YYYY'));
        this.formattedEndDatesMonthly.push(dayjs(resp.endDate).format('DD.MM.YYYY'));
      } else if (resp.paymentType === PaymentType.DISPOSABLE) {
        this.serviceElementsOfOneTimePaymentType!.push(resp);
        this.formattedStartDatesOneTime.push(dayjs(resp.startDate).format('DD.MM.YYYY'));
        this.formattedEndDatesOneTime.push(dayjs(resp.endDate).format('DD.MM.YYYY'));
      }
    });

    //receiving new parameter
    this.parameterSub = this.parameterService.toReceive.subscribe(resp => {
      resp.businessService = this.businessService;

      if (resp.type === ParameterType.QUALITY) {
        this.parametersOfQualityType?.push(resp);
      } else if (resp.type === ParameterType.QUANTITY) {
        this.parametersOfQuantityType?.push(resp);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.serviceElementSub) {
      this.serviceElementSub.unsubscribe();
    }

    if (this.parameterSub) {
      this.parameterSub.unsubscribe();
    }
  }

  getBusinessService() {
    this.businessServiceService.find(this.businessServiceId).subscribe(businessService => {
      this.businessService = businessService.body;
      this.isDataLoaded = true;
    });
  }

  onSelectSection(section: string) {
    this.sectionSelected = section;
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  onEditBusinessService() {
    //adding service elements to db
    this.serviceElementsOfMonthlyPaymentType!.forEach(serviceElement => {
      if (serviceElement.id === undefined) this.serviceElementService.create(serviceElement).subscribe();
    });

    this.serviceElementsOfOneTimePaymentType!.forEach(serviceElement => {
      if (serviceElement.id === undefined) this.serviceElementService.create(serviceElement).subscribe();
    });

    //adding parameters to db
    this.parametersOfQualityType!.forEach(parameter => {
      if (parameter.id === undefined) this.parameterService.create(parameter).subscribe();
    });

    this.parametersOfQuantityType!.forEach(parameter => {
      if (parameter.id === undefined) this.parameterService.create(parameter).subscribe();
    });

    //deleting parameters
    this.parametersToDelete!.forEach(parameter => {
      this.parameterService.delete(parameter.id).subscribe(() => console.log(parameter));
    });

    //updating business service
    this.businessServiceService.update(this.businessService!).subscribe();

    //go back to previous page
    this.router.navigate(['/']);
  }

  onAddServiceElement(paymentType: PaymentType) {
    this.businessServiceService.businessService = this.businessService;
    this.businessServiceService.serviceElementsOfMonthlyPaymentType = this.serviceElementsOfMonthlyPaymentType;
    this.businessServiceService.serviceElementsOfOneTimePaymentType = this.serviceElementsOfOneTimePaymentType;
    this.businessServiceService.parametersOfQualityType = this.parametersOfQualityType;
    this.businessServiceService.parametersOfQuantityType = this.parametersOfQuantityType;
    this.businessServiceService.formattedStartDatesMonthly = this.formattedStartDatesMonthly;
    this.businessServiceService.formattedEndDatesMonthly = this.formattedEndDatesMonthly;
    this.businessServiceService.formattedStartDatesOneTime = this.formattedStartDatesOneTime;
    this.businessServiceService.formattedEndDatesOneTime = this.formattedEndDatesOneTime;

    this.businessServiceService.isBusinessServiceSaved = true;
    this.router.navigate(['/service-element', 'new'], {
      queryParams: { paymentType: paymentType },
    });
  }

  onAddParameter(parameterType: ParameterType) {
    this.dialogRef.open(ParameterUpdateComponent, {
      data: parameterType,
    });
  }

  onDeleteParameter(parameter: IParameter, index: number) {
    if (parameter.id !== undefined) {
      this.parametersToDelete?.push(parameter);
    }

    if (parameter.type === ParameterType.QUALITY) {
      this.parametersOfQualityType?.splice(index, 1);
    } else if (parameter.type === ParameterType.QUANTITY) {
      this.parametersOfQuantityType?.splice(index, 1);
    }
  }
}
