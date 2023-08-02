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

@Component({
  selector: 'jhi-business-service-edit',
  templateUrl: './business-service-edit.component.html',
  styleUrls: ['./business-service-edit.component.scss'],
})
export class BusinessServiceEditComponent implements OnInit, OnDestroy {
  sectionSelected: string = 'B';

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
      console.log(this.businessServiceService.businessService);
      this.businessService = this.businessServiceService.businessService;
      this.serviceElementsOfMonthlyPaymentType = this.businessServiceService.serviceElementsOfMonthlyPaymentType;
      this.serviceElementsOfOneTimePaymentType = this.businessServiceService.serviceElementsOfOneTimePaymentType;
      this.parametersOfQualityType = this.businessServiceService.parametersOfQualityType;
      this.parametersOfQuantityType = this.businessServiceService.parametersOfQuantityType;
      console.log(this.businessService);

      this.businessServiceService.isBusinessServiceSaved = false;
      this.isDataLoaded = true;
    }
    //if clicked Edit Business Service from Home page
    else {
      this.getBusinessService();
      this.serviceElementService.findByBusinessServiceAndPaymentType(this.businessServiceId, PaymentType.MONTHLY).subscribe(resp => {
        this.serviceElementsOfMonthlyPaymentType = resp.body;
        console.log(this.serviceElementsOfMonthlyPaymentType);
      });

      this.serviceElementService.findByBusinessServiceAndPaymentType(this.businessServiceId, PaymentType.DISPOSABLE).subscribe(resp => {
        this.serviceElementsOfOneTimePaymentType = resp.body;
        console.log(this.serviceElementsOfOneTimePaymentType);
      });

      this.parameterService.findByBusinessServiceIdAndParameterType(this.businessServiceId, ParameterType.QUALITY).subscribe(resp => {
        this.parametersOfQualityType = resp.body;
        console.log(this.parametersOfQualityType);
      });

      this.parameterService.findByBusinessServiceIdAndParameterType(this.businessServiceId, ParameterType.QUANTITY).subscribe(resp => {
        this.parametersOfQuantityType = resp.body;
        console.log(this.parametersOfQuantityType);
      });
    }

    //receiving new service element
    this.serviceElementSub = this.serviceElementService.toReceive.subscribe(resp => {
      resp.businessService = this.businessService;
      //console.log(resp);
      if (resp.paymentType === PaymentType.MONTHLY) {
        this.serviceElementsOfMonthlyPaymentType!.push(resp);
      } else if (resp.paymentType === PaymentType.DISPOSABLE) {
        this.serviceElementsOfOneTimePaymentType!.push(resp);
      }
    });

    //receiving new parameter
    this.parameterSub = this.parameterService.toReceive.subscribe(resp => {
      resp.businessService = this.businessService;
      console.log(resp);

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
    this.serviceElementsOfMonthlyPaymentType!.forEach(serviceElement => {
      this.serviceElementService.create(serviceElement).subscribe();
    });

    this.serviceElementsOfOneTimePaymentType!.forEach(serviceElement => {
      this.serviceElementService.create(serviceElement).subscribe();
    });

    this.parametersOfQualityType!.forEach(parameter => {
      this.parameterService.create(parameter).subscribe(() => console.log(parameter));
    });

    this.parametersOfQuantityType!.forEach(parameter => {
      this.parameterService.create(parameter).subscribe(() => console.log(parameter));
    });

    this.businessServiceService.update(this.businessService!).subscribe();
    console.log(this.businessService);
    this.router.navigate(['/']);
  }

  onAddServiceElement(paymentType: PaymentType) {
    this.businessServiceService.businessService = this.businessService;
    this.businessServiceService.serviceElementsOfMonthlyPaymentType = this.serviceElementsOfMonthlyPaymentType;
    this.businessServiceService.serviceElementsOfOneTimePaymentType = this.serviceElementsOfOneTimePaymentType;
    this.businessServiceService.parametersOfQualityType = this.parametersOfQualityType;
    this.businessServiceService.parametersOfQuantityType = this.parametersOfQuantityType;

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
    if (parameter.type === ParameterType.QUALITY) {
      this.parametersOfQualityType?.splice(index, 1);
    } else if (parameter.type === ParameterType.QUANTITY) {
      this.parametersOfQuantityType?.splice(index, 1);
    }
  }
}
